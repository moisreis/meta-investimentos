import type { BankRow } from "@/presentation/types/bank-row.types"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"

/**
 * @summary
 * Projects a bank read model onto the bank row.
 *
 * @remarks
 * Keeps the 3 fields the screens render
 * and drops 2 that stay in the
 * service layer:
 * `createdAt`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The bank read model.
 *
 * @returns The bank row.
 *
 * @example
 * const ROW = ToBankRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToBankRow(dto: BankResponseDTO): BankRow {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
  }
}

/**
 * @summary
 * Projects the bank read models onto the bank rows.
 *
 * @remarks
 * Keeps the 3 fields the screens render
 * and drops 2 that stay in the
 * service layer:
 * `createdAt`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The bank read models.
 *
 * @returns The bank rows.
 *
 * @example
 * const ROWS = ToBankRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToBankRows(dtos: BankResponseDTO[]): BankRow[] {
  return dtos.map(ToBankRow)
}
