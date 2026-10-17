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

import {
  FormatSignedPercentage,
  FormatUnsignedPercentage,
} from "@/presentation/presenters/percentage.presenter"

import {
  STATEMENT_REPORT_CHART_CATEGORY_STYLE,
  STATEMENT_REPORT_CHART_LEGEND_STYLE,
  STATEMENT_REPORT_CHART_VALUE_STYLE,
} from "./shared-statement-report-chart-labels.constants"
import { STATEMENT_REPORT_SECTION_TITLE_STYLE } from "./shared-statement-report-section-title.constants"
import {
  STATEMENT_REPORT_COPY,
  STATEMENT_REPORT_PALETTE,
} from "./shared-statement-report.settings"
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
 * The header puts the title on the left and the series
 * indicator on the right. The baseline sits on the zero
 * line, so a negative return draws below the axis. Each bar
 * carries its value on top, rotated to read upward so it
 * never crowds the bar next to it. A 1pt neutral-900 axis
 * line sits right above the category labels, which render
 * under the plot, outside the SVG. The bars are squared
 * off.
 *
 * @explanation
 * Use this chart for the monthly performance and the
 * monthly earnings of the report.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function StatementReportBarChart(props: {
  groups: StatementReportBarGroup[]
  series: StatementReportBarSeries[]
  legend?: StatementReportBarSeries[]
  title?: string
  formatValue?: (value: number) => string
  width?: number
  height?: number
}): ReactElement {
  const WIDTH = props.width ?? 500
  const HEIGHT = props.height ?? 170
  const PAD_LEFT = 26
  const PAD_RIGHT = 6
  const PAD_BOTTOM = 6

  const FORMAT_VALUE =
    props.formatValue ??
    ((value: number) => FormatSignedPercentage(value))

  const VALUES = props.groups.flatMap((group) =>
    group.values.filter(
      (value): value is number => value !== null
    )
  )
  const MAX = Math.max(0, ...VALUES, 1)
  const MIN = Math.min(0, ...VALUES)
  const RANGE = MAX - MIN === 0 ? 1 : MAX - MIN

  // The value labels read bottom to top above each bar, so the
  // plot reserves the longest label as headroom.
  const LONGEST_LABEL = Math.max(
    1,
    ...VALUES.filter((value) => value !== 0).map(
      (value) => FORMAT_VALUE(value).length
    )
  )
  const PAD_TOP = Math.min(
    HEIGHT - 40,
    LONGEST_LABEL *
      STATEMENT_REPORT_CHART_VALUE_STYLE.fontSize *
      0.55 +
      8
  )

  const PLOT_W = WIDTH - PAD_LEFT - PAD_RIGHT
  const PLOT_H = HEIGHT - PAD_TOP - PAD_BOTTOM

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
      <View
        style={tw("flex-row items-center justify-between mb-2")}
      >
        <Text style={STATEMENT_REPORT_SECTION_TITLE_STYLE}>
          {props.title}
        </Text>
        <View style={tw("flex-row items-center gap-3")}>
          {(props.legend ?? props.series).map((item) => (
            <View
              key={item.name}
              style={tw("flex-row items-center gap-1")}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: item.color,
                }}
              />
              <Text style={STATEMENT_REPORT_CHART_LEGEND_STYLE}>
                {item.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
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
        {/* Axis line, right above the category labels. */}
        <Line
          x1={PAD_LEFT}
          y1={HEIGHT - PAD_BOTTOM}
          x2={WIDTH - PAD_RIGHT}
          y2={HEIGHT - PAD_BOTTOM}
          stroke={STATEMENT_REPORT_PALETTE.neutral900}
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
            const LABEL_X =
              X +
              BAR_W / 2 +
              STATEMENT_REPORT_CHART_VALUE_STYLE.fontSize * 0.35
            const LABEL_Y = Y - 2

            return (
              <G key={`${groupIndex}-${seriesIndex}`}>
                <Rect
                  x={X}
                  y={Y}
                  width={BAR_W}
                  height={H}
                  fill={
                    group.colors?.[seriesIndex] ??
                    props.series[seriesIndex]?.color
                  }
                />
                {value !== 0 && (
                  <SvgText
                    x={LABEL_X}
                    y={LABEL_Y}
                    transform={`rotate(-90 ${LABEL_X} ${LABEL_Y})`}
                    style={{
                      fontSize:
                        STATEMENT_REPORT_CHART_VALUE_STYLE.fontSize,
                      fill: STATEMENT_REPORT_CHART_VALUE_STYLE.color,
                    }}
                    textAnchor="start"
                  >
                    {FORMAT_VALUE(value)}
                  </SvgText>
                )}
              </G>
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
              STATEMENT_REPORT_CHART_LEGEND_STYLE,
              {
                width: GROUP_W,
                textAlign: "center",
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
 * Draws a semicircular speedometer for a 0–200% scale.
 *
 * @remarks
 * The dial is a filled ring that runs from the left end to
 * the right end over the top, so the reading reads like a
 * needle sweeping the scale. The value fills the ring
 * against the full scale and the remainder stays on the
 * track tone. A divider caps the 100% mark at the top,
 * splitting the below-target half from the above-target
 * half. A value without a reading leaves the ring empty and
 * prints a dash. The value sits in the middle of the dial
 * and the two scale ends print their own bound.
 *
 * @explanation
 * Use this gauge for the return against the target of the
 * report dashboard. The ring geometry adapts to the size
 * props, so a caller can grow the dial without touching the
 * scale.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-09
 */
export function StatementReportGauge(props: {
  value: number | null
  max?: number
  width?: number
  height?: number
}): ReactElement {
  const MAX = props.max ?? 200
  const WIDTH = props.width ?? 340
  const HEIGHT = props.height ?? 196
  // The ring is a thin band around the dial, so the reading
  // fills the middle instead of being swallowed by the band.
  const RING_THICKNESS = 20
  const CX = WIDTH / 2
  const CY = HEIGHT - 24
  const R_OUTER = Math.min(WIDTH / 2 - 14, CY - 14)
  const R_INNER = Math.max(R_OUTER - RING_THICKNESS, 0)

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

  const TRACK = DescribeDonutSlice(
    CX,
    CY,
    R_OUTER,
    R_INNER,
    180,
    0
  )
  const FOREGROUND =
    props.value === null || RATIO <= 0.005
      ? null
      : DescribeDonutSlice(CX, CY, R_OUTER, R_INNER, START, END)

  return (
    <Svg width={WIDTH} height={HEIGHT}>
      <Path d={TRACK} fill={STATEMENT_REPORT_PALETTE.border} />
      {FOREGROUND !== null && (
        <Path d={FOREGROUND} fill={TONE} />
      )}
      {/* White divider at the 100% mark, the top of the dial. */}
      <Line
        x1={CX}
        y1={CY - R_OUTER}
        x2={CX}
        y2={CY - R_INNER}
        stroke={STATEMENT_REPORT_PALETTE.background}
        strokeWidth={2}
      />
      <SvgText
        x={CX}
        y={CY - 20}
        style={{ fontSize: 24, fill: TONE }}
        textAnchor="middle"
      >
        {props.value === null
          ? STATEMENT_REPORT_COPY.unavailable
          : FormatUnsignedPercentage(props.value)}
      </SvgText>
      <SvgText
        x={CX - R_OUTER}
        y={CY + 18}
        style={{
          fontSize: STATEMENT_REPORT_CHART_VALUE_STYLE.fontSize,
          fill: STATEMENT_REPORT_CHART_VALUE_STYLE.color,
        }}
        textAnchor="start"
      >
        {FormatUnsignedPercentage(0)}
      </SvgText>
      <SvgText
        x={CX + R_OUTER}
        y={CY + 18}
        style={{
          fontSize: STATEMENT_REPORT_CHART_VALUE_STYLE.fontSize,
          fill: STATEMENT_REPORT_CHART_VALUE_STYLE.color,
        }}
        textAnchor="end"
      >
        {FormatUnsignedPercentage(MAX)}
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
 * an empty distribution renders as a plain surface ring. An
 * optional `centerLabel` prints inside the hole, usually the
 * total share the slices represent.
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
  centerLabel?: string
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

      // A slice that fills the whole ring starts and ends on
      // the same point, so its arc has nothing to draw. Draw
      // the band as a full circle instead of a disappearing
      // ring segment.
      if (SWEEP >= 359.999) {
        PATHS.push(
          <Circle
            key={`${slice.label}-${index}`}
            cx={CX}
            cy={CY}
            r={(R_OUTER + R_INNER) / 2}
            stroke={slice.color}
            strokeWidth={R_OUTER - R_INNER}
            fill="none"
          />
        )
        return
      }

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
      {props.centerLabel !== undefined && (
        <SvgText
          x={CX}
          y={CY + SIZE * 0.03}
          style={{
            fontSize: 11,
            fontWeight: 400,
            fill: STATEMENT_REPORT_PALETTE.foreground,
          }}
          textAnchor="middle"
        >
          {props.centerLabel}
        </SvgText>
      )}
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
    <View style={tw("flex-col gap-3")}>
      {props.rows.map((row, index) => (
        <View key={`${row.label}-${index}`}>
          <View style={tw("flex-row justify-between mb-1")}>
            <Text style={STATEMENT_REPORT_CHART_CATEGORY_STYLE}>
              {row.label}
            </Text>
            <Text style={STATEMENT_REPORT_CHART_VALUE_STYLE}>
              {row.display}
            </Text>
          </View>
          <View
            style={[
              tw("bg-track"),
              {
                height: 9,
                width: "300px",
                borderRadius: 0,
              },
            ]}
          >
            <View
              style={{
                height: 9,
                borderRadius: 0,
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
 * Describes a ring segment as an SVG path.
 *
 * @remarks
 * Draws the outer arc, the inner arc back and closes the
 * shape, so the segment is a piece of a ring. The angles are
 * measured in degrees from the positive x axis,
 * counterclockwise, with the screen y axis pointing down. A
 * semicircle runs from 180 to 0.
 *
 * @explanation
 * Used by the donut chart and by the gauge. Prefer the chart
 * components above in the document.
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
  // A segment that opens towards a larger angle sweeps
  // counterclockwise on screen, which is an SVG sweep of `0`
  // because the screen y axis points down. A segment that
  // closes towards a smaller angle, like the gauge dial,
  // sweeps the other way. The inner arc walks the ring back,
  // so it always sweeps opposite to the outer arc.
  const OUTER_SWEEP = endAngle >= startAngle ? 0 : 1
  const INNER_SWEEP = 1 - OUTER_SWEEP

  return [
    `M ${OUTER_START.x} ${OUTER_START.y}`,
    `A ${outer} ${outer} 0 ${LARGE_ARC} ${OUTER_SWEEP} ${OUTER_END.x} ${OUTER_END.y}`,
    `L ${INNER_END.x} ${INNER_END.y}`,
    `A ${inner} ${inner} 0 ${LARGE_ARC} ${INNER_SWEEP} ${INNER_START.x} ${INNER_START.y}`,
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
