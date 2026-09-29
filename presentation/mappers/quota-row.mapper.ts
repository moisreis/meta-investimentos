import type { QuotaRow } from "@/presentation/types/quota-row.types"
import type { QuotaResponseDTO } from "@/services/quota/dto/quota-response.dto"

/**
 * @summary
 * Projects a quota read model onto the quota row.
 *
 * @remarks
 * Keeps the 4 fields the screens render
 * and drops 1 that stay in the
 * service layer:
 * `createdAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The quota read model.
 *
 * @returns The quota row.
 *
 * @example
 * const ROW = ToQuotaRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToQuotaRow(dto: QuotaResponseDTO): QuotaRow {
  return {
    id: dto.id,
    fundId: dto.fundId,
    date: dto.date,
    price: dto.price,
  }
}

/**
 * @summary
 * Projects the quota read models onto the quota rows.
 *
 * @remarks
 * Keeps the 4 fields the screens render
 * and drops 1 that stay in the
 * service layer:
 * `createdAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The quota read models.
 *
 * @returns The quota rows.
 *
 * @example
 * const ROWS = ToQuotaRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToQuotaRows(
  dtos: QuotaResponseDTO[]
): QuotaRow[] {
  return dtos.map(ToQuotaRow)
}
