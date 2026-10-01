import { runStatementPdfGenerate } from "@/jobs/statement-generate.job"
import { RequireSessionUser } from "@/lib/auth/require-session"
import { GENERATE_STATEMENT_SCHEMA } from "@/presentation/routes/statement/validations/statement-actions.validation"
import type { NextRequest } from "next/server"

// The message returned when the request is not authorized.
const UNAUTHORIZED_MESSAGE = "Não autorizado."

/**
 * @summary
 * Serves the monthly statement PDF of a portfolio.
 *
 * @remarks
 * Resolves the session first, then validates the
 * `portfolioId` and `month` query parameters with the
 * same **Zod** schema the generate form uses. The job
 * owns the check that the portfolio belongs to the
 * acting user, so the handler never trusts the id on
 * its own. The response is a `application/pdf` file
 * opened inline.
 *
 * @explanation
 * Use this endpoint as the demo entry of the statement
 * PDF pipeline: it renders the report on demand from
 * the persisted data. The `fileUrl` stored by the
 * generate flow points at this endpoint, so opening a
 * report from the statement registry serves the file
 * with no external storage dependency.
 *
 * @param request - The incoming server request.
 * @returns The PDF response, or an error response.
 *
 * @example
 * GET /api/statement-pdf?portfolioId=p1&month=2026-09
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export async function GET(
  request: NextRequest
): Promise<Response> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return new Response(UNAUTHORIZED_MESSAGE, {
      status: 401,
    })
  }

  const PARSED = GENERATE_STATEMENT_SCHEMA.safeParse({
    portfolioId: request.nextUrl.searchParams.get("portfolioId"),
    month: request.nextUrl.searchParams.get("month"),
  })

  if (!PARSED.success) {
    return new Response("Parâmetros inválidos.", {
      status: 400,
    })
  }

  try {
    const BYTES = await runStatementPdfGenerate({
      userId: USER.id,
      portfolioId: PARSED.data.portfolioId,
      month: PARSED.data.month,
    })

    if (BYTES === null) {
      return new Response("Carteira não encontrada.", {
        status: 404,
      })
    }

    const FILE_NAME = `extrato-${PARSED.data.month}.pdf`

    return new Response(BYTES, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${FILE_NAME}"`,
      },
    })
  } catch (cause) {
    console.error(cause)
    return new Response("Erro ao gerar o PDF.", {
      status: 500,
    })
  }
}
