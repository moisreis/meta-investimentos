import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the payload for generating a `Statement`.
 *
 * @remarks
 * The period start must not be after the period end.
 * The portfolio id is optional for portfolio-wide
 * statements.
 *
 * @explanation
 * Use this DTO to request the generation of a statement
 * through the service layer.
 *
 * @example
 * const DTO: GenerateStatementDTO = {
 *   portfolioId: EntityId.create("portfolio-1"),
 *   periodStart: new Date("2026-01-01"),
 *   periodEnd: new Date("2026-01-31"),
 *   generatedByUserId: EntityId.create("user-1"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface GenerateStatementDTO {
  portfolioId?: EntityId | null
  periodStart: Date
  periodEnd: Date
  generatedByUserId?: EntityId | null
}
