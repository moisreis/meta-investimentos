import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import {
  FormatCurrency,
  FormatSignedCurrency,
} from "@/presentation/presenters/currency.presenter"
import { FormatSignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type {
  StatementReportMovementPoint,
  StatementReportPatrimonyPoint,
} from "@/services/statement/report/statement-report.types"

import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"
import {
  ResultTone,
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
 * Renders the monthly patrimony and movement tables.
 *
 * @remarks
 * The patrimony table closes every month of the reference
 * year with its return and its net assets, and the movement
 * table reconciles the applications and the redemptions of
 * every month into a signed net figure. A month without a
 * snapshot resolves to a dash on the patrimony column, while
 * the movement columns read zero, which is the calculator's
 * neutral reading for a month the portfolio did not trade.
 *
 * @explanation
 * Use this component to render the `Patrimônio Líquido por
 * Mês` and `Movimentações por Mês` sections of the
 * statement document.
 *
 * @param patrimony - The monthly patrimony rows.
 * @param movements - The monthly movement rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function MonthlySection(props: {
  patrimony: StatementReportPatrimonyPoint[]
  movements: StatementReportMovementPoint[]
}): ReactElement {
  const { patrimony: PATRIMONY, movements: MOVEMENTS } = props

  return (
    <View style={tw("mt-8 flex-col gap-6")}>
      <View>
        <Text style={tw("text-base font-bold")}>
          {STATEMENT_REPORT_COPY.patrimonyMonthTitle}
        </Text>
        <StatementReportTable
          columns={PATRIMONY_COLUMNS}
          rows={PATRIMONY}
        />
      </View>
      <View>
        <Text style={tw("text-base font-bold")}>
          {STATEMENT_REPORT_COPY.movementMonthTitle}
        </Text>
        <StatementReportTable
          columns={MOVEMENT_COLUMNS}
          rows={MOVEMENTS}
        />
      </View>
    </View>
  )
}
