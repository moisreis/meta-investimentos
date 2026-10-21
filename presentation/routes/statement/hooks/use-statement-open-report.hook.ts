"use client"

import { useCallback, useMemo, useState } from "react"

import { checkStatementMonthAction } from "@/presentation/routes/statement/actions/check-statement-month.action"

// Message shown when a month holds no IPCA reading, so the
// report cannot be rendered.
const MISSING_READING_MESSAGE =
  "Não foi possível abrir o relatório. Os dados de IPCA " +
  "do mês de referência não estão cadastrados."

/**
 * View model of the statement open-report flow.
 */
export interface StatementOpenReportModel {
  openReport: (fileUrl: string) => Promise<void>
  alertOpen: boolean
  alertDescription: string
  setAlertOpen: (open: boolean) => void
}

/**
 * @summary
 * Opens a statement pdf after checking it can be rendered.
 *
 * @remarks
 * The report cannot be rendered without the IPCA reading of
 * its reference month, so opening the file blindly would end
 * in an error page in a new tab. This hook asks the server
 * whether the month can be rendered first: an available
 * report opens in a new tab, a missing reading opens the
 * notice dialog instead. The portfolio and month are read
 * from the file url the statement stored, so every caller
 * only passes the url.
 *
 * @explanation
 * Use from both the row open action and the generate success
 * toast action, so a report that cannot render always states
 * why in-app.
 *
 * @returns The open-report handler and the notice state.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
function useStatementOpenReport(): StatementOpenReportModel {
  const [ALERT_OPEN, setAlertOpen] = useState(false)
  const [ALERT_DESCRIPTION, setAlertDescription] = useState(
    MISSING_READING_MESSAGE
  )

  const OpenReport = useCallback(async (fileUrl: string) => {
    const PARAMS = ParseFileUrl(fileUrl)

    if (PARAMS === null) {
      window.open(fileUrl, "_blank", "noopener")
      return
    }

    const RESULT = await checkStatementMonthAction(PARAMS)

    if (!RESULT.success) {
      setAlertDescription(RESULT.error)
      setAlertOpen(true)
      return
    }

    if (!RESULT.data.available) {
      setAlertDescription(MISSING_READING_MESSAGE)
      setAlertOpen(true)
      return
    }

    window.open(fileUrl, "_blank", "noopener")
  }, [])

  return useMemo(
    () => ({
      openReport: OpenReport,
      alertOpen: ALERT_OPEN,
      alertDescription: ALERT_DESCRIPTION,
      setAlertOpen,
    }),
    [OpenReport, ALERT_OPEN, ALERT_DESCRIPTION]
  )
}

/**
 * Reads the portfolio id and month query parameters of a
 * statement file url.
 */
function ParseFileUrl(
  fileUrl: string
): { portfolioId: string; month: string } | null {
  try {
    const PARSED_URL = new URL(fileUrl)

    const PORTFOLIO_ID =
      PARSED_URL.searchParams.get("portfolioId")
    const MONTH = PARSED_URL.searchParams.get("month")

    if (PORTFOLIO_ID === null || MONTH === null) return null

    return { portfolioId: PORTFOLIO_ID, month: MONTH }
  } catch {
    return null
  }
}

export { useStatementOpenReport }
