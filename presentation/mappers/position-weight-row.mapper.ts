import type { PositionWeightRow } from "@/presentation/types/position-weight-row.types"
import type { PositionWeightResponseDTO } from "@/services/position/dto/position-weight-response.dto"

/**
 * @summary
 * Projects the position weight read model onto the
 * position weight row.
 *
 * @remarks
 * Keeps the 5 fields the screens render and copies them
 * as they are, because the share is already normalized by
 * the service layer.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so dialogs, forms and
 * hooks never import a DTO.
 *
 * @param dto - The position weight read model.
 *
 * @returns The position weight row.
 *
 * @example
 * const ROW = ToPositionWeightRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function ToPositionWeightRow(
  dto: PositionWeightResponseDTO
): PositionWeightRow {
  return {
    positionId: dto.positionId,
    portfolioId: dto.portfolioId,
    fundId: dto.fundId,
    weight: dto.weight,
    investedValue: dto.investedValue,
  }
}

/**
 * @summary
 * Projects the position weight read models onto the
 * position weight rows.
 *
 * @remarks
 * Keeps the 5 fields the screens render and copies them
 * as they are, because the share is already normalized by
 * the service layer.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so dialogs, forms and
 * hooks never import a DTO.
 *
 * @param dtos - The position weight read models.
 *
 * @returns The position weight rows.
 *
 * @example
 * const ROWS = ToPositionWeightRows(DTOS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function ToPositionWeightRows(
  dtos: PositionWeightResponseDTO[]
): PositionWeightRow[] {
  return dtos.map(ToPositionWeightRow)
}
