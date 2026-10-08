import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import { FormatUnsignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type { StatementReportComplianceRow } from "@/services/statement/report/statement-report.types"

import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"
import {
  StatementReportTable,
  type StatementReportColumn,
} from "./shared-statement-report-table"

// Columns of the compliance table.
const COMPLIANCE_COLUMNS: StatementReportColumn<StatementReportComplianceRow>[] =
  [
    {
      label: STATEMENT_REPORT_COPY.compliancePolicyColumn,
      flexBasis: "40%",
      render: (row) => (
        <Text style={tw("text-xs")}>{row.policy}</Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.complianceCurrentColumn,
      flexBasis: "14%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right font-bold")}>
          {FormatUnsignedPercentage(row.current)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.complianceTargetColumn,
      flexBasis: "12%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatUnsignedPercentage(row.target)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.complianceMinColumn,
      flexBasis: "12%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatUnsignedPercentage(row.minimum)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.complianceMaxColumn,
      flexBasis: "12%",
      align: "right",
      render: (row) => (
        <Text style={tw("text-xs text-right")}>
          {FormatUnsignedPercentage(row.maximum)}
        </Text>
      ),
    },
    {
      label: STATEMENT_REPORT_COPY.complianceFlagColumn,
      flexBasis: "10%",
      align: "right",
      render: (row) => (
        <Text
          style={tw(
            `text-xs text-right font-bold ${
              row.compliant ? "text-positive" : "text-negative"
            }`
          )}
        >
          {row.compliant
            ? STATEMENT_REPORT_COPY.yesLabel
            : STATEMENT_REPORT_COPY.noLabel}
        </Text>
      ),
    },
  ]

/**
 * @summary
 * Renders the investment policy compliance table.
 *
 * @remarks
 * Checks the current share of every registered policy
 * against its minimum and maximum allocation, so the reader
 * sees at a glance how far the portfolio sits from the
 * Resolution limits. A policy outside its range reads `Não`
 * in red.
 *
 * @explanation
 * Use this component to render the `Enquadramento da
 * Carteira` section of the statement document.
 *
 * @param rows - The compliance rows to render.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function ComplianceSection(props: {
  rows: StatementReportComplianceRow[]
}): ReactElement {
  return (
    <View style={tw("mt-8")}>
      <Text style={tw("text-base font-bold")}>
        {STATEMENT_REPORT_COPY.complianceTitle}
      </Text>
      {props.rows.length === 0 ? (
        <Text style={tw("mt-2 text-xs text-subdued")}>
          {STATEMENT_REPORT_COPY.complianceEmpty}
        </Text>
      ) : (
        <StatementReportTable
          columns={COMPLIANCE_COLUMNS}
          rows={props.rows}
        />
      )}
    </View>
  )
}
