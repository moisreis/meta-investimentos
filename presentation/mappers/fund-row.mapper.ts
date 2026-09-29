import type { FundRow } from "@/presentation/types/fund-row.types"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

/**
 * @summary
 * Projects a fund read model onto the fund row.
 *
 * @remarks
 * Keeps the 8 fields the screens render
 * and drops 2 that stay in the
 * service layer:
 * `createdAt`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The fund read model.
 *
 * @returns The fund row.
 *
 * @example
 * const ROW = ToFundRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToFundRow(dto: FundResponseDTO): FundRow {
  return {
    id: dto.id,
    cnpj: dto.cnpj,
    name: dto.name,
    administrationFee: dto.administrationFee,
    performanceFee: dto.performanceFee,
    bankId: dto.bankId,
    benchmarkId: dto.benchmarkId,
    categoryId: dto.categoryId,
  }
}

/**
 * @summary
 * Projects the fund read models onto the fund rows.
 *
 * @remarks
 * Keeps the 8 fields the screens render
 * and drops 2 that stay in the
 * service layer:
 * `createdAt`, `updatedAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The fund read models.
 *
 * @returns The fund rows.
 *
 * @example
 * const ROWS = ToFundRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToFundRows(dtos: FundResponseDTO[]): FundRow[] {
  return dtos.map(ToFundRow)
}
