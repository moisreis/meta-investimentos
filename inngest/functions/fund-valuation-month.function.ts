import { inngest } from "@/clients/inngest.client"
import { FUND_VALUATION_MONTH_EVENT } from "./fund-valuation-import.function"
import { runFundValuationMonth } from "@/jobs/fund-valuation-import.job"
import { FUND_SLICE_SIZE } from "@/services/quota/use-cases/import-fund-valuations.use-case"

/**
 * @summary
 * Imports one month and fund slice of quota data.
 *
 * @remarks
 * Runs the composition root for a single slice and sends a
 * continuation event when more slices remain.
 *
 * @explanation
 * Use this function as the worker of the fan-out flow.
 * A bounded slice keeps the run small and the upserts
 * chunked.
 *
 * @param ctx - The **Inngest** function context.
 * @returns The slice statistics.
 *
 * @example
 * const STATS = await fundValuationMonth.run();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
export const fundValuationMonth = inngest.createFunction(
  {
    id: "import-fund-valuations-month",
    triggers: {
      event: FUND_VALUATION_MONTH_EVENT,
    },
    concurrency: {
      limit: 2,
    },
  },
  async ({ event, step }) => {
    const DATA = event.data

    const RESULT = await step.run("import-month-slice", () =>
      runFundValuationMonth({
        year: DATA.year,
        month: DATA.month,
        start: new Date(DATA.start),
        end: new Date(DATA.end),
        offset: DATA.offset ?? 0,
        limit: FUND_SLICE_SIZE,
      })
    )

    if (RESULT.hasMore) {
      await step.sendEvent("continue-month", [
        {
          name: FUND_VALUATION_MONTH_EVENT,
          data: {
            ...DATA,
            offset: RESULT.nextOffset,
          },
        },
      ])
    }

    return RESULT
  }
)
