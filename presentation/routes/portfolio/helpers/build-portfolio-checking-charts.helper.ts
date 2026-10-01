import type { DateRange } from "react-day-picker"

import type {
  EntityChartModel,
  EntityChartSeries,
} from "@/presentation/parts/charts/entity-chart.types"
import {
  FormatCompactCurrency,
  FormatCurrency,
} from "@/presentation/presenters/currency.presenter"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"
import type { PortfolioBankAccountView } from "@/presentation/types/portfolio-checking.types"

import { PORTFOLIO_CHECKING } from "../settings/labels.settings"

// Keys of the chart container ids, kept stable so the
// generated gradients and the injected colors survive a
// re-render of the same chart.
const BALANCE_CHART_ID = "portfolio-checking-evolution"
const BALANCE_DISTRIBUTION_ID = "portfolio-checking-distribution"

// Series key of both charts.
const BALANCE_SERIES_KEY = "balance"

// Parses a balance value to a finite amount.
function ToAmount(value: string): number {
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? PARSED : 0
}

// Formats a UTC day key as a short `dd/MM` day, so the axis
// of a window stays readable.
function FormatChartDay(day: string): string {
  const DATE = new Date(`${day}T00:00:00.000Z`)
  const DAY = String(DATE.getUTCDate()).padStart(2, "0")
  const MONTH = String(DATE.getUTCMonth() + 1).padStart(2, "0")
  return `${DAY}/${MONTH}`
}

// Series shared by the evolution and the distribution: the
// balance, formatted in **BRL**.
function BuildBalanceSeries(): EntityChartSeries[] {
  return [
    {
      key: BALANCE_SERIES_KEY,
      label: PORTFOLIO_CHECKING.SERIES_BALANCE,
      formatValue: FormatCurrency,
      formatTick: FormatCompactCurrency,
    },
  ]
}

/**
 * @summary
 * Builds the checking balance evolution chart of the
 * portfolio detail screen.
 *
 * @remarks
 * Sums the daily balance of every bank account of the
 * portfolio per UTC day and plots the total inside the
 * selected `[from, to]` window, so the reader sees how the
 * cash in the checking accounts moved within the same window
 * the performance charts describe. Only the days that hold a
 * recorded balance are plotted, because a day without an
 * entry has no honest balance to draw.
 *
 * @param balances - The daily balance entries of the
 *   portfolio bank accounts, in any order.
 * @param dateRange - The selected window. Days fall back to
 *   the whole series when omitted.
 *
 * @returns The balance evolution model, or `null` when the
 *   window holds no balance entry.
 *
 * @example
 * const MODEL = BuildCheckingEvolutionChart(
 *   BALANCES,
 *   DATE_RANGE
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildCheckingEvolutionChart(
  balances: readonly CheckingAccountResponseDTO[],
  dateRange: DateRange | undefined
): EntityChartModel | null {
  const FROM = dateRange?.from
    ? dateRange.from.toISOString().slice(0, 10)
    : undefined
  const TO = dateRange?.to
    ? dateRange.to.toISOString().slice(0, 10)
    : undefined

  const BY_DAY = new Map<string, number>()

  for (const entry of balances) {
    const KEY = entry.date.slice(0, 10)
    if (FROM && KEY < FROM) continue
    if (TO && KEY > TO) continue
    BY_DAY.set(
      KEY,
      (BY_DAY.get(KEY) ?? 0) + ToAmount(entry.value)
    )
  }

  const DAYS = [...BY_DAY.keys()].sort()

  if (DAYS.length === 0) return null

  return {
    id: BALANCE_CHART_ID,
    title: PORTFOLIO_CHECKING.EVOLUTION_TITLE,
    description: PORTFOLIO_CHECKING.EVOLUTION_DESCRIPTION,
    kind: "area",
    series: BuildBalanceSeries(),
    points: DAYS.map((day) => ({
      label: FormatChartDay(day),
      values: {
        [BALANCE_SERIES_KEY]: BY_DAY.get(day) ?? null,
      },
    })),
  }
}

/**
 * @summary
 * Builds the checking balance distribution chart of the
 * portfolio detail screen.
 *
 * @remarks
 * Plots one slice per bank account, sized by the latest
 * recorded balance of that account, so the reader sees which
 * account holds the cash of the portfolio. Like the position
 * and bank distributions this is not clamped to the selected
 * window: the latest balance is a fact about the portfolio
 * today, so narrowing the date range must not re-slice the
 * money sitting in the accounts. An account with no recorded
 * balance, or with a balance that is not positive, is left
 * out of the ring, because a ring cannot draw either one
 * honestly.
 *
 * @param bankAccounts - The resolved bank accounts of the
 *   portfolio.
 * @param balances - The daily balance entries of the
 *   portfolio bank accounts, in any order.
 *
 * @returns The balance distribution model, or `null` when no
 *   account holds a positive balance.
 *
 * @example
 * const MODEL = BuildCheckingDistributionChart(
 *   ACCOUNTS,
 *   BALANCES
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildCheckingDistributionChart(
  bankAccounts: readonly PortfolioBankAccountView[],
  balances: readonly CheckingAccountResponseDTO[]
): EntityChartModel | null {
  const LATEST = new Map<
    string,
    { date: string; value: number }
  >()

  for (const entry of balances) {
    const CURRENT = LATEST.get(entry.bankAccountId)
    if (!CURRENT || entry.date > CURRENT.date) {
      LATEST.set(entry.bankAccountId, {
        date: entry.date,
        value: ToAmount(entry.value),
      })
    }
  }

  const SLICES = bankAccounts
    .flatMap((account) => {
      const LATEST_VALUE = LATEST.get(account.id)
      if (!LATEST_VALUE || LATEST_VALUE.value <= 0) return []

      return [
        {
          label: ResolveAccountLabel(account),
          value: LATEST_VALUE.value,
        },
      ]
    })
    .sort((left, right) => right.value - left.value)

  if (SLICES.length === 0) return null

  return {
    id: BALANCE_DISTRIBUTION_ID,
    title: PORTFOLIO_CHECKING.DISTRIBUTION_TITLE,
    description: PORTFOLIO_CHECKING.DISTRIBUTION_DESCRIPTION,
    kind: "pie",
    series: BuildBalanceSeries(),
    points: SLICES.map((slice) => ({
      label: slice.label,
      values: {
        [BALANCE_SERIES_KEY]: slice.value,
      },
    })),
    centerLabel: PORTFOLIO_CHECKING.DISTRIBUTION_CENTER,
  }
}

// Names a bank account slice, keeping the agency and the
// account number so two accounts of the same institution stay
// apart.
function ResolveAccountLabel(
  account: PortfolioBankAccountView
): string {
  return (
    `${account.bankName} (${account.bankCode})` +
    ` · Ag ${account.agency} · CC ${account.accountNumber}`
  )
}

/**
 * @summary
 * Builds the checking account charts of the portfolio detail
 * screen.
 *
 * @remarks
 * Derives the balance evolution and the balance distribution
 * from the same bank accounts and the same balance entries.
 * The evolution is clamped to the selected window by the
 * overview hook, while the distribution is not: a balance is
 * a fact about the portfolio today. A chart with no honest
 * slice or point is dropped instead of being drawn empty.
 *
 * @explanation
 * Use this helper from the overview hook. It is pure, so the
 * models can be asserted without a browser and a chart can be
 * added later by adding one builder and one entry here.
 *
 * @param balances - The daily balance entries of the
 *   portfolio bank accounts.
 * @param bankAccounts - The resolved bank accounts of the
 *   portfolio.
 * @param dateRange - The selected window, which clamps the
 *   evolution chart.
 *
 * @returns The checking chart models, in render order.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildPortfolioCheckingCharts(
  balances: readonly CheckingAccountResponseDTO[],
  bankAccounts: readonly PortfolioBankAccountView[],
  dateRange: DateRange | undefined
): EntityChartModel[] {
  return [
    BuildCheckingEvolutionChart(balances, dateRange),
    BuildCheckingDistributionChart(bankAccounts, balances),
  ].filter((model) => model !== null)
}
