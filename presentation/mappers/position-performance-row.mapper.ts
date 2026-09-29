import type { PositionPerformanceRow } from "@/presentation/types/position-performance-row.types"
import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"

/**
 * @summary
 * Projects a position performance read model onto the position performance row.
 *
 * @remarks
 * Keeps the 6 fields the screens render
 * and drops 9 that stay in the
 * service layer:
 * `applicationTotal`, `redemptionTotal`, `cashFlowNet`,
 *   `earnings`, `returnMonthly`, `returnYearly`,
 *   `returnLast12m`, `allocation`, `createdAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The position performance read model.
 *
 * @returns The position performance row.
 *
 * @example
 * const ROW = ToPositionPerformanceRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToPositionPerformanceRow(
  dto: PositionPerformanceResponseDTO
): PositionPerformanceRow {
  return {
    id: dto.id,
    positionId: dto.positionId,
    date: dto.date,
    quotasHeld: dto.quotasHeld,
    patrimony: dto.patrimony,
    returnDaily: dto.returnDaily,
  }
}

/**
 * @summary
 * Projects the position performance read models onto the position performance rows.
 *
 * @remarks
 * Keeps the 6 fields the screens render
 * and drops 9 that stay in the
 * service layer:
 * `applicationTotal`, `redemptionTotal`, `cashFlowNet`,
 *   `earnings`, `returnMonthly`, `returnYearly`,
 *   `returnLast12m`, `allocation`, `createdAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The position performance read models.
 *
 * @returns The position performance rows.
 *
 * @example
 * const ROWS = ToPositionPerformanceRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToPositionPerformanceRows(
  dtos: PositionPerformanceResponseDTO[]
): PositionPerformanceRow[] {
  return dtos.map(ToPositionPerformanceRow)
}
