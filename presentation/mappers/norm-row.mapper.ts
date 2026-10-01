import type { NormRow } from "@/presentation/types/norm-row.types"
import type { NormResponseDTO } from "@/services/norm/dto/norm-response.dto"

/**
 * @summary
 * Projects a norm read model onto the norm row.
 *
 * @remarks
 * Keeps the 7 fields the screens render and drops
 * `createdAt` and `updatedAt`, which stay in the service
 * layer.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables, dialogs,
 * forms and hooks never import a DTO.
 *
 * @param dto - The norm read model.
 *
 * @returns The norm row.
 *
 * @example
 * const ROW = ToNormRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export function ToNormRow(dto: NormResponseDTO): NormRow {
  return {
    id: dto.id,
    articleNumber: dto.articleNumber,
    name: dto.name,
    categoryId: dto.categoryId,
    minAllocation: dto.minAllocation,
    maxAllocation: dto.maxAllocation,
    targetAllocation: dto.targetAllocation,
  }
}

/**
 * @summary
 * Projects the norm read models onto the norm rows.
 *
 * @remarks
 * Keeps the 7 fields the screens render and drops
 * `createdAt` and `updatedAt`, which stay in the service
 * layer.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables, dialogs,
 * forms and hooks never import a DTO.
 *
 * @param dtos - The norm read models.
 *
 * @returns The norm rows.
 *
 * @example
 * const ROWS = ToNormRows(DTOS);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export function ToNormRows(dtos: NormResponseDTO[]): NormRow[] {
  return dtos.map(ToNormRow)
}
