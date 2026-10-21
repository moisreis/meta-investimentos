import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatSignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type { StatementReportPatrimonyPoint } from "@/services/statement/report/statement-report.types"

import { STATEMENT_REPORT_SECTION_TITLE_STYLE } from "./shared-statement-report-section-title.constants"
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

// Columns of the monthly patrimony table.
const PATRIMONY_COLUMNS: StatementReportColumn<StatementReportPatrimonyPoint>[] =
  [
    {
      label: STATEMENT_REPORT_COPY.monthColumn,
      flexBasis: "30%",
      render: (row) => (
        <Text style={tw("text-xs")}>{row.label}</Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.returnColumn,
      flexBasis: "30%",
      align: "right",
      render: (row) => (
        <Text
          style={tw(
            `text-xs text-right ${
              row.monthlyReturn === null
                ? STATEMENT_REPORT_TONE.neutral
                : ReturnTone(row.monthlyReturn)
            }`
          )}
        >
          {FormatSignedPercentage(row.monthlyReturn)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.patrimonyColumn,
      flexBasis: "40%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatCurrency(row.patrimony)}
        </Text>
      ),
    },
  ]

/**
 * @summary
 * Renders the monthly patrimony table of the report.
 *
 * @remarks
 * The table closes every month of the reference year with
 * its return, tone-aware, and its net assets. A month
 * without a snapshot resolves to a dash on the patrimony
 * column, which is the calculator's neutral reading for a
 * month the portfolio did not hold.
 *
 * @explanation
 * Use this component to render the `Patrimônio Líquido por
 * Mês` section of the statement document.
 *
 * @param rows - The monthly patrimony rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function PatrimonySection(props: {
  rows: StatementReportPatrimonyPoint[]
}): ReactElement {
  const { rows: ROWS } = props

  return (
    <View style={tw("mt-8")}>
      <Text style={STATEMENT_REPORT_SECTION_TITLE_STYLE}>
        {STATEMENT_REPORT_COPY.patrimonyMonthTitle}
      </Text>
      <StatementReportTable
        columns={PATRIMONY_COLUMNS}
        rows={ROWS}
      />
    </View>
  )
}
