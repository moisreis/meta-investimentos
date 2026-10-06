"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import type { TooltipValueType } from "recharts"

import { cn } from "cn"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/presentation/ui/chart"

import { ResolveValueAxisWidth } from "./entity-chart-axis.helper"
import {
  BuildChartConfig,
  ResolveColumnFill,
  ResolveSeriesColor,
} from "./entity-chart-colors.helper"
import {
  ENTITY_CHART_NO_VALUE,
  ENTITY_CHART_PLOT_HEIGHT,
  EntityChartLegend,
  EntityChartTooltip,
  EntityChartTooltipRow,
  ReadTooltipNumber,
} from "./entity-chart-overlay"
import { EntityHorizontalBars } from "./entity-horizontal-bars"
import type {
  EntityChartModel,
  EntityChartPoint,
  EntityChartSeries,
} from "./entity-chart.types"

// A datum handed to recharts, flattened so every series key
// sits on the same level as the category label.
type EntityChartDatum = Record<string, string | number | null>

// Color of a reference line and of its label.
const REFERENCE_COLOR = "var(--muted-foreground)"

// Outer radius of a pie ring, in pixels. Fixed so the ring
// fills the same box whatever the number of slices, and a
// portfolio holding two funds is not drawn twice the size
// of one holding twenty.
const PIE_OUTER_RADIUS = 78

// Inner radius of a pie ring, in pixels. A third of the
// outer radius leaves a center wide enough for the total
// and its caption on two lines.
const PIE_INNER_RADIUS = PIE_OUTER_RADIUS / 3

// Sweep of a whole ring, in degrees. Recharts defaults to
// 270, which draws a three-quarter gauge and leaves a visible
// seam in a single-slice distribution.
const PIE_TOTAL_ANGLE = 360

// A slice of a pie ring, flattened into the shape recharts
// reads from a `Pie`.
export interface EntityChartSlice {
  // Name of the slice, shown in the legend and the tooltip.
  name: string
  // Value that sizes the slice.
  value: number
}

/**
 * @summary
 * Flattens the chart points into the slices of a ring.
 *
 * @remarks
 * A `pie` chart reads a single series, so each point becomes
 * one slice named after its category label. A point with no
 * value for that series becomes a zero slice rather than a
 * gap: a ring has no axis to break, and a zero-sized arc is
 * the honest rendering of a holding worth nothing.
 *
 * Exported so the mapping can be asserted without a
 * browser, like the other pure helpers of this module.
 *
 * @param series - The first series of the chart, which owns
 *   the slice values.
 * @param points - The points of the chart, read as slices.
 *
 * @returns The slices, in the same order as the points.
 *
 * @example
 * const SLICES = BuildPieSlices(SERIES[0], MODEL.points);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildPieSlices(
  series: EntityChartSeries | undefined,
  points: readonly EntityChartPoint[]
): EntityChartSlice[] {
  if (!series) return []

  return points.map((point) => ({
    name: point.label,
    value: point.values[series.key] ?? 0,
  }))
}

/**
 * @summary
 * Sums the slices of a ring.
 *
 * @remarks
 * The center of a distribution states the whole, so it is
 * the sum of the parts rather than the largest part. Recharts
 * does the same arithmetic internally, and this keeps the
 * two in step by reading the same slice list.
 *
 * @param slices - The slices of the ring.
 *
 * @returns The total of every slice.
 *
 * @example
 * const TOTAL = SumPieSlices(SLICES);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function SumPieSlices(
  slices: readonly EntityChartSlice[]
): number {
  return slices.reduce((total, slice) => total + slice.value, 0)
}

interface PieCenterTotalProps {
  // Center of the ring, in chart coordinates, or `null` when
  // recharts has not measured the plot area yet.
  center: { x: number; y: number } | null
  // Formatted total of the ring.
  total: string
  // Optional caption rendered under the total.
  label: string | undefined
}

/**
 * @summary
 * Renders the total of a ring in its center.
 *
 * @remarks
 * A distribution states the whole next to its parts, so the
 * center carries the sum of every slice and the route
 * caption naming what is being summed. Both are centered on
 * the measured middle of the plot, because the ring is
 * off-center in a card of a different height.
 *
 * @param props - Props of the center total.
 * @param props.center - Center of the ring in chart
 *     coordinates, or `null` before the plot is measured.
 * @param props.total - Formatted total of the ring.
 * @param props.label - Caption rendered under the total.
 *
 * @returns The center total, or `null` when unmeasured.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function PieCenterTotal({
  center,
  total,
  label,
}: PieCenterTotalProps) {
  if (!center) return null

  return (
    <text
      x={center.x}
      y={center.y}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      <tspan
        x={center.x}
        dy={label ? "-0.4em" : "0.32em"}
        fill="var(--foreground)"
        fontSize={15}
        fontWeight={600}
      >
        {total}
      </tspan>

      {label ? (
        <tspan
          x={center.x}
          dy="1.3em"
          fill="var(--muted-foreground)"
          fontSize={11}
        >
          {label}
        </tspan>
      ) : null}
    </text>
  )
}

/**
 * @summary
 * Reads the center of a pie chart from the label view box.
 *
 * @remarks
 * Recharts types the view box handed to a pie label as the
 * union of the cartesian and the polar view boxes, and only
 * the polar one carries `cx` and `cy`. The ring measures its
 * center from those two coordinates, so the box is narrowed
 * by key presence here and the coordinated are re-read as
 * numbers, without ever casting the union.
 *
 * @param box - The view box handed to the pie center label,
 *   `undefined` while recharts has not positioned the ring.
 *
 * @returns The ring center, or `null` while the box lacks
 *   the polar coordinates.
 *
 * @example
 * const CENTER = ReadPieCenter(VIEW_BOX);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function ReadPieCenter(
  box: object | null | undefined
): { x: number; y: number } | null {
  if (!box) return null
  if (!("cx" in box) || !("cy" in box)) return null
  if (typeof box.cx !== "number" || typeof box.cy !== "number") {
    return null
  }
  return { x: box.cx, y: box.cy }
}

/**
 * @summary
 * Flattens the chart points into the rows recharts reads.
 *
 * @remarks
 * Spreads the values of each point next to its category
 * label, so a series key resolves as a top-level data key. A
 * `null` value is kept as `null`, which recharts draws as a
 * gap instead of a zero.
 *
 * @param points - The points of the chart.
 *
 * @returns The flattened rows, in the same order.
 *
 * @example
 * const DATA = FlattenChartPoints(MODEL.points);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function FlattenChartPoints(
  points: readonly EntityChartPoint[]
): EntityChartDatum[] {
  return points.map((point) => ({
    label: point.label,
    ...point.values,
  }))
}

/**
 * Props of the pie tooltip payload item, as recharts types it
 * for a `Pie`.
 */
interface EntityChartPieTooltipItem {
  // Slice name, read from `nameKey`.
  name?: unknown
  // Slice value, read from `dataKey`.
  value?: TooltipValueType
}

interface EntityChartPieTooltipProps {
  // Extra props injected by recharts when a slice is active.
  active?: boolean
  // The active slice payload, one entry per slice under the
  // cursor.
  payload?: readonly EntityChartPieTooltipItem[]
  // The first series of the chart, which owns the slice
  // values and their formatter.
  series: EntityChartSeries | undefined
  // The slices of the ring, used to resolve the color of each
  // active slice by its name.
  slices: readonly EntityChartSlice[]
}

/**
 * @summary
 * Renders the tooltip of a pie chart.
 *
 * @remarks
 * The shared tooltip resolves entries by a series key, but a
 * ring hands recharts the slice **name** — a fund or a bank,
 * not a series key — so it cannot describe a slice here. This
 * tooltip looks the slice up by its name in the same list the
 * ring was drawn from, which gives it the slice color and the
 * series formatter without ever duplicating the number logic.
 *
 * A slice that is not found falls back to the first palette
 * color and keeps its name, so a name never reaches the
 * screen without a label or a format.
 *
 * @param props - Props of the pie tooltip.
 * @param props.active - Whether the cursor rests on a slice.
 * @param props.payload - The active slice payload entries.
 * @param props.series - The series that owns the slice values.
 * @param props.slices - The slices of the ring.
 *
 * @returns The pie tooltip, or `null` while no slice is
 *   active.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function EntityChartPieTooltip({
  active,
  payload,
  series,
  slices,
}: EntityChartPieTooltipProps) {
  if (!active || !payload?.length || !series) return null

  return (
    <div className="grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      {payload.map((item) => {
        const NAME =
          typeof item.name === "string" ? item.name : ""
        const INDEX = slices.findIndex(
          (slice) => slice.name === NAME
        )
        const NUMBER = ReadTooltipNumber(item.value)

        return (
          <EntityChartTooltipRow
            key={`${NAME}-${INDEX}`}
            color={ResolveSeriesColor(INDEX < 0 ? 0 : INDEX)}
            label={NAME}
            value={
              NUMBER === null
                ? ENTITY_CHART_NO_VALUE
                : series.formatValue(NUMBER)
            }
          />
        )
      })}
    </div>
  )
}

/**
 * Props of an entity chart.
 */
export interface EntityChartProps {
  // The chart resolved by the route.
  model: EntityChartModel
}

/**
 * @summary
 * Draws an entity chart from its resolved model.
 *
 * @remarks
 * Mounts the recharts root that matches the kind of the
 * model — area, line, bar or pie — over the shared grid,
 * tooltip and legend of `presentation/ui/chart`, and colors
 * every series from the shared `--chart-*` ramp through the
 * built config. A `sign` tone series additionally recolors
 * each column by the sign of its own value, and a
 * reference line anchors the series to a baseline.
 *
 * The four kinds differ in the axes they mount, not in the
 * way they read the model: a `pie` chart swaps the category
 * axis for a ring of one slice per point, colors each slice
 * by its own position in the ramp, and states the total of
 * the ring in the center. Every other kind keeps the shared
 * axes, the shared config legend and the reference lines.
 * All four kinds share the same plot height so they fit
 * exactly inside `EntityChartCard`.
 *
 * Nothing here knows what is plotted: the route hands over a
 * model built from its own records, so the same chart draws
 * the patrimony of a portfolio, the quota of a position and
 * any series added later. A model with no point renders
 * nothing instead of an empty frame.
 *
 * @explanation
 * Use inside an `EntityChartCard` on any entity detail
 * screen. Build the model in a pure helper next to the route
 * and keep the formatters in the route label settings, so
 * the numbers a chart shows are the same ones the tables
 * show.
 *
 * @param props - Props of the entity chart.
 * @param props.model - The chart resolved by the route.
 *
 * @returns The chart, or `null` when the model has no point.
 *
 * @example
 * <EntityChart model={MODEL} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function EntityChart({ model }: EntityChartProps) {
  const CONFIG = React.useMemo(
    () => BuildChartConfig(model.series),
    [model.series]
  )

  const DATA = React.useMemo(
    () => FlattenChartPoints(model.points),
    [model.points]
  )

  if (model.points.length === 0) return null

  const AXIS_SERIES = model.series[0]
  const FORMAT_TICK =
    AXIS_SERIES?.formatTick ?? AXIS_SERIES?.formatValue
  const Y_AXIS_WIDTH = ResolveValueAxisWidth(
    AXIS_SERIES,
    model.points
  )
  const GRADIENT_ID = `entity-chart-fill-${model.id}`

  const AXES = (
    <React.Fragment>
      <CartesianGrid vertical={false} />

      <XAxis
        dataKey="label"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        minTickGap={20}
        interval="preserveStartEnd"
      />

      <YAxis
        width={Y_AXIS_WIDTH}
        tickLine={false}
        axisLine={false}
        tickMargin={4}
        tickFormatter={
          FORMAT_TICK
            ? (value: number) => FORMAT_TICK(value)
            : undefined
        }
      />
    </React.Fragment>
  )

  const REFERENCES = model.references?.map((reference) => (
    <ReferenceLine
      key={`${model.id}-${reference.label}`}
      y={reference.value}
      stroke={REFERENCE_COLOR}
      strokeDasharray="4 4"
      label={{
        value: reference.label,
        position: "insideTopRight",
        fill: REFERENCE_COLOR,
        fontSize: 10,
      }}
    />
  ))

  const TOOLTIP = <EntityChartTooltip series={model.series} />

  const LEGEND = <EntityChartLegend series={model.series} />

  if (model.kind === "pie") {
    const SLICES = BuildPieSlices(AXIS_SERIES, model.points)
    const TOTAL = SumPieSlices(SLICES)

    const LEGEND_ITEMS = SLICES.map((slice, index) => ({
      key: slice.name,
      name: slice.name,
      color: ResolveSeriesColor(index),
      value: String(slice.value),
      payload: {
        fill: ResolveSeriesColor(index),
        value: String(slice.value),
      },
    }))

    return (
      <ChartContainer
        id={model.id}
        config={CONFIG}
        className={cn(
          "aspect-auto w-full",
          ENTITY_CHART_PLOT_HEIGHT
        )}
      >
        <PieChart
          margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Pie
            data={SLICES}
            dataKey="value"
            nameKey="name"
            innerRadius={PIE_INNER_RADIUS}
            outerRadius={PIE_OUTER_RADIUS}
            startAngle={90}
            endAngle={-PIE_TOTAL_ANGLE}
            paddingAngle={2}
            strokeWidth={0}
            isAnimationActive={false}
          >
            {SLICES.map((slice, index) => (
              <Cell
                key={`${model.id}-${slice.name}-${index}`}
                fill={ResolveSeriesColor(index)}
              />
            ))}

            <Label
              position="center"
              content={({ viewBox }) => (
                <PieCenterTotal
                  center={ReadPieCenter(viewBox)}
                  total={
                    AXIS_SERIES
                      ? AXIS_SERIES.formatValue(TOTAL)
                      : ENTITY_CHART_NO_VALUE
                  }
                  label={model.centerLabel}
                />
              )}
            />
          </Pie>

          <ChartTooltip
            content={
              <EntityChartPieTooltip
                slices={SLICES}
                series={AXIS_SERIES}
              />
            }
          />

          <ChartLegend
            content={
              <ChartLegendContent
                payload={LEGEND_ITEMS}
                verticalAlign="bottom"
              />
            }
          />
        </PieChart>
      </ChartContainer>
    )
  }

  if (model.kind === "bar") {
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
          margin={{ left: 0, right: 8, top: 8 }}
        >
          {AXES}
          {REFERENCES}
          {model.series.map((series, index) => (
            <Bar
              key={series.key}
              dataKey={series.key}
              name={series.key}
              fill={ResolveSeriesColor(index, series)}
              maxBarSize={28}
              radius={[4, 4, 0, 0]}
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
          {TOOLTIP}
          {LEGEND}
        </BarChart>
      </ChartContainer>
    )
  }

  if (model.kind === "horizontal-bar") {
    return <EntityHorizontalBars model={model} />
  }

  if (model.kind === "line") {
    return (
      <ChartContainer
        id={model.id}
        config={CONFIG}
        className={cn(
          "aspect-auto w-full",
          ENTITY_CHART_PLOT_HEIGHT
        )}
      >
        <LineChart
          data={DATA}
          margin={{ left: 0, right: 8, top: 8 }}
        >
          {AXES}
          {REFERENCES}
          {model.series.map((series, index) => (
            <Line
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.key}
              stroke={ResolveSeriesColor(index, series)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls={false}
            />
          ))}
          {TOOLTIP}
          {LEGEND}
        </LineChart>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer
      id={model.id}
      config={CONFIG}
      className={cn(
        "aspect-auto w-full",
        ENTITY_CHART_PLOT_HEIGHT
      )}
    >
      <AreaChart
        data={DATA}
        margin={{ left: 0, right: 8, top: 8 }}
      >
        <defs>
          <linearGradient
            id={GRADIENT_ID}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="5%"
              stopColor={ResolveSeriesColor(0, AXIS_SERIES)}
              stopOpacity={0.35}
            />
            <stop
              offset="95%"
              stopColor={ResolveSeriesColor(0, AXIS_SERIES)}
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>

        {AXES}
        {REFERENCES}
        {model.series.map((series, index) => (
          <Area
            key={series.key}
            type="monotone"
            dataKey={series.key}
            name={series.key}
            stroke={ResolveSeriesColor(index, series)}
            strokeWidth={2}
            fill={index === 0 ? `url(#${GRADIENT_ID})` : "none"}
            fillOpacity={1}
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls={false}
          />
        ))}
        {TOOLTIP}
        {LEGEND}
      </AreaChart>
    </ChartContainer>
  )
}

export { EntityChart }
