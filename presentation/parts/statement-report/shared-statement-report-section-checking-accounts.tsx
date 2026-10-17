import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatUnsignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type { StatementReportCheckingAccountRow } from "@/services/statement/report/statement-report.types"

import { STATEMENT_REPORT_SECTION_TITLE_STYLE } from "./shared-statement-report-section-title.constants"
import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"
import {
  StatementReportTable,
  type StatementReportColumn,
} from "./shared-statement-report-table"

/**
 * Parses a report figure into a number the totals can sum,
 * reading a missing figure as no balance at all.
 */
function ToNumber(value: string | null): number {
  return Number.parseFloat(value ?? "0")
}

/**
 * Sums one figure across every checking account row.
 */
function SumRows(
  rows: readonly StatementReportCheckingAccountRow[],
  figure: (
    row: StatementReportCheckingAccountRow
  ) => string | null
): number {
  return rows.reduce(
    (sum, row) => sum + ToNumber(figure(row)),
    0
  )
}

/**
 * The columns of the checking account table.
 *
 * The closing total row sums the balance and the share of the
 * portfolio, and leaves the account number blank.
 */
const ACCOUNT_COLUMNS: StatementReportColumn<StatementReportCheckingAccountRow>[] =
  [
    {
      label: STATEMENT_REPORT_COPY.institutionColumn,
      flexBasis: "46%",
      render: (row) => (
        <Text style={tw("text-xs")}>{row.institution}</Text>
      ),
      total: () => STATEMENT_REPORT_COPY.totalLabelShort,
    },
    {
      label: STATEMENT_REPORT_COPY.accountColumn,
      flexBasis: "24%",
      render: (row) => (
        <Text style={tw("text-xs text-subdued")}>
          {row.accountNumber}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.balanceColumn,
      flexBasis: "18%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatCurrency(row.balance)}
        </Text>
      ),
      total: (rows) =>
        FormatCurrency(SumRows(rows, (row) => row.balance)),
    },
    {
      label: STATEMENT_REPORT_COPY.accountWeightColumn,
      flexBasis: "12%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatUnsignedPercentage(row.weight)}
        </Text>
      ),
      total: (rows) =>
        FormatUnsignedPercentage(
          SumRows(rows, (row) => row.weight)
        ),
    },
  ]

/**
 * @summary
 * Renders the checking account table of the statement.
 *
 * @remarks
 * Lists the balance of every bank account of the portfolio on
 * the reference month against the institution that custodies
 * it, largest balance first. The table closes with a bold
 * total row that sums the balances and the share each account
 * holds of the total. A bank account without a registered
 * balance up to the month end stays out.
 *
 * @explanation
 * Use this component to render the `Contas Correntes` section
 * of the statement document.
 *
 * @param rows - The checking account rows to render.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-09
 */
export function CheckingAccountsSection(props: {
  rows: StatementReportCheckingAccountRow[]
}): ReactElement {
  const { rows: ROWS } = props

  return (
    <View style={tw("mt-8")}>
      <Text style={STATEMENT_REPORT_SECTION_TITLE_STYLE}>
        {STATEMENT_REPORT_COPY.accountsTitle}
      </Text>
      {ROWS.length === 0 ? (
        <Text style={tw("mt-2 text-xs text-subdued")}>
          {STATEMENT_REPORT_COPY.accountsEmpty}
        </Text>
      ) : (
        <StatementReportTable
          columns={ACCOUNT_COLUMNS}
          rows={ROWS}
        />
      )}
    </View>
  )
}
