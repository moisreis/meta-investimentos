"use client"

import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"

import { PORTFOLIO_PERFORMANCE_ALL_PORTFOLIOS_VALUE } from "../settings/labels.settings"

interface UsePortfolioPerformanceWindowOptions {
  // The portfolios the user can calculate over.
  portfolios: PortfolioRow[]
  // The portfolio currently chosen.
  portfolioId: string
  // Reports the next portfolio to the parent.
  onPortfolioChange: (portfolioId: string) => void
}

/**
 * @summary
 * Owns the portfolio picker of the calculate confirm dialog.
 *
 * @remarks
 * The dialog receives `PortfolioRow` records, which carry more
 * than a picker needs, and renders a generic picker, which
 * speaks plain strings. Both halves of that translation are the
 * same in the statement report form, so they live here instead
 * of in the dialog body.
 *
 * The acronym leads the option under the portfolio name,
 * because the same fund can be held by more than one
 * portfolio: the acronym tells two otherwise identical options
 * apart at a glance.
 *
 * Clearing the field falls back to the "all portfolios"
 * sentinel, because a calculation with no portfolio is a
 * calculation over every portfolio — that is what the
 * confirmation is asking.
 *
 * @explanation
 * Use in `PortfolioPerformanceCalculateConfirmDialog`. Call it
 * once with the dialog's `portfolios`, `portfolioId` and
 * `onPortfolioChange` props, and give the picker the `items` it
 * returns.
 *
 * @param options - The portfolio list, the selection, and the
 *   change callback.
 * @param options.portfolios - The portfolios on offer.
 * @param options.portfolioId - The portfolio currently chosen.
 * @param options.onPortfolioChange - Reports the next portfolio.
 *
 * @returns The picker options and the change handler.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function usePortfolioPerformanceWindow({
  portfolios,
  portfolioId,
  onPortfolioChange,
}: UsePortfolioPerformanceWindowOptions) {
  const items: EntityComboboxItem[] = portfolios.map(
    (portfolio) => ({
      id: portfolio.id,
      name: portfolio.name,
      description: portfolio.acronym,
    })
  )

  const handlePortfolioChange = (value: string) =>
    onPortfolioChange(
      value || PORTFOLIO_PERFORMANCE_ALL_PORTFOLIOS_VALUE
    )

  return { portfolioId, items, handlePortfolioChange }
}

export { usePortfolioPerformanceWindow }
