/**
 * @summary
 * Defines the payload for generating a `Statement`.
 *
 * @remarks
 * The period must not start after it ends. Period dates
 * are ISO 8601 strings. The portfolio id is optional for
 * portfolio-wide statements.
 *
 * @explanation
 * Use this DTO to request the generation of a statement
 * through the service layer.
 *
 * @example
 * const DTO: GenerateStatementDTO = {
 *   portfolioId: "portfolio-1",
 *   periodStart: "2026-01-01T00:00:00.000Z",
 *   periodEnd: "2026-01-31T00:00:00.000Z",
 *   generatedByUserId: "user-1",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface GenerateStatementDTO {
  portfolioId?: string | null
  periodStart: string
  periodEnd: string
  generatedByUserId?: string | null
}
