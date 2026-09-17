import { unzipSync } from "fflate"

// Matches any file whose name ends with `.csv`.
const CSV_ENTRY = /\.csv$/i

/**
 * @summary
 * Extracts **CVM** `INF_DIARIO` CSV files that match the
 * requested CNPJs.
 *
 * @remarks
 * Uses a **fflate** filter to inflate only the matching
 * entries. Unmatched entries are skipped and never
 * materialized.
 *
 * @explanation
 * Use this parser to avoid holding the thousands of entries
 * inside a monthly archive. It keeps memory use low on
 * constrained serverless runtimes.
 *
 * @param bytes - The raw monthly archive bytes.
 * @param cnpjs - The target fund CNPJ digit strings.
 * @returns The matching CSV file bytes.
 *
 * @example
 * const FILES = extractCvmFundFiles(ZIP, CNPJS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
export function extractCvmFundFiles(
  bytes: Uint8Array,
  cnpjs: Set<string>,
): Uint8Array[] {
  const FILES = unzipSync(bytes, {
    filter: (file) =>
      CSV_ENTRY.test(file.name) &&
      Array.from(cnpjs).some((cnpj) => file.name.includes(cnpj)),
  })

  return Object.values(FILES) as Uint8Array[]
}