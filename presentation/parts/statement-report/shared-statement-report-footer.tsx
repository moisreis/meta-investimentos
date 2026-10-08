import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import type { StatementReportData } from "@/services/statement/report/statement-report.types"

import { STATEMENT_REPORT_COPY } from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"

/**
 * @summary
 * Marks the end of the statement body.
 */
export function ClosingNote(): ReactElement {
  return (
    <Text style={tw("mt-8 text-center text-xs text-subdued")}>
      {STATEMENT_REPORT_COPY.footer}
    </Text>
  )
}

/**
 * @summary
 * Builds the "Página X de Y" label of the running footer.
 */
export function FormatPageLabel(
  pageNumber: number,
  totalPages: number
): string {
  return `${STATEMENT_REPORT_COPY.pagePrefix} ${pageNumber} ${STATEMENT_REPORT_COPY.pageSeparator} ${totalPages}`
}

/**
 * @summary
 * Renders the running footer stamped on every page.
 *
 * @remarks
 * Stays pinned to the bottom margin so a printed or archived
 * page is never anonymous: it carries the portfolio, the
 * period and the page number against the total, which
 * **react-pdf** resolves in a second pass once the page
 * count is known.
 *
 * @param data - The report model to render.
 *
 * @returns The running footer.
 */
export function RunningFooter(props: {
  data: StatementReportData
}): ReactElement {
  const { data: DATA } = props

  return (
    <View
      fixed
      style={tw(
        "absolute left-8 right-8 bottom-8 flex-row justify-between items-center"
      )}
    >
      <Text style={tw("text-xs text-subdued")}>
        {`${DATA.portfolio.name}`}
      </Text>
      <Text
        style={tw("text-xs text-subdued")}
        render={({ pageNumber, totalPages }) => (
          <Text style={tw("text-xs text-subdued")}>
            {FormatPageLabel(pageNumber, totalPages)}
          </Text>
        )}
      />
    </View>
  )
}
