import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatUnsignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type { StatementReportDistributionRow } from "@/services/statement/report/statement-report.types"

import {
  StatementReportDonut,
  StatementReportHorizontalBars,
} from "./shared-statement-report-charts"
import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"

/**
 * @summary
 * Renders the distribution charts of the report.
 *
 * @remarks
 * Puts the share of the portfolio per fund as a horizontal
 * bar list, because fund names are long, and the share per
 * reference index and per financial institution as donuts,
 * where the number of groups is small. Every legend carries
 * the share and the money of the group.
 *
 * @explanation
 * Use this component to render the distribution sections of
 * the statement document.
 *
 * @param funds - The share of the portfolio per fund.
 * @param indexes - The share of the portfolio per index.
 * @param institutions - The share per institution.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function DistributionsSection(props: {
  funds: StatementReportDistributionRow[]
  indexes: StatementReportDistributionRow[]
  institutions: StatementReportDistributionRow[]
}): ReactElement {
  const {
    funds: FUNDS,
    indexes: INDEXES,
    institutions: INSTITUTIONS,
  } = props

  return (
    <View style={tw("mt-8 flex-col gap-6")}>
      <View>
        <Text style={tw("text-base font-bold")}>
          {STATEMENT_REPORT_COPY.distributionFundTitle}
        </Text>
        <View style={tw("mt-2")}>
          <StatementReportHorizontalBars
            rows={FUNDS.map((row) => ({
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

      <View style={tw("flex-row gap-6")}>
        <DistributionDonutBlock
          title={STATEMENT_REPORT_COPY.distributionIndexTitle}
          rows={INDEXES}
        />
        <DistributionDonutBlock
          title={
            STATEMENT_REPORT_COPY.distributionInstitutionTitle
          }
          rows={INSTITUTIONS}
        />
      </View>
    </View>
  )
}

/**
 * Renders one donut chart next to its legend.
 */
function DistributionDonutBlock(props: {
  title: string
  rows: StatementReportDistributionRow[]
}): ReactElement {
  return (
    <View style={tw("flex-1")}>
      <Text style={tw("text-sm font-bold")}>{props.title}</Text>
      <View style={tw("flex-row items-center gap-4 mt-2")}>
        <StatementReportDonut
          slices={props.rows.map((row) => ({
            label: row.name,
            value: ToNumber(row.value),
            color: row.color,
          }))}
          size={130}
        />
        <View style={tw("flex-1 flex-col gap-1")}>
          {props.rows.map((row, index) => (
            <View
              key={`${row.name}-${index}`}
              style={tw("flex-row items-center gap-1")}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: row.color,
                }}
              />
              <Text style={tw("flex-1 text-xs text-subdued")}>
                {row.name}
              </Text>
              <Text style={tw("text-xs")}>
                {FormatUnsignedPercentage(row.weight)}
              </Text>
            </View>
          ))}
        </View>
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
