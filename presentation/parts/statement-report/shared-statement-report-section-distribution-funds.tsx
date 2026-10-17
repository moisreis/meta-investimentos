import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatUnsignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type { StatementReportDistributionRow } from "@/services/statement/report/statement-report.types"

import { StatementReportHorizontalBars } from "./shared-statement-report-charts"
import { STATEMENT_REPORT_SECTION_TITLE_STYLE } from "./shared-statement-report-section-title.constants"
import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"

/**
 * @summary
 * Renders the share of the portfolio per fund.
 *
 * @remarks
 * Puts every fund the portfolio holds as a horizontal bar
 * list, because fund names are long and read better on their
 * own line. Each bar carries the share and the money of the
 * group.
 *
 * @explanation
 * Use this component to render the `Distribuição por Fundo`
 * section of the statement document.
 *
 * @param rows - The share of the portfolio per fund.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function DistributionFundsSection(props: {
  rows: StatementReportDistributionRow[]
}): ReactElement {
  const { rows: ROWS } = props

  return (
    <View style={tw("mt-8")}>
      <Text style={STATEMENT_REPORT_SECTION_TITLE_STYLE}>
        {STATEMENT_REPORT_COPY.distributionFundTitle}
      </Text>
      <View style={tw("mt-2")}>
        <StatementReportHorizontalBars
          rows={ROWS.map((row) => ({
            label: row.name,
            value: ToNumber(row.value),
            color: row.color,
            display: `${FormatUnsignedPercentage(
              row.weight
            )} · ${FormatCurrency(row.value)}`,
          }))}
        />
      </View>
    </View>
  )
}

/**
 * Parses a distribution value into a chart number.
 */
function ToNumber(value: string): number {
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? Math.max(PARSED, 0) : 0
}
