import type { CvmImport } from "@/business/entities/cvm/cvm-import.entity";
import type { ICvmClient } from "@/business/interfaces/cvm/cvm-client.interface";
import type { ICvmImport } from "@/business/interfaces/cvm/cvm-import.interface";
import type { IQuotaImport } from "@/business/interfaces/cvm/quota-import.interface";
import type { IFund } from "@/business/interfaces/fund/fund.interface";
import type { IQuota } from "@/business/interfaces/fund/quota.interface";
import { orchestrateCvmImport } from "@/infrastructure/cvm/cvm-import.orchestrator";

/**
 * Input for {@link runCvmImport}.
 */
export interface RunCvmImportInput {
  /**
   * The CVM client used to fetch data.
   */
  client: ICvmClient;

  /**
   * The start of the date range to import (optional).
   */
  requestedStart?: Date;

  /**
   * The end of the date range to import (optional).
   */
  requestedEnd?: Date;

  /**
   * The number of months to look back when no date range is provided.
   */
  monthsBack?: number;

  /**
   * An optional subset of fund CNPJs to import.
   */
  requestedCnpjs?: string[];
}

/**
 * The dependencies required by the use case.
 */
export interface RunCvmImportDeps {
  funds: IFund;
  quotas: IQuota;
  cvmImports: ICvmImport;
  quotaImports: IQuotaImport;
}

/**
 * Orchestrates a full CVM historical quota import.
 *
 * The use case delegates to the infrastructure orchestrator which
 * performs the 10-step pipeline: download → extract → parse → match →
 * sanitize → upsert → record provenance → finalize summary.
 *
 * @param deps - The repositories required by the orchestrator.
 * @param input - The import options.
 * @returns The finalized {@link CvmImport} summary.
 */
export async function runCvmImport(
  deps: RunCvmImportDeps,
  input: RunCvmImportInput,
): Promise<CvmImport> {
  return orchestrateCvmImport({
    client: input.client,
    funds: deps.funds,
    quotaRepo: deps.quotas,
    cvmImportRepo: deps.cvmImports,
    quotaImportRepo: deps.quotaImports,
    requestedStart: input.requestedStart,
    requestedEnd: input.requestedEnd,
    monthsBack: input.monthsBack,
    requestedCnpjs: input.requestedCnpjs,
  });
}
