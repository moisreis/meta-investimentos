import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Represents the shape of the statement response.
 *
 * @remarks
 * This DTO is the format of the response for statement
 * queries and generation.
 *
 * @explanation
 * Use this DTO when exposing a generated statement to
 * the consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(STATEMENT_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface StatementResponseDTO {
  id: EntityId
  // Null for portfolio-wide statements.
  portfolioId: EntityId | null
  periodStart: Date
  periodEnd: Date
  // Location of the generated statement file.
  fileUrl: string
  generatedByUserId: EntityId | null
  createdAt: Date
}
