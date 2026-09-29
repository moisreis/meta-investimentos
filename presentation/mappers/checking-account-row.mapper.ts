import type { CheckingAccountRow } from "@/presentation/types/checking-account-row.types"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

/**
 * @summary
 * Projects a checking account read model onto the checking account row.
 *
 * @remarks
 * Copies the 4 fields the screens
 * render. The shapes match today, so the copy only
 * exists to keep the boundary explicit and uniform.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The checking account read model.
 *
 * @returns The checking account row.
 *
 * @example
 * const ROW = ToCheckingAccountRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToCheckingAccountRow(
  dto: CheckingAccountResponseDTO
): CheckingAccountRow {
  return {
    id: dto.id,
    bankAccountId: dto.bankAccountId,
    date: dto.date,
    value: dto.value,
  }
}

/**
 * @summary
 * Projects the checking account read models onto the checking account rows.
 *
 * @remarks
 * Copies the 4 fields the screens
 * render. The shapes match today, so the copy only
 * exists to keep the boundary explicit and uniform.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The checking account read models.
 *
 * @returns The checking account rows.
 *
 * @example
 * const ROWS = ToCheckingAccountRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToCheckingAccountRows(
  dtos: CheckingAccountResponseDTO[]
): CheckingAccountRow[] {
  return dtos.map(ToCheckingAccountRow)
}
