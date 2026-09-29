import { FormatCnpjOptional } from "@/presentation/presenters/cnpj.presenter"
import type { FundRow } from "@/presentation/types/fund-row.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"

/**
 * @summary
 * Fund offered by the add application form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface ApplicationFundOption {
  id: string
  name: string
  // Masked CNPJ rendered under the fund name. Absent when
  // the fund has no usable CNPJ, so the picker drops the
  // second line instead of showing a blank one.
  description?: string
}

/**
 * @summary
 * Portfolio offered by the add application form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export interface ApplicationPortfolioOption {
  id: string
  // Portfolio name rendered above the acronym.
  name: string
  // Portfolio acronym rendered under the name.
  description: string
}

// Options consumed by the add application form.
export interface ApplicationAddOptions {
  funds: ApplicationFundOption[]
  portfolios: ApplicationPortfolioOption[]
}

// Empty options used before the loader resolves.
export const EMPTY_APPLICATION_ADD_OPTIONS: ApplicationAddOptions =
  {
    funds: [],
    portfolios: [],
  }

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

/**
 * @summary
 * Derives the portfolio options from the loaded
 * portfolios, ordered by label.
 *
 * @remarks
 * The acronym is kept as the description of the option so
 * the picker renders the portfolio name above the acronym,
 * matching the `Carteira` column of the datatables.
 *
 * @param portfolios - The portfolios of the session user.
 *
 * @returns The portfolio options, ordered by name.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildApplicationPortfolioOptions(
  portfolios: PortfolioRow[]
): ApplicationPortfolioOption[] {
  return portfolios
    .map((portfolio) => ({
      id: portfolio.id,
      name: portfolio.name,
      description: portfolio.acronym,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
}
