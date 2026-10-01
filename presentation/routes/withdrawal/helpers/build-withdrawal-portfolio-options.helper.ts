import type { WithdrawalPortfolioOption } from "../types/withdrawal-add.types"

import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"

/**
 * @summary
 * Derives the portfolio options from the loaded portfolios,
 * ordered by label.
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
export function BuildWithdrawalPortfolioOptions(
  portfolios: PortfolioRow[]
): WithdrawalPortfolioOption[] {
  return portfolios
    .map((portfolio) => ({
      id: portfolio.id,
      name: portfolio.name,
      description: portfolio.acronym,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
}
