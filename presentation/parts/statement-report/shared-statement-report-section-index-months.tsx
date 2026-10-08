import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import { FormatSignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type { StatementReportIndexMonthRow } from "@/services/statement/report/statement-report.types"

import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"
import {
  ReturnTone,
  STATEMENT_REPORT_TONE,
} from "./shared-statement-report-tones.constants"
import {
  StatementReportTable,
  type StatementReportColumn,
} from "./shared-statement-report-table"

// Columns of the indices-by-month table. The portfolio and
// the target come before the reference indexes, so a reader
// compares them left to right.
const INDEX_MONTH_COLUMNS: StatementReportColumn<StatementReportIndexMonthRow>[] =
  [
    MonthColumn(),
    RateColumn(
      STATEMENT_REPORT_COPY.carteiraLabel,
      (row) => row.portfolio
    ),
    RateColumn(
      STATEMENT_REPORT_COPY.metaLabel,
      (row) => row.target
    ),
    RateColumn("IRF-M", (row) => row.irfM),
    RateColumn("IRF-M1", (row) => row.irfM1),
    RateColumn("IMA-B", (row) => row.imaB),
    RateColumn("IMA-B5", (row) => row.imaB5),
  ]

/**
 * @summary
 * Renders the indices-by-month table of the report.
 *
 * @remarks
 * The reference year is split into two tables — January to
 * September and October to December — so the wide row of
 * monthly rates reads on its own block instead of being
 * clipped by the page. The header repeats on both, and a
 * missing reading stays a dash.
 *
 * @explanation
 * Use this component to render the `Índices por Mês`
 * section of the statement document.
 *
 * @param rows - The month rows of the reference year.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function IndexMonthsSection(props: {
  rows: StatementReportIndexMonthRow[]
}): ReactElement {
  const FIRST_HALF = props.rows.slice(0, 9)
  const SECOND_HALF = props.rows.slice(9)

  return (
    <View style={tw("mt-8")}>
      <Text style={tw("text-base font-bold")}>
        {STATEMENT_REPORT_COPY.indexMonthsTitle}
      </Text>
      <Text style={tw("text-xs text-subdued")}>
        Janeiro a setembro
      </Text>
      <StatementReportTable
        columns={INDEX_MONTH_COLUMNS}
        rows={FIRST_HALF}
      />
      <Text style={tw("mt-6 text-xs text-subdued")}>
        Outubro a dezembro
      </Text>
      <StatementReportTable
        columns={INDEX_MONTH_COLUMNS}
        rows={SECOND_HALF}
      />
    </View>
  )
}

/**
 * Builds the month label column of the table.
 */
function MonthColumn(): StatementReportColumn<StatementReportIndexMonthRow> {
  return {
    label: STATEMENT_REPORT_COPY.monthColumn,
    flexBasis: "22%",
    render: (row) => (
      <Text style={tw("text-xs")}>{row.label}</Text>
    ),
  }
}

/**
 * Builds a signed rate column of the table, tone-aware.
 */
function RateColumn(
  label: string,
  pick: (row: StatementReportIndexMonthRow) => string | null
): StatementReportColumn<StatementReportIndexMonthRow> {
  return {
    label,
    flexBasis: "13%",
    align: "right",
    render: (row) => {
      const VALUE = pick(row)
      return (
        <Text
          style={tw(
            `text-xs text-right ${
              VALUE === null
                ? STATEMENT_REPORT_TONE.neutral
                : ReturnTone(VALUE)
            }`
          )}
        >
          {FormatSignedPercentage(VALUE)}
        </Text>
      )
    },
  }
}
