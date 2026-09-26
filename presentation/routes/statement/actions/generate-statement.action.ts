"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import { StatementContainer } from "@/presentation/composition/statement.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

import { BuildStatementFileUrl } from "../helpers/build-statement-file-url.helper"
import { BuildStatementPeriod } from "../helpers/build-statement-period.helper"
import { GENERATE_STATEMENT_SCHEMA } from "../validations/statement-actions.validation"

/**
 * @summary
 * Generates a statement for the signed-in user.
 *
 * @remarks
 * Resolves the session first, then validates the portfolio
 * id and the month key with **Zod**. The acting user comes
 * from the session, never from the payload, and the same
 * session scopes the portfolio ownership check before the
 * UTC period range and the placeholder file url are built.
 * Only then does the generate use case run. Returns a
 * human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the generate report form.
 *
 * @param input - The untrusted portfolio and month payload.
 *
 * @returns The generated statement, or a failure result.
 *
 * @example
 * const RESULT = await generateStatementAction({
 *   portfolioId: "portfolio-1",
 *   month: "2026-01",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function generateStatementAction(
  input: unknown
): Promise<ActionResult<StatementResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = GENERATE_STATEMENT_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { portfolioId: PORTFOLIO_ID, month: MONTH } =
      PARSED.data

    const { list: LIST_PORTFOLIOS } = PortfolioContainer()
    const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
      userId: USER.id,
    })

    const OWNS_PORTFOLIO = PORTFOLIOS.some(
      (portfolio) => portfolio.id === PORTFOLIO_ID
    )

    if (!OWNS_PORTFOLIO) {
      return ActionFailure("Selecione uma carteira válida.")
    }

    const PERIOD = BuildStatementPeriod(MONTH)
    const FILE_URL = BuildStatementFileUrl({
      portfolioId: PORTFOLIO_ID,
      month: MONTH,
    })

    const { generate: GENERATE_STATEMENT } = StatementContainer()
    const STATEMENT = await GENERATE_STATEMENT.execute({
      portfolioId: PORTFOLIO_ID,
      periodStart: PERIOD.periodStart,
      periodEnd: PERIOD.periodEnd,
      generatedByUserId: USER.id,
      fileUrl: FILE_URL,
    })

    return ActionSuccess(STATEMENT)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível gerar o relatório."
    )
  }
}
