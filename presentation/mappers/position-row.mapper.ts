import type { PositionRow } from "@/presentation/types/position-row.types"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"

/**
 * @summary
 * Projects a position read model onto the position row.
 *
 * @remarks
 * Keeps the 6 fields the screens render
 * and drops 3 that stay in the
 * service layer:
 * `initialBalanceDate`, `version`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The position read model.
 *
 * @returns The position row.
 *
 * @example
 * const ROW = ToPositionRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToPositionRow(
  dto: PositionResponseDTO
): PositionRow {
  return {
    id: dto.id,
    portfolioId: dto.portfolioId,
    fundId: dto.fundId,
    initialBalance: dto.initialBalance,
    allocation: dto.allocation,
    initialBalanceDate: dto.initialBalanceDate,
    version: dto.version,
    updatedAt: dto.updatedAt,
    createdAt: dto.createdAt,
  }
}

/**
 * @summary
 * Projects the position read models onto the position rows.
 *
 * @remarks
 * Keeps the 6 fields the screens render
 * and drops 3 that stay in the
 * service layer:
 * `initialBalanceDate`, `version`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The position read models.
 *
 * @returns The position rows.
 *
 * @example
 * const ROWS = ToPositionRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToPositionRows(
  dtos: PositionResponseDTO[]
): PositionRow[] {
  return dtos.map(ToPositionRow)
}
