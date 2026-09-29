/**
 * @summary
 * Time window accepted by the CVM fund valuation import.
 *
 * @remarks
 * Resolved to a UTC date range by the import use case.
 *
 * @explanation
 * Use this type for the import window selector and for the
 * import job payload. It is the single declaration shared by
 * the service layer, the job runner and the presentation
 * layer, so the three never drift.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export type CvmImportWindow =
  | "today"
  | "week"
  | "month"
  | "year-to-date"
  | "last-2-months"
  | "last-6-months"
