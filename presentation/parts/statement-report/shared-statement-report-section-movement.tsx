import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import {
  FormatCurrency,
  FormatSignedCurrency,
} from "@/presentation/presenters/currency.presenter"
import type { StatementReportMovementPoint } from "@/services/statement/report/statement-report.types"

import { STATEMENT_REPORT_SECTION_TITLE_STYLE } from "./shared-statement-report-section-title.constants"
import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"
import {
  ResultTone,
  STATEMENT_REPORT_TONE,
} from "./shared-statement-report-tones.constants"
import {
  StatementReportTable,
  type StatementReportColumn,
} from "./shared-statement-report-table"

// Columns of the monthly movement table.
const MOVEMENT_COLUMNS: StatementReportColumn<StatementReportMovementPoint>[] =
  [
    {
      label: STATEMENT_REPORT_COPY.monthColumn,
      flexBasis: "25%",
      render: (row) => (
        <Text style={tw("text-xs")}>{row.label}</Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.applicationsColumn,
      flexBasis: "25%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatCurrency(row.applications)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.withdrawalsColumn,
      flexBasis: "25%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatCurrency(row.withdrawals)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.netColumn,
      flexBasis: "25%",
      align: "right",
      render: (row) => (
        <Text
          style={tw(
            `text-xs text-right ${
              STATEMENT_REPORT_TONE[ResultTone(row.net)]
            }`
          )}
        >
          {FormatSignedCurrency(row.net)}
        </Text>
      ),
    },
  ]

/**
 * @summary
 * Renders the monthly movement table of the report.
 *
 * @remarks
 * The table reconciles the applications and the redemptions
 * of every month of the reference year into a signed net
 * figure. The movement columns read zero for a month the
 * portfolio did not trade, which is the calculator's neutral
 * reading.
 *
 * @explanation
 * Use this component to render the `Movimentações por Mês`
 * section of the statement document.
 *
 * @param rows - The monthly movement rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function MovementSection(props: {
  rows: StatementReportMovementPoint[]
}): ReactElement {
  const { rows: ROWS } = props

  return (
    <View style={tw("mt-8")}>
      <Text style={STATEMENT_REPORT_SECTION_TITLE_STYLE}>
        {STATEMENT_REPORT_COPY.movementMonthTitle}
      </Text>
      <StatementReportTable
        columns={MOVEMENT_COLUMNS}
        rows={ROWS}
      />
    </View>
  )
}
