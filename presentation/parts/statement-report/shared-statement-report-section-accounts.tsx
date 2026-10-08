import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatUnsignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type { StatementReportCheckingAccountRow } from "@/services/statement/report/statement-report.types"

import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"
import {
  StatementReportTable,
  type StatementReportColumn,
} from "./shared-statement-report-table"

// Columns of the checking account table.
const ACCOUNT_COLUMNS: StatementReportColumn<StatementReportCheckingAccountRow>[] =
  [
    {
      label: STATEMENT_REPORT_COPY.institutionColumn,
      flexBasis: "46%",
      render: (row) => (
        <Text style={tw("text-xs")}>{row.institution}</Text>
      ),
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
    },
    {
      label: STATEMENT_REPORT_COPY.weightColumn,
      flexBasis: "12%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatUnsignedPercentage(row.weight)}
        </Text>
      ),
    },
  ]

/**
 * @summary
 * Renders the checking account table of the report.
 *
 * @remarks
 * Lists the balance of every bank account of the portfolio
 * on the reference month against the institution that
 * custodies it, largest balance first, and closes with the
 * summed balance. A bank account without a registered
 * balance up to the month end stays out.
 *
 * @explanation
 * Use this component to render the `Contas Correntes`
 * section of the statement document.
 *
 * @param rows - The checking account rows to render.
 * @param total - The summed balance of the accounts.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function AccountsSection(props: {
  rows: StatementReportCheckingAccountRow[]
  total: string
}): ReactElement {
  const { rows: ROWS, total: TOTAL } = props

  return (
    <View style={tw("mt-8")}>
      <Text style={tw("text-base font-bold")}>
        {STATEMENT_REPORT_COPY.accountsTitle}
      </Text>
      {ROWS.length === 0 ? (
        <Text style={tw("mt-2 text-xs text-subdued")}>
          {STATEMENT_REPORT_COPY.accountsEmpty}
        </Text>
      ) : (
        <>
          <StatementReportTable
            columns={ACCOUNT_COLUMNS}
            rows={ROWS}
          />
          <View
            style={tw(
              "flex-row justify-end border-t border-border px-2 py-1 mt-1"
            )}
          >
            <Text style={tw("text-xs font-bold")}>
              {STATEMENT_REPORT_COPY.totalLabelShort}
            </Text>
            <Text style={tw("ml-4 text-xs font-bold")}>
              {FormatCurrency(TOTAL)}
            </Text>
          </View>
        </>
      )}
    </View>
  )
}
