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
  ChartTooltipContent,
} from "@/presentation/ui/chart"

import {
  BuildChartConfig,
  ResolveColumnFill,
  ResolveSeriesColor,
} from "./entity-chart-colors.helper"
import type {
  EntityChartModel,
  EntityChartPoint,
  EntityChartSeries,
} from "./entity-chart.types"

// A datum handed to recharts, flattened so every series key
// sits on the same level as the category label.
type EntityChartDatum = Record<string, string | number | null>

// Y axis width, in pixels, when the series have no formatter
// to measure.
const DEFAULT_Y_AXIS_WIDTH = 56

// Bounds of the width derived from the longest tick label.
const MIN_Y_AXIS_WIDTH = 48
const MAX_Y_AXIS_WIDTH = 132

// Approximate width, in pixels, of one character of a tick
// label at the axis font size.
const TICK_CHARACTER_WIDTH = 7

// Color of a reference line and of its label.
const REFERENCE_COLOR = "var(--muted-foreground)"

// Height shared by every chart kind, so a pie and an area
// card always rise to the same height inside their card.
// The pie reserves part of this budget for its slice legend.
const CHART_PLOT_HEIGHT = "h-96"

// Shown when a tooltip entry has no value, instead of
// letting a raw `null` reach the screen.
const NO_VALUE_LABEL = "—"

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

interface EntityChartSliceLegendItem {
  color: string
  label: string
}

interface EntityChartSliceLegendProps {
  items: readonly EntityChartSliceLegendItem[]
}

/**
 * @summary
 * Renders the category axis a pie chart cannot draw.
 *
 * @remarks
 * A ring has no axis, so the slice names would otherwise
 * exist only inside the tooltip and the ring would answer
 * "how is it split" without ever saying "into what". The
 * names are rendered from the same slice list the ring is
 * drawn from, in the same order and with the same colors, so
 * a legend entry can never describe a slice that is not
 * there. It flows onto as many lines as the slice count
 * needs instead of clipping a long institution name.
 *
 * @param props - Props of the slice legend.
 * @param props.items - The slice names and their colors,
 *     in slice order.
 *
 * @returns The slice legend.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function EntityChartSliceLegend({
  items,
}: EntityChartSliceLegendProps) {
  if (items.length === 0) return null

  return (
    <ul className="flex w-full flex-wrap items-start justify-center gap-x-4 gap-y-1.5 pt-1">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex max-w-full min-w-0 items-center gap-1.5"
        >
          <span
            className="size-2.5 shrink-0 rounded-[2px]"
            style={{ backgroundColor: item.color }}
          />
          <span className="truncate text-muted-foreground">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  )
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
 * @summary
 * Derives the vertical axis width from the tick labels.
 *
 * @remarks
 * Measures the longest label the first series can produce
 * over the plotted values, so a currency axis is not clipped
 * and a percentage axis is not padded. Falls back to the
 * default width when the series exposes no formatter or the
 * first series never plots a value.
 *
 * @param series - The first series of the chart, which owns
 *   the axis labels.
 * @param points - The points of the chart.
 *
 * @returns The axis width, in pixels.
 *
 * @example
 * const WIDTH = ResolveYAxisWidth(SERIES[0], POINTS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function ResolveYAxisWidth(
  series: EntityChartSeries | undefined,
  points: readonly EntityChartPoint[]
): number {
  const FORMAT = series?.formatTick ?? series?.formatValue
  if (!series || !FORMAT) return DEFAULT_Y_AXIS_WIDTH

  const LONGEST = points.reduce((longest, point) => {
    const VALUE = point.values[series.key]
    if (VALUE === null || VALUE === undefined) return longest
    return Math.max(longest, FORMAT(VALUE).length)
  }, 0)

  if (LONGEST === 0) return DEFAULT_Y_AXIS_WIDTH

  return Math.min(
    Math.max(
      LONGEST * TICK_CHARACTER_WIDTH + 12,
      MIN_Y_AXIS_WIDTH
    ),
    MAX_Y_AXIS_WIDTH
  )
}

/**
 * @summary
 * Reads a tooltip value as a number, or `null` when the
 * point has no value at that series.
 *
 * @remarks
 * Recharts types a tooltip value as a union that also covers
 * a missing entry, so the payload is narrowed here once
 * instead of at every formatter.
 *
 * @param value - The raw tooltip value, which recharts
 *   types as a union that also covers a missing entry and a
 *   multi-value range.
 *
 * @returns The value, or `null` when absent or unparsable.
 *
 * @example
 * const AMOUNT = ReadTooltipNumber(VALUE);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function ReadTooltipNumber(
  value: TooltipValueType | null | undefined
): number | null {
  if (value === null || value === undefined) return null
  if (typeof value !== "number" && typeof value !== "string")
    return null

  const PARSED =
    typeof value === "number" ? value : Number.parseFloat(value)

  return Number.isFinite(PARSED) ? PARSED : null
}

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
                ? NO_VALUE_LABEL
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

  const SERIES_BY_KEY = React.useMemo(
    () =>
      new Map(
        model.series.map((series, index) => [
          series.key,
          { series, index },
        ])
      ),
    [model.series]
  )

  if (model.points.length === 0) return null

  const AXIS_SERIES = model.series[0]
  const FORMAT_TICK =
    AXIS_SERIES?.formatTick ?? AXIS_SERIES?.formatValue
  const Y_AXIS_WIDTH = ResolveYAxisWidth(
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

  const TOOLTIP = (
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
                    ? ResolveSeriesColor(ENTRY.index)
                    : REFERENCE_COLOR
                }
                label={ENTRY?.series.label ?? String(name)}
                value={
                  NUMBER === null
                    ? NO_VALUE_LABEL
                    : (ENTRY?.series.formatValue(NUMBER) ??
                      NO_VALUE_LABEL)
                }
              />
            )
          }}
        />
      }
    />
  )

  const LEGEND =
    model.series.length > 1 ? (
      <ChartLegend content={<ChartLegendContent />} />
    ) : null

  if (model.kind === "pie") {
    const SLICES = BuildPieSlices(AXIS_SERIES, model.points)
    const TOTAL = SumPieSlices(SLICES)

    return (
      <div
        className={cn(
          "flex w-full flex-col gap-2",
          CHART_PLOT_HEIGHT
        )}
      >
        <ChartContainer
          id={model.id}
          config={CONFIG}
          className="aspect-auto min-h-0 w-full flex-1"
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
                        : NO_VALUE_LABEL
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
          </PieChart>
        </ChartContainer>

        <EntityChartSliceLegend
          items={SLICES.map((slice, index) => ({
            color: ResolveSeriesColor(index),
            label: slice.name,
          }))}
        />
      </div>
    )
  }

  if (model.kind === "bar") {
    return (
      <ChartContainer
        id={model.id}
        config={CONFIG}
        className={cn("aspect-auto w-full", CHART_PLOT_HEIGHT)}
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
              fill={ResolveSeriesColor(index)}
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

  if (model.kind === "line") {
    return (
      <ChartContainer
        id={model.id}
        config={CONFIG}
        className={cn("aspect-auto w-full", CHART_PLOT_HEIGHT)}
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
              stroke={ResolveSeriesColor(index)}
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
      className={cn("aspect-auto w-full", CHART_PLOT_HEIGHT)}
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
              stopColor={ResolveSeriesColor(0)}
              stopOpacity={0.35}
            />
            <stop
              offset="95%"
              stopColor={ResolveSeriesColor(0)}
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
            stroke={ResolveSeriesColor(index)}
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
