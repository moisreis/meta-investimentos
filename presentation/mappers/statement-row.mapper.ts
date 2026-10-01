import type { StatementRow } from "@/presentation/types/statement-row.types"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

/**
 * @summary
 * Projects a statement read model onto the statement row.
 *
 * @remarks
 * Maps the fields rendered by the statement screens.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The statement read model.
 *
 * @returns The statement row.
 *
 * @example
 * const ROW = ToStatementRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToStatementRow(
  dto: StatementResponseDTO
): StatementRow {
  return {
    id: dto.id,
    portfolioId: dto.portfolioId,
    periodStart: dto.periodStart,
    fileUrl: dto.fileUrl,
    generatedByUserId: dto.generatedByUserId,
    periodEnd: dto.periodEnd,
    createdAt: dto.createdAt,
  }
}

/**
 * @summary
 * Projects the statement read models onto the statement rows.
 *
 * @remarks
 * Maps the fields rendered by the statement screens.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The statement read models.
 *
 * @returns The statement rows.
 *
 * @example
 * const ROWS = ToStatementRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToStatementRows(
  dtos: StatementResponseDTO[]
): StatementRow[] {
  return dtos.map(ToStatementRow)
}
