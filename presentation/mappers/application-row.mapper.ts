import type { ApplicationRow } from "@/presentation/types/application-row.types"
import type { ApplicationResponseDTO } from "@/services/application/dto/application-response.dto"

/**
 * @summary
 * Projects a application read model onto the application row.
 *
 * @remarks
 * Keeps the 6 fields the screens render
 * and drops 3 that stay in the
 * service layer:
 * `reversedByUserId`, `createdAt`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The application read model.
 *
 * @returns The application row.
 *
 * @example
 * const ROW = ToApplicationRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToApplicationRow(
  dto: ApplicationResponseDTO
): ApplicationRow {
  return {
    id: dto.id,
    positionId: dto.positionId,
    date: dto.date,
    amount: dto.amount,
    quotas: dto.quotas,
    quotaValue:
      dto.quotaValue ??
      (dto.quotas !== "0"
        ? (Number(dto.amount) / Number(dto.quotas)).toFixed(4)
        : "0"),
    reversedAt: dto.reversedAt,
  }
}

/**
 * @summary
 * Projects the application read models onto the application rows.
 *
 * @remarks
 * Keeps the 6 fields the screens render
 * and drops 3 that stay in the
 * service layer:
 * `reversedByUserId`, `createdAt`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The application read models.
 *
 * @returns The application rows.
 *
 * @example
 * const ROWS = ToApplicationRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToApplicationRows(
  dtos: ApplicationResponseDTO[]
): ApplicationRow[] {
  return dtos.map(ToApplicationRow)
}
