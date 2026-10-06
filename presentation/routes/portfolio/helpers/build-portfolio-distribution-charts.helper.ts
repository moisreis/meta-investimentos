import type {
  EntityChartModel,
  EntityChartPoint,
  EntityChartSeries,
} from "@/presentation/parts/charts/entity-chart.types"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import type { PortfolioHolding } from "@/presentation/types/portfolio-holding.types"

import { PORTFOLIO_DISTRIBUTION } from "../settings/labels.settings"

// Keys of the chart container ids, kept stable so the
// injected slice colors survive a re-render of the same
// chart.
const POSITION_CHART_ID = "portfolio-position-distribution"
const BANK_CHART_ID = "portfolio-bank-distribution"
const BENCHMARK_CHART_ID = "portfolio-benchmark-distribution"

// Series key of both distributions. A ring reads one value
// per slice, so the key only has to be unique inside its own
// chart.
const INVESTED_SERIES_KEY = "invested"

// A slice of a distribution, resolved but not yet ordered.
interface DistributionSlice {
  // Label of the slice, rendered by the ring, the legend
  // and the tooltip.
  label: string
  // Money the slice stands for.
  value: number
}

// Series shared by all three distributions: the money a slice
// stands for, formatted in **BRL** in the tooltip and in the
// total of the ring.
function BuildInvestedSeries(): EntityChartSeries[] {
  return [
    {
      key: INVESTED_SERIES_KEY,
      label: PORTFOLIO_DISTRIBUTION.SERIES_INVESTED,
      formatValue: FormatCurrency,
    },
  ]
}

// Parses an invested value to a finite amount.
function ToAmount(value: string): number {
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? PARSED : 0
}

// Orders the slices from the biggest share to the smallest,
// dropping the ones worth nothing and the ones worth less
// than nothing.
//
// A zero slice is drawn as no arc at all, so keeping it only
// adds a legend entry that points at nothing. A negative
// slice has no honest arc: a ring divides by the sum, so one
// negative part would make every other part read as more than
// it is. Both are therefore left out of the ring, and the
// sum of the ring is the sum of what is actually plotted.
function ResolveSlices(
  slices: readonly DistributionSlice[]
): DistributionSlice[] {
  return slices
    .filter((slice) => slice.value > 0)
    .sort((left, right) => right.value - left.value)
}

// Projects the ordered slices onto the points of a ring.
function ToPoints(
  slices: readonly DistributionSlice[]
): EntityChartPoint[] {
  return slices.map((slice) => ({
    label: slice.label,
    values: { [INVESTED_SERIES_KEY]: slice.value },
  }))
}

/**
 * @summary
 * Builds the by-position distribution of the portfolio
 * detail screen.
 *
 * @remarks
 * Plots one slice per holding, sized by the money invested
 * in it, so the reader sees which fund carries the portfolio
 * instead of having to divide the positions by hand. The
 * slices are read from the biggest share to the smallest, and
 * a holding that is worth nothing or less than nothing is
 * left out of the ring, because a ring cannot draw either one
 * honestly.
 *
 * The palette cycles every five slices, so a portfolio
 * holding more funds than that repeats a color. The legend
 * always pairs a color with its name, which is what keeps a
 * repeated color readable rather than ambiguous.
 *
 * @param holdings - The resolved holdings of the portfolio.
 *
 * @returns The by-position distribution model.
 *
 * @example
 * const MODEL = BuildPositionDistributionChart(HOLDINGS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildPositionDistributionChart(
  holdings: readonly PortfolioHolding[]
): EntityChartModel | null {
  const SLICES = ResolveSlices(
    holdings.map((holding) => ({
      label: holding.fundName,
      value: ToAmount(holding.investedValue),
    }))
  )

  if (SLICES.length === 0) return null

  return {
    id: POSITION_CHART_ID,
    title: PORTFOLIO_DISTRIBUTION.POSITION_TITLE,
    description: PORTFOLIO_DISTRIBUTION.POSITION_DESCRIPTION,
    kind: "pie",
    series: BuildInvestedSeries(),
    points: ToPoints(SLICES),
    centerLabel: PORTFOLIO_DISTRIBUTION.POSITION_CENTER,
  }
}

// Names a bank slice, keeping the code of the first holding
// that resolved it so the label never flips between the
// funds of the same institution.
function ResolveBankLabel(
  holding: PortfolioHolding,
  current: string | undefined
): string {
  if (current !== undefined) return current

  return `${holding.bankName} (${holding.bankCode})`
}

/**
 * @summary
 * Builds the by-bank distribution of the portfolio detail
 * screen.
 *
 * @remarks
 * Groups the holdings by the bank that custodies their fund
 * and plots one slice per bank, so the reader sees which
 * institutions the money sits behind. A portfolio whose funds
 * are all issued by the same bank collapses to a single
 * slice, which is the honest answer rather than a chart with
 * one misleadingly thin arc per fund.
 *
 * The slices are read from the biggest share to the smallest,
 * and a bank whose total is not positive is left out of the
 * ring, because a ring cannot draw a negative arc. The
 * investment is grouped by the bank of the fund rather than
 * by the bank accounts of the portfolio, so the distribution
 * describes where the money is invested and not only where it
 * happens to sit in a checking account.
 *
 * @param holdings - The resolved holdings of the portfolio.
 *
 * @returns The by-bank distribution model.
 *
 * @example
 * const MODEL = BuildBankDistributionChart(HOLDINGS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildBankDistributionChart(
  holdings: readonly PortfolioHolding[]
): EntityChartModel | null {
  const BY_BANK = new Map<string, DistributionSlice>()

  for (const holding of holdings) {
    const CURRENT = BY_BANK.get(holding.bankId)

    BY_BANK.set(holding.bankId, {
      label: ResolveBankLabel(holding, CURRENT?.label),
      value:
        (CURRENT?.value ?? 0) + ToAmount(holding.investedValue),
    })
  }

  const SLICES = ResolveSlices([...BY_BANK.values()])

  if (SLICES.length === 0) return null

  return {
    id: BANK_CHART_ID,
    title: PORTFOLIO_DISTRIBUTION.BANK_TITLE,
    description: PORTFOLIO_DISTRIBUTION.BANK_DESCRIPTION,
    kind: "pie",
    series: BuildInvestedSeries(),
    points: ToPoints(SLICES),
    centerLabel: PORTFOLIO_DISTRIBUTION.BANK_CENTER,
  }
}

// Grouping key of the holdings that sit in no measured fund.
// It is not a benchmark id, so it cannot collide with a real
// one, and it keeps a fund that tracks nothing on the ring
// instead of quietly shrinking the total it is measured
// against.
const UNTRACKED_KEY = "untracked"

// Names a benchmark slice, keeping the first name that
// resolved it so the label never flips between the funds of
// the same index.
//
// Two funds measured against one index can resolve it
// differently: a fund whose index is missing from the
// registry yields no name at all. Without this guard the last
// fund of the group would overwrite the slice label and a
// measured portfolio would be read as unmeasured money.
function ResolveBenchmarkLabel(
  holding: PortfolioHolding,
  current: string | undefined
): string {
  if (current !== undefined) return current

  const FALLBACK = PORTFOLIO_DISTRIBUTION.UNTRACKED_LABEL

  return holding.benchmarkName ?? FALLBACK
}

/**
 * @summary
 * Builds the by-benchmark distribution of the portfolio
 * detail screen.
 *
 * @remarks
 * Groups the holdings by the index their fund is measured
 * against and plots one slice per index, sized by the money
 * sitting in the funds that track it, so the reader sees how
 * much of the portfolio is compared against CDI and how much
 * against IBOV.
 *
 * A benchmark in this domain carries no composition of its
 * own — no percentages per asset class — so the ring cannot
 * plot what an index is made of. What it can honestly plot is
 * the split of the money by the yardstick it is measured with,
 * which is why the slices are weighted by the invested value
 * and not by the benchmark.
 *
 * Holdings whose fund tracks no index, or whose index is
 * missing from the registry, fall into a single untracked
 * slice. Dropping them would leave the ring summing to less
 * than the portfolio, which reads as the reader losing money
 * somewhere; naming them says plainly how much is not being
 * measured.
 *
 * @param holdings - The resolved holdings of the portfolio.
 *
 * @returns The by-benchmark distribution model.
 *
 * @example
 * const MODEL = BuildBenchmarkDistributionChart(HOLDINGS);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export function BuildBenchmarkDistributionChart(
  holdings: readonly PortfolioHolding[]
): EntityChartModel | null {
  const BY_BENCHMARK = new Map<string, DistributionSlice>()

  for (const holding of holdings) {
    const KEY = holding.benchmarkId ?? UNTRACKED_KEY
    const CURRENT = BY_BENCHMARK.get(KEY)

    BY_BENCHMARK.set(KEY, {
      label: ResolveBenchmarkLabel(holding, CURRENT?.label),
      value:
        (CURRENT?.value ?? 0) + ToAmount(holding.investedValue),
    })
  }

  const SLICES = ResolveSlices([...BY_BENCHMARK.values()])

  if (SLICES.length === 0) return null

  return {
    id: BENCHMARK_CHART_ID,
    title: PORTFOLIO_DISTRIBUTION.BENCHMARK_TITLE,
    description: PORTFOLIO_DISTRIBUTION.BENCHMARK_DESCRIPTION,
    kind: "pie",
    series: BuildInvestedSeries(),
    points: ToPoints(SLICES),
    centerLabel: PORTFOLIO_DISTRIBUTION.BENCHMARK_CENTER,
  }
}

/**
 * @summary
 * Builds the distribution charts of the portfolio detail
 * screen.
 *
 * @remarks
 * Derives the by-position, by-bank and by-benchmark
 * distributions from the resolved holdings. All three are
 * read from the same records and the same invested value, so
 * the rings can never disagree about how much money the
 * portfolio holds.
 *
 * Unlike the performance charts, the distributions are not
 * clamped to the selected window: a holding is a fact about
 * the portfolio today, so narrowing the date range must not
 * change how the money is split. A distribution with no
 * positive slice is dropped instead of being drawn as an
 * empty ring.
 *
 * @explanation
 * Use this helper from the overview hook. It is pure, so the
 * slices can be asserted without a browser and a fourth
 * distribution can be added later by adding one builder and
 * one entry here.
 *
 * @param holdings - The resolved holdings of the portfolio.
 *
 * @returns The distribution models, in render order.
 *
 * @example
 * const MODELS = BuildPortfolioDistributionCharts(HOLDINGS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildPortfolioDistributionCharts(
  holdings: readonly PortfolioHolding[]
): EntityChartModel[] {
  return [
    BuildPositionDistributionChart(holdings),
    BuildBankDistributionChart(holdings),
    BuildBenchmarkDistributionChart(holdings),
  ].filter((model) => model !== null)
}
