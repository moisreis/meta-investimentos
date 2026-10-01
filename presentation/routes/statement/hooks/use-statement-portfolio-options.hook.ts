"use client"

import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"

interface UseStatementPortfolioOptionsOptions {
  // The portfolios the report can be generated for.
  portfolios: PortfolioRow[]
  // The portfolio currently chosen.
  portfolioId: string
  // Reports the next portfolio to the form hook.
  updatePortfolioId: (portfolioId: string) => void
}

/**
 * @summary
 * Owns the portfolio picker of the report form.
 *
 * @remarks
 * The form receives `PortfolioRow` records, which carry more
 * than a picker needs, and renders a generic picker, which
 * speaks plain strings. The statement form is the one place
 * where the portfolio is required, so clearing the field falls
 * back to the empty string and lets the schema reject it,
 * rather than substituting a sentinel the schema would not
 * recognise.
 *
 * The acronym leads the option under the portfolio name,
 * because the same fund can be held by more than one
 * portfolio: the acronym tells two otherwise identical options
 * apart at a glance.
 *
 * @explanation
 * Use in `StatementGenerateReportForm`. Call it once with the
 * form's `portfolios`, `portfolioId` and `updatePortfolioId`,
 * and give the picker the `items` it returns.
 *
 * @param options - The portfolio list, the selection, and the
 *   form update callback.
 * @param options.portfolios - The portfolios on offer.
 * @param options.portfolioId - The portfolio currently chosen.
 * @param options.updatePortfolioId - Reports the next portfolio.
 *
 * @returns The picker options and the change handler.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useStatementPortfolioOptions({
  portfolios,
  portfolioId,
  updatePortfolioId,
}: UseStatementPortfolioOptionsOptions) {
  const items: EntityComboboxItem[] = portfolios.map(
    (portfolio) => ({
      id: portfolio.id,
      name: portfolio.name,
      description: portfolio.acronym,
    })
  )

  const handlePortfolioIdChange = (value: string) =>
    updatePortfolioId(value || "")

  return { portfolioId, items, handlePortfolioIdChange }
}

export { useStatementPortfolioOptions }
