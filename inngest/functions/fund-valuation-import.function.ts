import { inngest } from "@/clients/inngest.client"
import { buildImportPlan } from "@/jobs/fund-valuation-import.job"
import type { CvmImportWindow } from "@/services/quota/use-cases/import-fund-valuations.use-case"

// The event name used to request a fund valuation import.
export const FUND_VALUATION_REQUESTED_EVENT =
  "imports/fund-valuations.requested"

// The event name used to fan out a month worker.
export const FUND_VALUATION_MONTH_EVENT = "imports/fund-valuations.month"

// The daily schedule for the monthly import.
const IMPORT_CRON_SCHEDULE = "0 6 * * *"

// The data carried by the request event.
interface CvmImportRequestData {
  window?: CvmImportWindow
}

/**
 * @summary
 * Expands an import request into per-month worker events.
 *
 * @remarks
 * Runs on a daily cron and on the requested event. Resolves
 * the window, enumerates the covered months, and sends one
 * event per month.
 *
 * @explanation
 * Use this function as the entry point of the import flow.
 * It only touches metadata and follows the **Inngest**
 * fan-out pattern to keep every run small.
 *
 * @param ctx - The **Inngest** function context.
 * @returns The import plan summary.
 *
 * @example
 * const SUM = await fundValuationImport.run();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
export const fundValuationImport = inngest.createFunction(
  {
    id: "import-fund-valuations",
    triggers: [
      { event: FUND_VALUATION_REQUESTED_EVENT },
      { cron: IMPORT_CRON_SCHEDULE },
    ],
    concurrency: {
      limit: 2,
    },
  },
  async ({ event, step }) => {
    const DATA = event.data as unknown as CvmImportRequestData
    const WINDOW = DATA.window ?? "month"
    const NOW = new Date()
    const PLAN = buildImportPlan(WINDOW, NOW)

    await step.sendEvent(
      "fan-out-months",
      PLAN.months.map((m) => ({
        name: FUND_VALUATION_MONTH_EVENT,
        data: {
          year: m.year,
          month: m.month,
          start: m.start.toISOString(),
          end: m.end.toISOString(),
        },
      }))
    )

    return {
      window: WINDOW,
      months: PLAN.months.length,
    }
  }
)
