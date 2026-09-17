/**
 * @summary
 * Represents the shape of the statement response.
 *
 * @remarks
 * This DTO is the format of the response for statement
 * queries and generation. All ids are strings and all
 * dates are ISO 8601 strings.
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
  id: string
  // Null for portfolio-wide statements.
  portfolioId: string | null
  periodStart: string
  periodEnd: string
  // Location of the generated statement file.
  fileUrl: string
  generatedByUserId: string | null
  createdAt: string
}
