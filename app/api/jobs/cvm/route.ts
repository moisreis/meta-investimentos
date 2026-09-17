import { NextResponse } from "next/server"
import { inngest } from "@/clients/inngest.client"
import { FUND_VALUATION_REQUESTED_EVENT } from "@/inngest/functions/fund-valuation-import.function"
import type { CvmImportWindow } from "@/services/quota/use-cases/import-fund-valuations.use-case"

// Accepted window options for the import request body.
const VALID_WINDOWS: CvmImportWindow[] = [
  "today",
  "week",
  "month",
  "year-to-date",
  "last-2-months",
  "last-6-months",
]

/**
 * @summary
 * Requests a fund valuation import from the **CVM** source.
 *
 * @remarks
 * Reads the `window` option from the request body and sends
 * an **Inngest** event. Accepts requests without a body and
 * defaults the window to `month`.
 *
 * @explanation
 * Use this route from a future button or a **cURL** call to
 * start an import. The heavy work runs inside **Inngest**.
 *
 * @param request - The incoming request.
 * @returns A 202 response with the acceptance status.
 *
 * @example
 * curl -X POST /api/jobs/cvm
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
export async function POST(request: Request): Promise<NextResponse> {
  const BODY = await readBody(request)

  if (BODY !== null && !VALID_WINDOWS.includes(BODY.window)) {
    return NextResponse.json(
      { error: `Invalid window "${String(BODY.window)}".` },
      { status: 400 }
    )
  }

  const WINDOW: CvmImportWindow = BODY?.window ?? "month"

  await inngest.send({
    name: FUND_VALUATION_REQUESTED_EVENT,
    data: { window: WINDOW },
  })

  return NextResponse.json({ accepted: true, window: WINDOW }, { status: 202 })
}

// Reads and validates the JSON request body.
async function readBody(
  request: Request
): Promise<{ window: CvmImportWindow } | null> {
  try {
    const PARSED = await request.json()

    if (PARSED === null || typeof PARSED !== "object") {
      return null
    }

    return PARSED as { window: CvmImportWindow }
  } catch {
    return null
  }
}
