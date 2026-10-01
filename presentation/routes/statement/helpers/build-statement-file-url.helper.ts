// Base public url where the app serves the statement pdfs.
const APP_BASE_URL =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
  "http://localhost:3000"

/**
 * @summary
 * Builds the file url of a generated statement.
 *
 * @remarks
 * Points the url at the app's on-demand statement pdf route,
 * so opening a report renders the file through the same job
 * the generation pipeline runs. The url stays deterministic:
 * the portfolio id and the month key fully describe the
 * report, with no storage dependency.
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
  const QUERY = new URLSearchParams({
    portfolioId: input.portfolioId,
    month: input.month,
  })

  return `${APP_BASE_URL}/api/statement-pdf?${QUERY.toString()}`
}
