import type {
  EntityChartModel,
  EntityChartPoint,
  EntityChartSeries,
} from "@/presentation/parts/charts/entity-chart.types"
import {
  ENTITY_CHART_NEGATIVE_COLOR,
  ResolveSeriesColor,
} from "@/presentation/parts/charts/entity-chart-colors.helper"
import { UnmaskPercentage } from "@/presentation/masks/percentage.mask"
import { FormatUnsignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type { NormPortfolioAllocation } from "@/presentation/types/norms-portfolio.types"

import { PORTFOLIO_NORM } from "../settings/labels.settings"

// Key of the chart container id, kept stable so the injected
// bar colors survive a re-render of the same chart.
const NORM_CHART_ID = "portfolio-norm-allocation"

// The three bounds a comparison is made of, each paired with
// the corridor that owns it. The key is also the recharts data
// key, so the pairs have to be distinct inside this chart.
const NORM_MINIMUM_KEY = "normMinimum"
const PORTFOLIO_MINIMUM_KEY = "portfolioMinimum"
const NORM_TARGET_KEY = "normTarget"
const PORTFOLIO_TARGET_KEY = "portfolioTarget"
const NORM_MAXIMUM_KEY = "normMaximum"
const PORTFOLIO_MAXIMUM_KEY = "portfolioMaximum"

// Which corridor a bar belongs to, stated by its color: the
// norm's own bound wears the palette ramp and the corridor the
// portfolio adopted wears the chart system's red.
//
// Color answers "whose limit is this" rather than "which
// limit", which is the question a reader asks first when two
// bars sit under the same norm name. The bound is answered
// next, by each portfolio bar sitting directly under the norm
// bar it is compared against and by the legend naming both.
//
// The two are opposites on the wheel, so no reader has to
// compare them to tell them apart — and the ramp could never
// have done this job itself: its five steps are one green hue
// at descending lightness, so a step of that ramp beside
// another reads as two weights of the same statement rather
// than as two different ones.

/**
 * @summary
 * Reads a stored allocation bound as a number.
 *
 * @remarks
 * The bounds reach the presentation layer masked the way the
 * percentage field of the form shows them, with a decimal
 * comma, so `UnmaskPercentage` turns them back into the plain
 * dot decimals recharts plots. Parsing the masked string
 * directly would silently truncate every bound at the comma,
 * turning 5,50% into 5% and misdrawing the bar.
 *
 * Both corridors on the row are masked the same way, so this
 * is the only place that has to know it.
 *
 * @param value - The masked bound of the allocation.
 *
 * @returns The bound in percent units, or `0` when it cannot
 *   be read.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function ToBound(value: string): number {
  const PARSED = Number.parseFloat(UnmaskPercentage(value))

  return Number.isFinite(PARSED) ? PARSED : 0
}

/**
 * @summary
 * Builds one bound of the comparison as a pair of series.
 *
 * @remarks
 * The pair is colored by corridor: the norm bar takes its step
 * of the ramp and the portfolio bar takes the chart system's
 * red. Only the norm side needs the index, because only the
 * norm side spends ramp steps.
 *
 * @param index - Position of the norm bound in the palette,
 *   which is `0` for the minimum, `1` for the target and `2`
 *   for the maximum.
 * @param normKey - Key of the series holding the norm bound.
 * @param normLabel - Label of the norm bound.
 * @param portfolioKey - Key of the series holding the corridor
 *   the portfolio adopted.
 * @param portfolioLabel - Label of that corridor.
 *
 * @returns The two series of the bound, norm first.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function BuildBoundPair(
  index: number,
  normKey: string,
  normLabel: string,
  portfolioKey: string,
  portfolioLabel: string
): EntityChartSeries[] {
  return [
    {
      key: normKey,
      label: normLabel,
      formatValue: FormatUnsignedPercentage,
      formatTick: FormatUnsignedPercentage,
      color: ResolveSeriesColor(index),
    },
    {
      key: portfolioKey,
      label: portfolioLabel,
      formatValue: FormatUnsignedPercentage,
      formatTick: FormatUnsignedPercentage,
      color: ENTITY_CHART_NEGATIVE_COLOR,
    },
  ]
}

/**
 * @summary
 * Builds the six series of the norm comparison.
 *
 * @remarks
 * The series are returned in draw order, and the order is the
 * comparison: the norm bound first and the bound the portfolio
 * adopted directly under it, so the eye pairs them down each
 * group instead of having to look across six bars.
 *
 * Color is not spent saying which bound is being compared,
 * because position already does. It says whose corridor a bar
 * belongs to: the three norm bars walk the ramp and the three
 * portfolio bars are red. That leaves four colors rather than
 * six, and every one of them earns its place.
 *
 * Every series shares one formatter, because all six are the
 * same unit measured at six points and must be readable against
 * the same axis. The formatter is the unsigned one: a bound
 * carries no direction, so a leading sign would be claiming
 * one.
 *
 * @returns The norm and portfolio series of each bound.
 *
 * @example
 * const SERIES = BuildNormComparisonSeries();
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function BuildNormComparisonSeries(): EntityChartSeries[] {
  return [
    ...BuildBoundPair(
      0,
      NORM_MINIMUM_KEY,
      PORTFOLIO_NORM.SERIES_NORM_MINIMUM,
      PORTFOLIO_MINIMUM_KEY,
      PORTFOLIO_NORM.SERIES_PORTFOLIO_MINIMUM
    ),
    ...BuildBoundPair(
      1,
      NORM_TARGET_KEY,
      PORTFOLIO_NORM.SERIES_NORM_TARGET,
      PORTFOLIO_TARGET_KEY,
      PORTFOLIO_NORM.SERIES_PORTFOLIO_TARGET
    ),
    ...BuildBoundPair(
      2,
      NORM_MAXIMUM_KEY,
      PORTFOLIO_NORM.SERIES_NORM_MAXIMUM,
      PORTFOLIO_MAXIMUM_KEY,
      PORTFOLIO_NORM.SERIES_PORTFOLIO_MAXIMUM
    ),
  ]
}

/**
 * @summary
 * Orders the allocations by norm name.
 *
 * @remarks
 * A norm carries no natural order of its own, so the axis
 * would otherwise be drawn in whatever order the relation
 * query happened to return. Sorting by name makes the chart
 * read the same way on every load and keeps a norm in a
 * predictable place when a bound is edited.
 *
 * @param allocations - The resolved allocations.
 *
 * @returns The allocations, by ascending norm name.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function ToOrderedPoints(
  allocations: readonly NormPortfolioAllocation[]
): EntityChartPoint[] {
  return [...allocations]
    .sort((left, right) =>
      left.normName.localeCompare(right.normName, "pt-BR")
    )
    .map((allocation) => ({
      label: allocation.normName,
      values: {
        [NORM_MINIMUM_KEY]: ToBound(
          allocation.normMinAllocation
        ),
        [PORTFOLIO_MINIMUM_KEY]: ToBound(
          allocation.minAllocation
        ),
        [NORM_TARGET_KEY]: ToBound(
          allocation.normTargetAllocation
        ),
        [PORTFOLIO_TARGET_KEY]: ToBound(
          allocation.targetAllocation
        ),
        [NORM_MAXIMUM_KEY]: ToBound(
          allocation.normMaxAllocation
        ),
        [PORTFOLIO_MAXIMUM_KEY]: ToBound(
          allocation.maxAllocation
        ),
      },
    }))
}

/**
 * @summary
 * Builds the norm comparison chart of the portfolio detail
 * screen.
 *
 * @remarks
 * Plots six bars per norm: the minimum, the target and the
 * maximum the norm imposes, each followed by the bound the
 * portfolio adopted for that same norm. A reader can then see,
 * inside one group, whether the portfolio sits inside the
 * corridor the norm allows and where it deliberately differs
 * from what the norm asks for.
 *
 * The bars are drawn side by side rather than stacked, because
 * the two corridors are two independent sets of limits rather
 * than parts of a whole: stacking them would invite the reader
 * to add them up and read a total that means nothing.
 *
 * Both corridors come off the same row, which is the relation
 * that binds the norm to this portfolio. Nothing here compares
 * the portfolio against a default corridor it may never have
 * adopted, and nothing here compares against the money
 * actually invested: the domain records what a portfolio
 * committed to, not where its money landed on any given day.
 *
 * @explanation
 * Use this helper from the overview hook. It is pure, so both
 * corridors can be asserted without a browser.
 *
 * @param allocations - The allocations bound to the portfolio.
 *
 * @returns The norm comparison model, or `null` when the
 *   portfolio is bound to no norm.
 *
 * @example
 * const MODEL = BuildNormAllocationChart(ALLOCATIONS);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function BuildNormAllocationChart(
  allocations: readonly NormPortfolioAllocation[]
): EntityChartModel | null {
  const POINTS = ToOrderedPoints(allocations)

  if (POINTS.length === 0) return null

  return {
    id: NORM_CHART_ID,
    title: PORTFOLIO_NORM.TITLE,
    description: PORTFOLIO_NORM.DESCRIPTION,
    kind: "horizontal-bar",
    series: BuildNormComparisonSeries(),
    points: POINTS,
  }
}

/**
 * @summary
 * Builds the norm charts of the portfolio detail screen.
 *
 * @remarks
 * Returns an array so the section builder can hold the norm
 * charts the same way it holds the distributions, the checking
 * charts and the annual charts. A portfolio bound to no norm
 * yields no chart, and the section that would have held it is
 * dropped rather than rendered with an empty axis.
 *
 * @explanation
 * Use this helper from the overview hook.
 *
 * @param allocations - The allocations bound to the portfolio.
 *
 * @returns The norm models, in render order.
 *
 * @example
 * const MODELS = BuildPortfolioNormCharts(ALLOCATIONS);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export function BuildPortfolioNormCharts(
  allocations: readonly NormPortfolioAllocation[]
): EntityChartModel[] {
  const MODEL = BuildNormAllocationChart(allocations)

  return MODEL === null ? [] : [MODEL]
}
