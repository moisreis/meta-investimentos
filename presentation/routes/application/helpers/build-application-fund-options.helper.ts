import type { ApplicationFundOption } from "../types/application-add.types"

import { FormatCnpjOptional } from "@/presentation/presenters/cnpj.presenter"
import type { FundRow } from "@/presentation/types/fund-row.types"

/**
 * @summary
 * Derives the fund options from the loaded funds, ordered
 * by label.
 *
 * @remarks
 * The CNPJ goes through the cnpj presenter, so the picker
 * shows the same masked **99.999.999/9999-99** subtitle of
 * the `Fundo` column of the datatables instead of the raw
 * digits stored on the row.
 *
 * @param funds - The registered funds.
 *
 * @returns The fund options, ordered by name.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function BuildApplicationFundOptions(
  funds: FundRow[]
): ApplicationFundOption[] {
  return funds
    .map((fund) => ({
      id: fund.id,
      name: fund.name,
      description: FormatCnpjOptional(fund.cnpj),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
}
