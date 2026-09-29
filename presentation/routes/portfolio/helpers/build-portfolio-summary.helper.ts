import type { DateRange } from "react-day-picker"

import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import type { PortfolioPeriodReturnsDTO } from "@/services/portfolio-performance/use-cases/resolve-portfolio-period-returns.use-case"
import {
  ResolvePeriodWindow,
  SumSeriesCashFlows,
  SumSeriesEarnings,
} from "@/services/portfolio-performance/calculators/period-window.calculator"
import {
  FormatCurrency,
  FormatSignedCurrency,
} from "@/presentation/presenters/currency.presenter"
import { FormatSignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type {
  EntitySummary,
  EntitySummaryEntry,
  EntitySummaryTone,
} from "@/presentation/parts/components/entity-detail-summary"

import { PORTFOLIO_SUMMARY } from "../settings/labels.settings"

// Parses a numeric snapshot field to a finite amount.
function ToAmount(value: string | null | undefined): number {
  if (value === null || value === undefined) return 0
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? PARSED : 0
}

// Formats a snapshot day as a `dd/mm/yyyy` UTC day. The
// registry keys its days in UTC, so the day is read through
// the UTC getters and never through the timezone of the
// browser, which would show the previous day west of
// Greenwich.
function FormatUtcDay(
  snapshot: PortfolioPerformanceResponseDTO
): string {
  const DATE = new Date(snapshot.date)
  const DAY = String(DATE.getUTCDate()).padStart(2, "0")
  const MONTH = String(DATE.getUTCMonth() + 1).padStart(2, "0")
  return `${DAY}/${MONTH}/${DATE.getUTCFullYear()}`
}

// Resolves the tone of a figure by the sign of its amount.
function ResolveTone(amount: number): EntitySummaryTone {
  if (amount > 0) return "positive"
  if (amount < 0) return "negative"
  return "neutral"
}

/**
 * @summary
 * Builds the extrato summary of the portfolio detail screen.
 *
 * @remarks
 * Clamps the snapshot series to the selected `[from, to]`
 * window through the shared period window calculator and
 * derives the opening block from real registry data: the
 * closing patrimony is the headline figure, named after the
 * day it was measured on; the return of the window sits
 * under it; and the reconciliation figures explain how the
 * opening balance became the closing one by the money that
 * entered, the money that left and the result the market
 * earned in between.
 *
 * The reconciliation is the point of the block. A period with
 * contributions and redemptions moves the balance for reasons
 * that have nothing to do with the result, so a balance delta
 * alone would blame the market for a deposit. The return is
 * chained by the server and never recomputed here, so the
 * domain formula stays off the browser.
 *
 * @explanation
 * Use this helper from the overview hook. The window is
 * shared with the period return use case and with the chart
 * builder, so a label, a figure and a plotted point can never
 * describe different periods.
 *
 * @param performances - The daily snapshots of the
 *   portfolio, not necessarily ordered.
 * @param dateRange - The selected window. Days fall back
 *   to the earliest and latest snapshot when omitted.
 * @param periodReturns - The returns the server already
 *   chained for the same window.
 *
 * @returns The summary of the window, or `null` when the
 *   series holds no snapshot, so the screen can explain
 *   itself instead of showing dashes.
 *
 * @example
 * const SUMMARY = BuildPortfolioSummary(
 *   PERFORMANCES,
 *   { from: START, to: END },
 *   PERIOD_RETURNS
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
export function BuildPortfolioSummary(
  performances: readonly PortfolioPerformanceResponseDTO[],
  dateRange: DateRange | undefined,
  periodReturns: PortfolioPeriodReturnsDTO
): EntitySummary | null {
  const WINDOW = ResolvePeriodWindow(
    performances,
    dateRange?.from ?? null,
    dateRange?.to ?? null
  )

  const {
    end: END,
    opening: OPENING,
    inWindow: IN_WINDOW,
  } = WINDOW

  if (!END) return null

  const FLOWS = SumSeriesCashFlows(IN_WINDOW)
  const RESULT = SumSeriesEarnings(IN_WINDOW)

  const PERIOD_RETURN = periodReturns.periodReturn
  const RETURN_TONE = ResolveTone(ToAmount(PERIOD_RETURN))

  // The opening balance is the snapshot measured before the
  // window opens. When the window starts at the first snapshot
  // of the series there is none, so the row is dropped instead
  // of showing a dash: there is no figure to state, and the
  // reconciliation still closes on the closing balance.
  const OPENING_ENTRY: EntitySummaryEntry[] = OPENING
    ? [
        {
          key: "opening",
          label: PORTFOLIO_SUMMARY.OPENING_ENTRY_LABEL,
          value: FormatCurrency(OPENING.patrimony),
          tone: "neutral",
        },
      ]
    : []

  const ENTRIES: EntitySummaryEntry[] = [
    ...OPENING_ENTRY,
    {
      key: "deposits",
      label: PORTFOLIO_SUMMARY.DEPOSITS_ENTRY_LABEL,
      value: FormatCurrency(FLOWS.deposits),
      tone: "neutral",
    },
    {
      key: "withdrawals",
      label: PORTFOLIO_SUMMARY.WITHDRAWALS_ENTRY_LABEL,
      value: FormatCurrency(FLOWS.withdrawals),
      tone: "neutral",
    },
    {
      key: "result",
      label: PORTFOLIO_SUMMARY.RESULT_ENTRY_LABEL,
      value: FormatSignedCurrency(RESULT),
      tone: ResolveTone(RESULT),
    },
  ]

  return {
    // The label carries the closing day, so the figure is
    // dated without restating the window the charts are
    // already drawn over.
    label: `${PORTFOLIO_SUMMARY.PATRIMONY_LABEL} ${FormatUtcDay(END)}`,
    value: FormatCurrency(END.patrimony),
    // The note states the return, so it stays absent until the
    // server resolves one: a badge with no figure would say
    // nothing. The sign travels in the figure and the
    // direction in the icon, so the reader never depends on
    // the colour of the line to know how the money moved.
    note: PERIOD_RETURN
      ? {
          value: FormatSignedPercentage(PERIOD_RETURN),
          label: PORTFOLIO_SUMMARY.RETURN_NOTE,
          tone: RETURN_TONE,
        }
      : null,
    entries: ENTRIES,
  }
}
