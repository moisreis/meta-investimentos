import type { TooltipValueType } from "recharts"

import {
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/presentation/ui/chart"

import { ResolveSeriesColor } from "./entity-chart-colors.helper"
import type { EntityChartSeries } from "./entity-chart.types"

/**
 * Height shared by every chart kind, so a ring and an area
 * card always rise to the same height inside their card. The
 * ring reserves part of this budget for its slice legend.
 */
export const ENTITY_CHART_PLOT_HEIGHT = "h-96"

/**
 * Shown when a tooltip entry has no value, instead of letting a
 * raw `null` reach the screen.
 */
export const ENTITY_CHART_NO_VALUE = "—"

// Color of a reference line, reused as the fallback color of a
// tooltip row whose series cannot be resolved.
const REFERENCE_COLOR = "var(--muted-foreground)"

interface EntityChartTooltipRowProps {
  color: string
  label: string
  value: string
}

/**
 * @summary
 * Renders a single formatted row of a chart tooltip.
 *
 * @remarks
 * Replaces the raw recharts row, which prints the unformatted
 * number, with a colored dot, the series label and the value
 * the series itself formats. Reused by every chart kind.
 *
 * @param props - Props of the tooltip row.
 * @param props.color - Color of the series dot.
 * @param props.label - Label of the series.
 * @param props.value - Formatted value of the point.
 *
 * @returns The tooltip row.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function EntityChartTooltipRow({
  color,
  label,
  value,
}: EntityChartTooltipRowProps) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div
          className="size-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: color }}
        />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-mono font-medium text-foreground tabular-nums">
        {value}
      </span>
    </div>
  )
}

/**
 * Reads a tooltip value as a number, or `null` when the point
 * has no value at that series.
 *
 * Recharts types a tooltip value as a union that also covers a
 * missing entry, so the payload is narrowed once here instead
 * of at every formatter.
 */
function ReadTooltipNumber(
  value: TooltipValueType | null | undefined
): number | null {
  if (value === null || value === undefined) return null
  if (typeof value !== "number" && typeof value !== "string")
    return null

  const PARSED =
    typeof value === "number" ? value : Number.parseFloat(value)

  return Number.isFinite(PARSED) ? PARSED : null
}

/**
 * Props of the shared chart tooltip.
 */
export interface EntityChartTooltipProps {
  // The series of the chart, which own the entry labels and
  // the value formatters.
  series: readonly EntityChartSeries[]
}

/**
 * @summary
 * Renders the tooltip of a cartesian chart.
 *
 * @remarks
 * Resolves every entry by its series key, so the label and the
 * number both come from the series that owns them and no raw
 * recharts value can reach the screen. An entry whose series is
 * missing keeps its own name and takes the fallback, so a
 * reference line still reads.
 *
 * @param props - Props of the tooltip.
 * @param props.series - The series of the chart.
 *
 * @returns The tooltip element.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function EntityChartTooltip({
  series,
}: EntityChartTooltipProps) {
  const SERIES_BY_KEY = new Map(
    series.map((entry, index) => [entry.key, { entry, index }])
  )

  return (
    <ChartTooltip
      content={
        <ChartTooltipContent
          indicator="dot"
          formatter={(value, name) => {
            const ENTRY = SERIES_BY_KEY.get(String(name))
            const NUMBER = ReadTooltipNumber(value)

            return (
              <EntityChartTooltipRow
                color={
                  ENTRY
                    ? ResolveSeriesColor(
                        ENTRY.index,
                        ENTRY.entry
                      )
                    : REFERENCE_COLOR
                }
                label={ENTRY?.entry.label ?? String(name)}
                value={
                  NUMBER === null
                    ? ENTITY_CHART_NO_VALUE
                    : (ENTRY?.entry.formatValue(NUMBER) ??
                      ENTITY_CHART_NO_VALUE)
                }
              />
            )
          }}
        />
      }
    />
  )
}

/**
 * @summary
 * Renders the legend of a chart, when it has something to say.
 *
 * @remarks
 * A chart with a single series omits the legend: the axis and
 * the card title already name it, and a one-item legend only
 * takes room away from the plot.
 *
 * @param props - Props of the legend.
 * @param props.series - The series of the chart.
 *
 * @returns The legend element, or `null` for a single series.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function EntityChartLegend({ series }: EntityChartTooltipProps) {
  if (series.length <= 1) return null

  return <ChartLegend content={<ChartLegendContent />} />
}

export {
  EntityChartLegend,
  EntityChartTooltip,
  EntityChartTooltipRow,
  ReadTooltipNumber,
}
