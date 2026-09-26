// Base storage path where statement files are served.
// The file itself is produced by the downstream pipeline.
const STATEMENT_FILE_URL_PREFIX =
  "https://files.example.com/statements"

/**
 * @summary
 * Builds the file url of a generated statement.
 *
 * @remarks
 * The actual file is produced downstream, so the action
 * stores a deterministic placeholder url pointing at the
 * storage location the pipeline will populate.
 *
 * @param input - The target portfolio and month.
 * @param input.portfolioId - The statement portfolio id.
 * @param input.month - The statement month key (`YYYY-MM`).
 *
 * @returns The statement file url.
 *
 * @example
 * const URL = BuildStatementFileUrl({
 *   portfolioId: "portfolio-1",
 *   month: "2026-01",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildStatementFileUrl(input: {
  portfolioId: string
  month: string
}): string {
  return (
    `${STATEMENT_FILE_URL_PREFIX}/` +
    `${input.month}/${input.portfolioId}.pdf`
  )
}
