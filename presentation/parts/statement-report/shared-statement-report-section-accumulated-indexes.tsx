import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import {
  FormatSignedPercentage,
  FormatUnsignedPercentage,
} from "@/presentation/presenters/percentage.presenter"
import type { StatementReportAccumulatedIndexRow } from "@/services/statement/report/statement-report.types"

import { StatementReportHorizontalBars } from "./shared-statement-report-charts"
import {
  STATEMENT_REPORT_COPY,
  STATEMENT_REPORT_PALETTE,
} from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"

/**
 * @summary
 * Renders the accumulated index comparison of the year.
 *
 * @remarks
 * Shows the accumulated rate of the portfolio, the target
 * and the reference indexes as horizontal bars, each read
 * against the accumulated target so the share is explicit.
 * The portfolio keeps the brand green and the target the
 * brand blue, so the two anchor rows never change tone.
 *
 * @explanation
 * Use this component to render the `Índices Acumulados`
 * section of the statement document.
 *
 * @param rows - The accumulated index rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function AccumulatedIndexesSection(props: {
  rows: StatementReportAccumulatedIndexRow[]
}): ReactElement {
  const ROWS = props.rows.map((row, index) => {
    const VALUE = Number.parseFloat(row.rate ?? "")
    return {
      label: row.name,
      value: Number.isFinite(VALUE) ? VALUE : 0,
      color: PickColor(row.name, index),
      display:
        row.rate === null
          ? STATEMENT_REPORT_COPY.unavailable
          : FormatShareCaption(row.rate, row.shareOfTarget),
    }
  })

  return (
    <View style={tw("mt-8")}>
      <Text style={tw("text-base font-bold")}>
        {STATEMENT_REPORT_COPY.accumulatedIndexesTitle}
      </Text>
      <View style={tw("mt-2")}>
        <StatementReportHorizontalBars rows={ROWS} />
      </View>
    </View>
  )
}

/**
 * Renders the rate of a row followed by its share of the
 * target when the target resolves, so a row without a target
 * reads cleanly instead of printing a blank share.
 */
function FormatShareCaption(
  rate: string,
  shareOfTarget: string | null
): string {
  const CAPTION = FormatSignedPercentage(rate)
  if (shareOfTarget === null) return CAPTION
  return `${CAPTION} · ${FormatUnsignedPercentage(
    shareOfTarget
  )} ${STATEMENT_REPORT_COPY.shareOfTargetColumn}`
}

/**
 * Picks the bar color of an accumulated index row, keeping
 * the portfolio green and the target blue.
 */
function PickColor(name: string, index: number): string {
  if (name === STATEMENT_REPORT_COPY.portfolioLabel) {
    return STATEMENT_REPORT_PALETTE.primary
  }
  if (name === STATEMENT_REPORT_COPY.metaLabel) {
    return STATEMENT_REPORT_PALETTE.brandBlue
  }
  return index % 2 === 0
    ? STATEMENT_REPORT_PALETTE.brandPurple
    : STATEMENT_REPORT_PALETTE.subdued
}
