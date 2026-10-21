import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import { FormatUnsignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type { StatementReportDistributionRow } from "@/services/statement/report/statement-report.types"

import {
  STATEMENT_REPORT_CHART_CATEGORY_STYLE,
  STATEMENT_REPORT_CHART_VALUE_STYLE,
} from "./shared-statement-report-chart-labels.constants"
import { StatementReportDonut } from "./shared-statement-report-charts"
import { STATEMENT_REPORT_SECTION_TITLE_STYLE } from "./shared-statement-report-section-title.constants"
import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"

/**
 * @summary
 * Renders the share of the portfolio per index and institution.
 *
 * @remarks
 * Puts the share per reference index and per financial
 * institution as donuts, where the number of groups is small.
 * Every legend carries the share of the group.
 *
 * @explanation
 * Use this component to render the `Distribuição por Índice
 * de Referência` and `Distribuição por Instituição` sections
 * of the statement document.
 *
 * @param indexes - The share of the portfolio per index.
 * @param institutions - The share per institution.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function DistributionDonutsSection(props: {
  indexes: StatementReportDistributionRow[]
  institutions: StatementReportDistributionRow[]
}): ReactElement {
  const { indexes: INDEXES, institutions: INSTITUTIONS } = props

  return (
    <View style={tw("mt-8 flex-col gap-8")}>
      <DistributionDonutBlock
        title={STATEMENT_REPORT_COPY.distributionIndexTitle}
        rows={INDEXES}
      />
      <View style={tw("border-t border-border")} />
      <DistributionDonutBlock
        title={
          STATEMENT_REPORT_COPY.distributionInstitutionTitle
        }
        rows={INSTITUTIONS}
      />
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
    <View>
      <Text style={STATEMENT_REPORT_SECTION_TITLE_STYLE}>
        {props.title}
      </Text>
      <View style={tw("flex-row items-center gap-4 mt-2")}>
        <StatementReportDonut
          slices={props.rows.map((row) => ({
            label: row.name,
            value: ToNumber(row.value),
            color: row.color,
          }))}
          size={130}
          centerLabel={FormatUnsignedPercentage(
            SumWeights(props.rows)
          )}
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
              <Text
                style={[
                  STATEMENT_REPORT_CHART_CATEGORY_STYLE,
                  { flexGrow: 1 },
                ]}
              >
                {row.name}
              </Text>
              <Text style={STATEMENT_REPORT_CHART_VALUE_STYLE}>
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
 * Sums the share of every row, so the center of the donut
 * reads the total the slices represent.
 */
function SumWeights(
  rows: readonly StatementReportDistributionRow[]
): number {
  return rows.reduce((sum, row) => {
    const PARSED = Number.parseFloat(row.weight)
    return Number.isFinite(PARSED) ? sum + PARSED : sum
  }, 0)
}

/**
 * Parses a distribution value into a chart number.
 */
function ToNumber(value: string): number {
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? Math.max(PARSED, 0) : 0
}
