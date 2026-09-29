import type { WithdrawalRow } from "@/presentation/types/withdrawal-row.types"
import type { WithdrawalResponseDTO } from "@/services/withdrawal/dto/withdrawal-response.dto"

/**
 * @summary
 * Projects a withdrawal read model onto the withdrawal row.
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
 * @param dto - The withdrawal read model.
 *
 * @returns The withdrawal row.
 *
 * @example
 * const ROW = ToWithdrawalRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToWithdrawalRow(
  dto: WithdrawalResponseDTO
): WithdrawalRow {
  return {
    id: dto.id,
    positionId: dto.positionId,
    date: dto.date,
    amount: dto.amount,
    quotas: dto.quotas,
    reversedAt: dto.reversedAt,
  }
}

/**
 * @summary
 * Projects the withdrawal read models onto the withdrawal rows.
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
 * @param dtos - The withdrawal read models.
 *
 * @returns The withdrawal rows.
 *
 * @example
 * const ROWS = ToWithdrawalRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToWithdrawalRows(
  dtos: WithdrawalResponseDTO[]
): WithdrawalRow[] {
  return dtos.map(ToWithdrawalRow)
}
