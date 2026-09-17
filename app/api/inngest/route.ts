import { serve } from "inngest/next"
import { inngest } from "@/clients/inngest.client"
import { fundValuationImport } from "@/inngest/functions/fund-valuation-import.function"
import { fundValuationMonth } from "@/inngest/functions/fund-valuation-month.function"

// Sets the serverless function duration ceiling on **Vercel**.
export const maxDuration = 60

// Serves the **Inngest** dev server and production API.
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [fundValuationImport, fundValuationMonth],
})
