import {
  Circle,
  G,
  Line,
  Path,
  Rect,
  Svg,
  Text as SvgText,
} from "@react-pdf/renderer"
import type { ReactElement } from "react"
import { Text, View } from "@react-pdf/renderer"

import { STATEMENT_REPORT_PALETTE } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"

// One named series of a bar chart.
export interface StatementReportBarSeries {
  name: string
  color: string
}

// One category of the x-axis, with one value per series.
// A `null` value leaves the slot empty instead of drawing a
// zero bar. `colors` optionally overrides the series color
// per value, which a single-series chart uses to read each
// bar on its own.
export interface StatementReportBarGroup {
  label: string
  values: (number | null)[]
  colors?: (string | null)[]
}

// One slice of a donut.
export interface StatementReportDonutSlice {
  label: string
  value: number
  color: string
}

// One row of a horizontal bar chart.
export interface StatementReportBarRow {
  label: string
  value: number
  color: string
  // Display value shown at the end of the row.
  display: string
}

/**
 * @summary
 * Draws a grouped vertical bar chart, honoring negative
 * values.
 *
 * @remarks
 * The baseline sits on the zero line, so a negative return
 * draws below the axis. Bars stay inside the plot width and
 * the category labels render under the plot, outside the
 * SVG, so they never overlap the bars.
 *
 * @explanation
 * Use this chart for the monthly performance, the monthly
 * earnings and the per-index figures of the report.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function StatementReportBarChart(props: {
  groups: StatementReportBarGroup[]
  series: StatementReportBarSeries[]
  width?: number
  height?: number
}): ReactElement {
  const WIDTH = props.width ?? 500
  const HEIGHT = props.height ?? 170
  const PAD_LEFT = 26
  const PAD_RIGHT = 6
  const PAD_TOP = 8
  const PAD_BOTTOM = 6

  const PLOT_W = WIDTH - PAD_LEFT - PAD_RIGHT
  const PLOT_H = HEIGHT - PAD_TOP - PAD_BOTTOM

  const VALUES = props.groups.flatMap((group) =>
    group.values.filter(
      (value): value is number => value !== null
    )
  )
  const MAX = Math.max(0, ...VALUES, 1)
  const MIN = Math.min(0, ...VALUES)
  const RANGE = MAX - MIN === 0 ? 1 : MAX - MIN

  const ToY = (value: number): number =>
    PAD_TOP + PLOT_H * ((MAX - value) / RANGE)

  const GROUP_W =
    props.groups.length === 0
      ? PLOT_W
      : PLOT_W / props.groups.length
  const SERIES_COUNT = Math.max(props.series.length, 1)
  const BAR_W = Math.min(12, (GROUP_W * 0.62) / SERIES_COUNT)
  const GAP = 1.5
  const CLUSTER_W =
    BAR_W * SERIES_COUNT + GAP * (SERIES_COUNT - 1)

  const ZERO_Y = ToY(0)

  return (
    <View>
      <Svg width={WIDTH} height={HEIGHT}>
        {/* Zero baseline. */}
        <Line
          x1={PAD_LEFT}
          y1={ZERO_Y}
          x2={WIDTH - PAD_RIGHT}
          y2={ZERO_Y}
          stroke={STATEMENT_REPORT_PALETTE.border}
          strokeWidth={1}
        />
        {props.groups.map((group, groupIndex) => {
          const GROUP_X = PAD_LEFT + GROUP_W * groupIndex
          const CLUSTER_X = GROUP_X + (GROUP_W - CLUSTER_W) / 2

          return group.values.map((value, seriesIndex) => {
            if (value === null) return null
            const X = CLUSTER_X + seriesIndex * (BAR_W + GAP)
            const Y = Math.min(ToY(value), ZERO_Y)
            const H = Math.max(
              Math.abs(ToY(value) - ZERO_Y),
              0.5
            )

            return (
              <Rect
                key={`${groupIndex}-${seriesIndex}`}
                x={X}
                y={Y}
                width={BAR_W}
                height={H}
                fill={
                  group.colors?.[seriesIndex] ??
                  props.series[seriesIndex]?.color
                }
                rx={1}
              />
            )
          })
        })}
      </Svg>
      <View
        style={{
          flexDirection: "row",
          width: WIDTH,
          paddingLeft: PAD_LEFT,
          paddingRight: PAD_RIGHT,
        }}
      >
        {props.groups.map((group, index) => (
          <Text
            key={`${group.label}-${index}`}
            style={[
              tw("text-subdued"),
              {
                width: GROUP_W,
                textAlign: "center",
                fontSize: 6,
              },
            ]}
          >
            {group.label}
          </Text>
        ))}
      </View>
    </View>
  )
}

/**
 * @summary
 * Draws a semicircular gauge for a 0–200% scale.
 *
 * @remarks
 * The value fills the arc against the full scale and the
 * remainder stays on the surface tone. A value without a
 * reading leaves the arc empty.
 *
 * @explanation
 * Use this gauge for the return against the target of the
 * report dashboard.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function StatementReportGauge(props: {
  value: number | null
  max?: number
  width?: number
  height?: number
}): ReactElement {
  const MAX = props.max ?? 200
  const WIDTH = props.width ?? 220
  const HEIGHT = props.height ?? 128
  const R = 84
  const CX = WIDTH / 2
  const CY = HEIGHT - 14
  const THICKNESS = 14

  const VALUE = Math.max(0, Math.min(props.value ?? 0, MAX))
  const RATIO = MAX === 0 ? 0 : VALUE / MAX

  const START = 180
  const END = 180 - 180 * RATIO

  // The portfolio reads amber while it sits below the
  // target and blue once it meets or beats it. A missing
  // target has no direction to signal, so it stays blue.
  const TONE =
    props.value !== null && props.value < 100
      ? STATEMENT_REPORT_PALETTE.brandYellow
      : STATEMENT_REPORT_PALETTE.brandBlue

  const BACKGROUND = DescribeArc(CX, CY, R, 180, 0)
  const FOREGROUND =
    props.value === null
      ? null
      : DescribeArc(CX, CY, R, START, END)

  return (
    <Svg width={WIDTH} height={HEIGHT}>
      <Path
        d={BACKGROUND}
        stroke={STATEMENT_REPORT_PALETTE.surface}
        strokeWidth={THICKNESS}
        fill="none"
      />
      {FOREGROUND !== null && (
        <Path
          d={FOREGROUND}
          stroke={TONE}
          strokeWidth={THICKNESS}
          fill="none"
        />
      )}
      <SvgText
        x={CX}
        y={CY - 26}
        style={{ fontSize: 20, fill: TONE }}
        textAnchor="middle"
      >
        {props.value === null
          ? "-"
          : `${props.value.toFixed(2)}%`}
      </SvgText>
      <SvgText
        x={CX - R}
        y={CY + 12}
        style={{
          fontSize: 7,
          fill: STATEMENT_REPORT_PALETTE.subdued,
        }}
        textAnchor="middle"
      >
        0%
      </SvgText>
      <SvgText
        x={CX + R}
        y={CY + 12}
        style={{
          fontSize: 7,
          fill: STATEMENT_REPORT_PALETTE.subdued,
        }}
        textAnchor="middle"
      >
        {MAX}%
      </SvgText>
    </Svg>
  )
}

/**
 * @summary
 * Draws a donut chart of labeled slices.
 *
 * @remarks
 * A slice without a positive value stays out of the ring, so
 * an empty distribution renders as a plain surface ring.
 *
 * @explanation
 * Use this donut for the distribution by index and by
 * financial institution of the report.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function StatementReportDonut(props: {
  slices: StatementReportDonutSlice[]
  size?: number
}): ReactElement {
  const SIZE = props.size ?? 150
  const CX = SIZE / 2
  const CY = SIZE / 2
  const R_OUTER = SIZE / 2 - 4
  const R_INNER = R_OUTER * 0.58

  const POSITIVE = props.slices.filter(
    (slice) => slice.value > 0
  )
  const TOTAL = POSITIVE.reduce(
    (sum, slice) => sum + slice.value,
    0
  )

  let angle = -90
  const PATHS: ReactElement[] = []

  if (TOTAL > 0) {
    POSITIVE.forEach((slice, index) => {
      const SWEEP = (slice.value / TOTAL) * 360
      const START = angle
      const END = angle + SWEEP
      angle = END

      PATHS.push(
        <Path
          key={`${slice.label}-${index}`}
          d={DescribeDonutSlice(
            CX,
            CY,
            R_OUTER,
            R_INNER,
            START,
            END
          )}
          fill={slice.color}
          stroke={STATEMENT_REPORT_PALETTE.background}
          strokeWidth={1}
        />
      )
    })
  } else {
    PATHS.push(
      <Circle
        key="empty"
        cx={CX}
        cy={CY}
        r={(R_OUTER + R_INNER) / 2}
        stroke={STATEMENT_REPORT_PALETTE.surface}
        strokeWidth={R_OUTER - R_INNER}
        fill="none"
      />
    )
  }

  return (
    <Svg width={SIZE} height={SIZE}>
      <G>{PATHS}</G>
    </Svg>
  )
}

/**
 * @summary
 * Draws a list of horizontal bars.
 *
 * @remarks
 * Every row prints its label above the track and its value at
 * the end of the track. Bar widths are relative to the
 * largest value, so a table of shares reads at a glance.
 *
 * @explanation
 * Use this chart for the distribution by fund and for the
 * accumulated indices of the report.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function StatementReportHorizontalBars(props: {
  rows: StatementReportBarRow[]
}): ReactElement {
  const MAX = Math.max(
    ...props.rows.map((row) => Math.abs(row.value)),
    1
  )

  return (
    <View style={tw("flex-col gap-2")}>
      {props.rows.map((row, index) => (
        <View key={`${row.label}-${index}`}>
          <View style={tw("flex-row justify-between mb-1")}>
            <Text style={tw("text-xs text-foreground")}>
              {row.label}
            </Text>
            <Text style={tw("text-xs text-subdued")}>
              {row.display}
            </Text>
          </View>
          <View
            style={[
              tw("bg-surface rounded"),
              { height: 10, width: "100%" },
            ]}
          >
            <View
              style={{
                height: 10,
                borderRadius: 4,
                backgroundColor: row.color,
                width: `${Math.max(
                  (Math.abs(row.value) / MAX) * 100,
                  0
                )}%`,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  )
}

/**
 * @summary
 * Describes a circular arc as an SVG path.
 *
 * @remarks
 * The angles are measured in degrees from the positive x
 * axis, counterclockwise, with the screen y axis pointing
 * down. A semicircle runs from 180 to 0.
 *
 * @explanation
 * Used by the gauge. Prefer the chart components above in
 * the document.
 */
function DescribeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const START = PolarToCartesian(cx, cy, radius, startAngle)
  const END = PolarToCartesian(cx, cy, radius, endAngle)
  const LARGE_ARC = Math.abs(endAngle - startAngle) > 180 ? 1 : 0

  return `M ${START.x} ${START.y} A ${radius} ${radius} 0 ${LARGE_ARC} 1 ${END.x} ${END.y}`
}

/**
 * @summary
 * Describes a donut slice as an SVG path.
 *
 * @remarks
 * Draws the outer arc, the inner arc back and closes the
 * shape, so the slice is a ring segment.
 *
 * @explanation
 * Used by the donut chart.
 */
function DescribeDonutSlice(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  startAngle: number,
  endAngle: number
): string {
  const OUTER_START = PolarToCartesian(cx, cy, outer, startAngle)
  const OUTER_END = PolarToCartesian(cx, cy, outer, endAngle)
  const INNER_START = PolarToCartesian(cx, cy, inner, startAngle)
  const INNER_END = PolarToCartesian(cx, cy, inner, endAngle)
  const LARGE_ARC = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${OUTER_START.x} ${OUTER_START.y}`,
    `A ${outer} ${outer} 0 ${LARGE_ARC} 1 ${OUTER_END.x} ${OUTER_END.y}`,
    `L ${INNER_END.x} ${INNER_END.y}`,
    `A ${inner} ${inner} 0 ${LARGE_ARC} 0 ${INNER_START.x} ${INNER_START.y}`,
    "Z",
  ].join(" ")
}

/**
 * Converts polar coordinates to cartesian, with the angle in
 * degrees from the positive x axis, counterclockwise.
 */
function PolarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number
): { x: number; y: number } {
  const RADIANS = (angle * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(RADIANS),
    y: cy - radius * Math.sin(RADIANS),
  }
}
