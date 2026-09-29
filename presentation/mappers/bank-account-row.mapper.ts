import type { BankAccountRow } from "@/presentation/types/bank-account-row.types"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"

/**
 * @summary
 * Projects a bank account read model onto the bank account row.
 *
 * @remarks
 * Keeps the 5 fields the screens render
 * and drops 2 that stay in the
 * service layer:
 * `createdAt`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The bank account read model.
 *
 * @returns The bank account row.
 *
 * @example
 * const ROW = ToBankAccountRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToBankAccountRow(
  dto: BankAccountResponseDTO
): BankAccountRow {
  return {
    id: dto.id,
    portfolioId: dto.portfolioId,
    bankId: dto.bankId,
    agency: dto.agency,
    accountNumber: dto.accountNumber,
  }
}

/**
 * @summary
 * Projects the bank account read models onto the bank account rows.
 *
 * @remarks
 * Keeps the 5 fields the screens render
 * and drops 2 that stay in the
 * service layer:
 * `createdAt`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The bank account read models.
 *
 * @returns The bank account rows.
 *
 * @example
 * const ROWS = ToBankAccountRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToBankAccountRows(
  dtos: BankAccountResponseDTO[]
): BankAccountRow[] {
  return dtos.map(ToBankAccountRow)
}
