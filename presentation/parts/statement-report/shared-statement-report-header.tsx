import { Image, Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"
import { readFileSync } from "node:fs"

import type { StatementReportData } from "@/services/statement/report/statement-report.types"

import { FormatMonthYear } from "@/presentation/presenters/date.presenter"

import { tw } from "./shared-statement-report-styles.constants"

/**
 * @summary
 * Renders the running header stamped on pages after the cover.
 *
 * @remarks
 * Stays pinned to the top margin so every content page
 * identifies the institution, portfolio and reference period.
 * The cover page intentionally omits this header.
 *
 * @param data - The report model to render.
 *
 * @returns The running header.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-07
 */
export function RunningHeader(props: {
  data: StatementReportData
}): ReactElement {
  const { data: DATA } = props

  return (
    <View
      fixed
      style={tw(
        "absolute left-8 right-8 top-6 flex-row justify-between items-center border-b border-neutral-100 pb-2"
      )}
    >
      <View style={tw("flex-row justify-center items-center")}>
        <Text style={tw("text-xs text-subdued")}>
          {`${DATA.portfolio.name}`}
        </Text>
      </View>
      <View style={tw("flex-row justify-center items-center")}>
        <Text style={tw("text-xs text-subdued")}>
          {FormatMonthYear(DATA.periodEnd)}
        </Text>
      </View>
    </View>
  )
}
