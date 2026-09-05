import type { CvmImport } from "@/business/entities/cvm/cvm-import.entity";

/**
 * The public envelope of a CVM import summary.
 */
export interface CvmImportApiDto {
  id: string | null;
  source: string;
  status: string;
  requestedStart: string | null;
  requestedEnd: string | null;
  requestedFundCnpjs: string[] | null;
  monthsBack: number;
  filesFound: number;
  filesDownloaded: number;
  filesUnavailable: number;
  recordsMatched: number;
  recordsImported: number;
  recordsUpserted: number;
  recordsSkipped: number;
  error: string | null;
  startedAt: string;
  finishedAt: string | null;
  createdAt: string;
}

/**
 * Maps a `CvmImport` entity to its API representation.
 *
 * @param entry - The import entity.
 * @returns The serializable DTO.
 */
export function toCvmImportApiDto(entry: CvmImport): CvmImportApiDto {
  return {
    id: entry.id ? entry.id.toString() : null,
    source: entry.source,
    status: entry.status,
    requestedStart: entry.requestedStart?.toISOString() ?? null,
    requestedEnd: entry.requestedEnd?.toISOString() ?? null,
    requestedFundCnpjs: entry.requestedFundCnpjs ?? null,
    monthsBack: entry.monthsBack,
    filesFound: entry.filesFound,
    filesDownloaded: entry.filesDownloaded,
    filesUnavailable: entry.filesUnavailable,
    recordsMatched: entry.recordsMatched,
    recordsImported: entry.recordsImported,
    recordsUpserted: entry.recordsUpserted,
    recordsSkipped: entry.recordsSkipped,
    error: entry.error ?? null,
    startedAt: entry.startedAt.toISOString(),
    finishedAt: entry.finishedAt?.toISOString() ?? null,
    createdAt: entry.createdAt.toISOString(),
  };
}
