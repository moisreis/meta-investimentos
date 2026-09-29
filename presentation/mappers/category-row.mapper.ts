import type { CategoryRow } from "@/presentation/types/category-row.types"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"

/**
 * @summary
 * Projects a category read model onto the category row.
 *
 * @remarks
 * Keeps the 2 fields the screens render
 * and drops 2 that stay in the
 * service layer:
 * `createdAt`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The category read model.
 *
 * @returns The category row.
 *
 * @example
 * const ROW = ToCategoryRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToCategoryRow(
  dto: CategoryResponseDTO
): CategoryRow {
  return {
    id: dto.id,
    name: dto.name,
  }
}

/**
 * @summary
 * Projects the category read models onto the category rows.
 *
 * @remarks
 * Keeps the 2 fields the screens render
 * and drops 2 that stay in the
 * service layer:
 * `createdAt`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The category read models.
 *
 * @returns The category rows.
 *
 * @example
 * const ROWS = ToCategoryRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToCategoryRows(
  dtos: CategoryResponseDTO[]
): CategoryRow[] {
  return dtos.map(ToCategoryRow)
}
