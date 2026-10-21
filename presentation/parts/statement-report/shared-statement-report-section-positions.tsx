import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import {
  FormatCurrency,
  FormatSignedCurrency,
} from "@/presentation/presenters/currency.presenter"
import {
  FormatPercentage,
  FormatSignedPercentage,
} from "@/presentation/presenters/percentage.presenter"
import type { StatementReportPositionRow } from "@/services/statement/report/statement-report.types"

import { STATEMENT_REPORT_SECTION_TITLE_STYLE } from "./shared-statement-report-section-title.constants"
import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"
import {
  StatementReportTable,
  type StatementReportColumn,
} from "./shared-statement-report-table"

/**
 * Parses a nullable report figure into a number the totals
 * can sum, reading a position without a snapshot as no
 * movement at all.
 */
function ToNumber(value: string | null): number {
  return Number.parseFloat(value ?? "0")
}

/**
 * Sums one nullable figure across every position row.
 */
function SumRows(
  rows: readonly StatementReportPositionRow[],
  figure: (row: StatementReportPositionRow) => string | null
): number {
  return rows.reduce(
    (sum, row) => sum + ToNumber(figure(row)),
    0
  )
}

/**
 * The columns of the positions table.
 *
 * The earnings, movement and return figures print their own
 * sign, so the direction reads from the text and never from a
 * colour. The month and year returns cannot be summed, so
 * they stay blank on the closing total row.
 */
const POSITION_COLUMNS: StatementReportColumn<StatementReportPositionRow>[] =
  [
    {
      label: STATEMENT_REPORT_COPY.fundColumn,
      flexBasis: "40%",
      render: (row) => (
        <Text style={tw("text-xs")}>{row.fundName}</Text>
      ),
      total: () => STATEMENT_REPORT_COPY.totalLabelShort,
    },
    {
      label: STATEMENT_REPORT_COPY.monthReturnColumn,
      flexBasis: "9%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatSignedPercentage(row.returnMonthly)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.yearReturnColumn,
      flexBasis: "9%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatSignedPercentage(row.returnYearly)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.earningsColumn,
      flexBasis: "14%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatSignedCurrency(row.earnings)}
        </Text>
      ),
      total: (rows) =>
        FormatSignedCurrency(
          SumRows(rows, (row) => row.earnings)
        ),
    },
    {
      label: STATEMENT_REPORT_COPY.movementColumn,
      flexBasis: "14%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatSignedCurrency(row.movement)}
        </Text>
      ),
      total: (rows) =>
        FormatSignedCurrency(
          SumRows(rows, (row) => row.movement)
        ),
    },
    {
      label: STATEMENT_REPORT_COPY.finalValueColumn,
      flexBasis: "16%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatCurrency(row.finalValue)}
        </Text>
      ),
      total: (rows) =>
        FormatCurrency(SumRows(rows, (row) => row.finalValue)),
    },
    {
      label: STATEMENT_REPORT_COPY.positionWeightColumn,
      flexBasis: "8%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatPercentage(row.weight)}
        </Text>
      ),
      total: (rows) =>
        FormatPercentage(SumRows(rows, (row) => row.weight)),
    },
  ]

/**
 * @summary
 * Renders the investment portfolio table of the statement.
 *
 * @remarks
 * Lists the holdings with the fund, the month and year return
 * percentages, the earnings and the net movement of the
 * position in the reference month, the closing value and the
 * share of the portfolio it holds. The table closes with a
 * bold total row that sums the money columns and the weight,
 * leaving the returns blank. Every signed figure carries its
 * own `+` or `-`, so the direction never depends on colour.
 *
 * @explanation
 * Use this component to render the `Carteira de investimentos`
 * section of the statement document.
 *
 * @param rows - The position rows to render.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function PositionsSection(props: {
  rows: StatementReportPositionRow[]
}): ReactElement {
  const { rows: ROWS } = props

  return (
    <View style={tw("mt-8")}>
      <Text style={STATEMENT_REPORT_SECTION_TITLE_STYLE}>
        {STATEMENT_REPORT_COPY.positionsTitle}
      </Text>
      {ROWS.length === 0 ? (
        <Text style={tw("mt-2 text-xs text-subdued")}>
          {STATEMENT_REPORT_COPY.positionsEmpty}
        </Text>
      ) : (
        <StatementReportTable
          columns={POSITION_COLUMNS}
          rows={ROWS}
        />
      )}
    </View>
  )
}
