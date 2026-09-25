import { unzipSync } from "fflate"

// Matches any file whose name ends with `.csv`.
const CSV_ENTRY = /\.csv$/i

/**
 * @summary
 * Extracts the **CVM** `INF_DIARIO` CSV files from a
 * monthly archive.
 *
 * @remarks
 * Uses a **fflate** filter to inflate only the `CSV`
 * entries. Since `maio/2022` the monthly layout ships a
 * single consolidated CSV whose rows carry the
 * `CNPJ_FUNDO_CLASSE` column, so the per-fund selection
 * happens downstream, over the parsed rows.
 *
 * @explanation
 * Use this parser to obtain the raw monthly CSV bytes.
 * It keeps memory use low on constrained serverless
 * runtimes by never materializing non-CSV entries.
 *
 * @param bytes - The raw monthly archive bytes.
 *
 * @returns The extracted CSV file bytes.
 *
 * @example
 * const FILES = extractCvmCsvFiles(ZIP);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function extractCvmCsvFiles(
  bytes: Uint8Array
): Uint8Array[] {
  const FILES = unzipSync(bytes, {
    filter: (file) => CSV_ENTRY.test(file.name),
  })

  return Object.values(FILES) as Uint8Array[]
}
