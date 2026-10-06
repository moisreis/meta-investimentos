"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "cn"

import { ChartContainer } from "@/presentation/ui/chart"

import { ResolveCategoryAxisWidth } from "./entity-chart-axis.helper"
import {
  BuildChartConfig,
  ResolveColumnFill,
  ResolveSeriesColor,
} from "./entity-chart-colors.helper"
import {
  ENTITY_CHART_PLOT_HEIGHT,
  EntityChartLegend,
  EntityChartTooltip,
} from "./entity-chart-overlay"
import type { EntityChartModel } from "./entity-chart.types"

// Flattened row handed to recharts, so a series key resolves
// as a top-level data key next to the category label.
type EntityChartDatum = Record<string, string | number | null>

// Widest bar a category group may draw, in pixels. A grouped
// chart puts six bars in one band here — the three bounds of a
// norm and the three the portfolio adopted — so the cap sits
// low enough that a pair still reads as one comparison rather
// than as six separate columns.
const MAX_BAR_SIZE = 16

// Rounds the growing end of a bar, which is the right end
// once the layout is horizontal.
const BAR_RADIUS: [number, number, number, number] = [0, 4, 4, 0]

/**
 * Props of the horizontal bar chart.
 */
export interface EntityHorizontalBarsProps {
  // The chart resolved by the route.
  model: EntityChartModel
}

/**
 * @summary
 * Draws the series of a chart as horizontal bars.
 *
 * @remarks
 * The same model a `bar` chart reads, with the axes swapped:
 * the categories run down the left and the values run across
 * the bottom. Every other kind of this chart system plots a
 * series over time, where the category is a short date and the
 * vertical axis is the cheap one to spend width on. Here the
 * categories are names, so the layout gives them a column of
 * their own and measures it from the longest one, and spends
 * the rest of the card on the values.
 *
 * The category axis renders every label (`interval={0}`) rather
 * than thinning them, because a norm dropped off the axis
 * disappears from the comparison without saying so.
 *
 * @param props - Props of the horizontal bar chart.
 * @param props.model - The chart resolved by the route.
 *
 * @returns The horizontal bar chart.
 *
 * @example
 * <EntityHorizontalBars model={MODEL} />
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function EntityHorizontalBars({
  model,
}: EntityHorizontalBarsProps) {
  const CONFIG = React.useMemo(
    () => BuildChartConfig(model.series),
    [model.series]
  )

  const DATA = React.useMemo<EntityChartDatum[]>(
    () =>
      model.points.map((point) => ({
        label: point.label,
        ...point.values,
      })),
    [model.points]
  )

  const CATEGORY_WIDTH = ResolveCategoryAxisWidth(model.points)

  const AXIS_SERIES = model.series[0]
  const FORMAT_TICK =
    AXIS_SERIES?.formatTick ?? AXIS_SERIES?.formatValue

  return (
    <ChartContainer
      id={model.id}
      config={CONFIG}
      className={cn(
        "aspect-auto w-full",
        ENTITY_CHART_PLOT_HEIGHT
      )}
    >
      <BarChart
        data={DATA}
        layout="vertical"
        margin={{ left: 0, right: 8, top: 8 }}
      >
        <CartesianGrid horizontal={false} />

        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          tickFormatter={
            FORMAT_TICK
              ? (value: number) => FORMAT_TICK(value)
              : undefined
          }
        />

        <YAxis
          type="category"
          dataKey="label"
          width={CATEGORY_WIDTH}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
        />

        {model.series.map((series, index) => (
          <Bar
            key={series.key}
            dataKey={series.key}
            name={series.key}
            fill={ResolveSeriesColor(index, series)}
            maxBarSize={MAX_BAR_SIZE}
            radius={BAR_RADIUS}
          >
            {model.points.map((point, pointIndex) => (
              <Cell
                key={`${series.key}-${point.label}-${pointIndex}`}
                fill={ResolveColumnFill(
                  series,
                  index,
                  point.values[series.key] ?? null
                )}
              />
            ))}
          </Bar>
        ))}

        <EntityChartTooltip series={model.series} />

        <EntityChartLegend series={model.series} />
      </BarChart>
    </ChartContainer>
  )
}

export { EntityHorizontalBars }
