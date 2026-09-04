import { CvmImport } from "@/business/entities/cvm/cvm-import.entity";
import { QuotaImport } from "@/business/entities/cvm/quota-import.entity";
import type { ICvmClient } from "@/business/interfaces/cvm/cvm-client.interface";
import type { ICvmImport } from "@/business/interfaces/cvm/cvm-import.interface";
import type { IQuotaImport } from "@/business/interfaces/cvm/quota-import.interface";
import type { IFund } from "@/business/interfaces/fund/fund.interface";
import type {
  IQuota,
  UpsertQuotaResult,
} from "@/business/interfaces/fund/quota.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { downloadFiles } from "./download-files.part";
import { extractFiles } from "./extract-files.part";
import { matchRecords } from "./match-records.part";
import { parseCsv } from "./parse-csv.part";
import { resolveOptions } from "./resolve-options.part";
import { sanitizeRecords } from "./sanitize-records.part";
import { upsertQuotas } from "./upsert-quotas.part";

/**
 * The options accepted by the orchestrator.
 */
export interface CvmImportOrchestratorOptions {
  client: ICvmClient;
  funds: IFund;
  quotaRepo: IQuota;
  cvmImportRepo: ICvmImport;
  quotaImportRepo: IQuotaImport;
  requestedStart?: Date;
  requestedEnd?: Date;
  monthsBack?: number;
  requestedCnpjs?: string[];
}

/**
 * Orchestrates a full CVM historical quota import.
 *
 * The orchestrator performs the 10-step pipeline:
 * 1. Create a RUNNING summary record.
 * 2. Resolve options (fund map, date range).
 * 3. Download monthly files.
 * 4. Extract CSV from zips.
 * 5. Parse CSVs into raw records.
 * 6. Match CNPJs to known funds.
 * 7. Sanitize and validate records.
 * 8. Upsert quotas.
 * 9. Record provenance (quota_import rows).
 * 10. Finalize the summary record.
 *
 * The function returns the finalized {@link CvmImport} summary.
 */
export async function orchestrateCvmImport(
  options: CvmImportOrchestratorOptions,
): Promise<CvmImport> {
  const STARTED_AT = new Date();

  let summary = CvmImport.create({
    source: "CVM",
    status: "RUNNING",
    requestedStart: options.requestedStart,
    requestedEnd: options.requestedEnd,
    requestedFundCnpjs: options.requestedCnpjs,
    monthsBack: options.monthsBack ?? 12,
    filesFound: 0,
    filesDownloaded: 0,
    filesUnavailable: 0,
    recordsMatched: 0,
    recordsImported: 0,
    recordsUpserted: 0,
    recordsSkipped: 0,
    startedAt: STARTED_AT,
  });

  summary = await options.cvmImportRepo.save(summary);

  if (!summary.id) {
    throw new Error("Failed to persist the import summary record.");
  }

  const IMPORT_ID: string = summary.id;

  try {
    const CONTEXT = await resolveOptions(
      options.funds,
      options.requestedStart,
      options.requestedEnd,
      options.monthsBack ?? 12,
      options.requestedCnpjs,
      IMPORT_ID,
    );

    const DOWNLOAD = await downloadFiles(options.client, CONTEXT);

    const EXTRACTED = extractFiles(DOWNLOAD.files);

    const RAW_RECORDS = parseCsv(EXTRACTED);

    const MATCH = matchRecords(RAW_RECORDS, CONTEXT);

    const SANITIZE = sanitizeRecords(MATCH.matched);

    const UPSERT = await upsertQuotas(options.quotaRepo, SANITIZE.sanitized);

    await writeProvenanceAndFinalize(
      summary,
      options,
      IMPORT_ID,
      SANITIZE.sanitized,
      UPSERT,
      DOWNLOAD,
      { matchedCount: MATCH.matched.length, skippedCount: MATCH.skippedCount },
      SANITIZE,
    );

    return summary;
  } catch (error) {
    const MESSAGE = error instanceof Error ? error.message : String(error);

    summary = CvmImport.create({
      source: summary.source,
      status: "FAILED",
      requestedStart: summary.requestedStart,
      requestedEnd: summary.requestedEnd,
      requestedFundCnpjs: summary.requestedFundCnpjs,
      monthsBack: summary.monthsBack,
      filesFound: summary.filesFound,
      filesDownloaded: summary.filesDownloaded,
      filesUnavailable: summary.filesUnavailable,
      recordsMatched: summary.recordsMatched,
      recordsImported: summary.recordsImported,
      recordsUpserted: summary.recordsUpserted,
      recordsSkipped: summary.recordsSkipped,
      error: MESSAGE,
      startedAt: summary.startedAt,
      finishedAt: new Date(),
    });

    summary = await options.cvmImportRepo.save(summary);

    return summary;
  }
}

/**
 * Writes the provenance records and finalizes the import summary.
 */
async function writeProvenanceAndFinalize(
  summary: CvmImport,
  options: CvmImportOrchestratorOptions,
  importId: string,
  sanitized: Array<{ fundId: string; date: Date; price: string }>,
  upsertResults: UpsertQuotaResult[],
  download: {
    files: Array<{ year: number; month: number }>;
    unavailableCount: number;
  },
  match: { matchedCount: number; skippedCount: number },
  sanitize: { skippedCount: number },
): Promise<void> {
  const upsertMap = new Map<string, UpsertQuotaResult>();
  for (const R of upsertResults) {
    upsertMap.set(`${R.fundId}:${R.date.getTime()}`, R);
  }

  const QUOTA_IMPORT_RECORDS: QuotaImport[] = [];

  for (const R of sanitized) {
    const KEY = `${R.fundId}:${R.date.getTime()}`;
    const UPSERT = upsertMap.get(KEY);

    QUOTA_IMPORT_RECORDS.push(
      QuotaImport.create({
        importId: EntityId.create(importId),
        fundId: EntityId.create(R.fundId),
        date: R.date,
        price: QuotaPrice.create(R.price),
        action: UPSERT?.action ?? "SKIP",
      }),
    );
  }

  if (QUOTA_IMPORT_RECORDS.length > 0) {
    await options.quotaImportRepo.saveMany(QUOTA_IMPORT_RECORDS);
  }

  const INSERTED = upsertResults.filter((R) => R.action === "INSERT").length;
  const UPDATED = upsertResults.filter((R) => R.action === "UPDATE").length;

  const HAS_FAILURES =
    download.unavailableCount > 0 || sanitize.skippedCount > 0;
  const STATUS = HAS_FAILURES ? "PARTIAL" : "SUCCESS";

  const FINALIZED = CvmImport.create(
    {
      source: summary.source,
      status: STATUS,
      requestedStart: summary.requestedStart,
      requestedEnd: summary.requestedEnd,
      requestedFundCnpjs: summary.requestedFundCnpjs,
      monthsBack: summary.monthsBack,
      filesFound: download.files.length + download.unavailableCount,
      filesDownloaded: download.files.length,
      filesUnavailable: download.unavailableCount,
      recordsMatched: match.matchedCount,
      recordsImported: INSERTED + UPDATED,
      recordsUpserted: UPDATED,
      recordsSkipped: match.skippedCount + sanitize.skippedCount,
      startedAt: summary.startedAt,
      finishedAt: new Date(),
    },
    summary.id,
  );

  await options.cvmImportRepo.save(FINALIZED);

  Object.assign(summary, FINALIZED);
}
