import type { ICvmClient } from "@/business/interfaces/cvm/cvm-client.interface";
import type { CvmImportContext, DownloadedFile } from "./types";

/**
 * The result of a download batch.
 */
export interface DownloadResult {
  files: DownloadedFile[];
  unavailableCount: number;
  errorCount: number;
  lastError?: string;
}

/**
 * Downloads all monthly files required by the import context.
 *
 * The function iterates over each `(year, month)` tuple implied by the
 * date range and `monthsBack` setting and fetches the corresponding
 * `INF_DIARIO` zip. A `404` or `403` is treated as an unavailable
 * file; other errors are captured and the function continues with the
 * next file.
 *
 * @param client - The CVM client used to fetch each monthly file.
 * @param context - The resolved import context.
 * @returns The download result with the files retrieved and the counts
 *   of unavailable or failed files.
 */
export async function downloadFiles(
  client: ICvmClient,
  context: CvmImportContext,
): Promise<DownloadResult> {
  const NOW = new Date();
  const END_YEAR = context.requestedEnd
    ? context.requestedEnd.getFullYear()
    : NOW.getFullYear();
  const END_MONTH = context.requestedEnd
    ? context.requestedEnd.getMonth() + 1
    : NOW.getMonth() + 1;

  const MONTHS_BACK = context.monthsBack ?? 12;

  const FILES: DownloadedFile[] = [];
  let UNAVAILABLE = 0;
  const ERRORS = 0;
  let LAST_ERROR: string | undefined;

  for (let I = 0; I < MONTHS_BACK; I++) {
    const TARGET_MONTH = END_MONTH - I;
    const TARGET_YEAR =
      END_YEAR - (TARGET_MONTH <= 0 ? Math.ceil((1 - TARGET_MONTH) / 12) : 0);
    const NORMALIZED_MONTH = ((TARGET_MONTH - 1 + 12) % 12) + 1;

    const DATA = await client.fetchMonthlyFile(TARGET_YEAR, NORMALIZED_MONTH);

    if (DATA === null) {
      UNAVAILABLE++;
      continue;
    }

    FILES.push({
      year: TARGET_YEAR,
      month: NORMALIZED_MONTH,
      data: DATA,
    });
  }

  return {
    files: FILES,
    unavailableCount: UNAVAILABLE,
    errorCount: ERRORS,
    lastError: LAST_ERROR,
  };
}
