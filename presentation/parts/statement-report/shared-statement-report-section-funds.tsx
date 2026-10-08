import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatUnsignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type { StatementReportFundAssetRow } from "@/services/statement/report/statement-report.types"

import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"
import {
  StatementReportTable,
  type StatementReportColumn,
} from "./shared-statement-report-table"

// Columns of the fund reference table.
const FUND_COLUMNS: StatementReportColumn<StatementReportFundAssetRow>[] =
  [
    {
      label: STATEMENT_REPORT_COPY.cnpjColumn,
      flexBasis: "20%",
      render: (row) => (
        <Text style={tw("text-xs text-subdued")}>
          {row.cnpj}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.fundColumn,
      flexBasis: "38%",
      render: (row) => (
        <View>
          <Text style={tw("text-xs")}>{row.name}</Text>
          {row.categoryName !== null && (
            <Text style={tw("text-xs text-subdued")}>
              {row.categoryName}
            </Text>
          )}
        </View>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.fundingColumn,
      flexBasis: "28%",
      render: (row) => (
        <Text style={tw("text-xs")}>
          {row.framing ?? STATEMENT_REPORT_COPY.unavailable}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.administrationFeeColumn,
      flexBasis: "14%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {row.administrationFee === null
            ? STATEMENT_REPORT_COPY.unavailable
            : FormatUnsignedPercentage(row.administrationFee)}
        </Text>
      ),
    },
  ]

/**
 * @summary
 * Renders the fund reference table of the report.
 *
 * @remarks
 * Lists every fund the portfolio holds with its CNPJ, the
 * category and the Resolution framing of its norm article,
 * and the administration fee. Closes with the total invested
 * assets of the reference month.
 *
 * @explanation
 * Use this component to render the `Fundos e Ativos` section
 * of the statement document.
 *
 * @param rows - The fund rows to render.
 * @param totalAssets - The total invested assets of the month.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function FundsSection(props: {
  rows: StatementReportFundAssetRow[]
  totalAssets: string | null
}): ReactElement {
  const { rows: ROWS, totalAssets: TOTAL } = props

  return (
    <View style={tw("mt-8")}>
      <Text style={tw("text-base font-bold")}>
        {STATEMENT_REPORT_COPY.fundsTitle}
      </Text>
      {ROWS.length === 0 ? (
        <Text style={tw("mt-2 text-xs text-subdued")}>
          {STATEMENT_REPORT_COPY.positionsEmpty}
        </Text>
      ) : (
        <>
          <StatementReportTable
            columns={FUND_COLUMNS}
            rows={ROWS}
          />
          <View
            style={tw(
              "flex-row justify-end border-t border-border px-2 py-1 mt-1"
            )}
          >
            <Text style={tw("text-xs font-bold")}>
              {STATEMENT_REPORT_COPY.totalAssetsLabel}
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
