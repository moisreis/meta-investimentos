"use server"

import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { StatementRepository } from "@/infrastructure/statement/repositories/statement.repository"
import { ListPortfoliosUseCase } from "@/services/portfolio/use-cases/list-portfolios.use-case"
import { GenerateStatementUseCase } from "@/services/statement/use-cases/generate-statement.use-case"

import { BuildStatementFileUrl } from "../helpers/build-statement-file-url.helper"
import { BuildStatementPeriod } from "../helpers/build-statement-period.helper"
import { STATEMENT_MONTH_PATTERN } from "../validations/generate-statement.validations"

export interface GenerateStatementActionInput {
  portfolioId: string
  month: string
}

/**
 * @summary
 * Generates a statement for the signed-in user.
 *
 * @remarks
 * Validates the month key and the portfolio ownership, builds
 * the UTC period range and the placeholder file url, then
 * persists the statement through the generate use case.
 *
 * @explanation
 * Use as the submit target of the generate report form.
 *
 * @param input - The portfolio id and month key.
 *
 * @returns The action outcome with an optional error.
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
  input: GenerateStatementActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    if (!STATEMENT_MONTH_PATTERN.test(input.month)) {
      return { error: "Selecione um mês de referência." }
    }

    const PORTFOLIO_REPOSITORY = new PortfolioRepository(db)
    const PORTFOLIOS_USE_CASE = new ListPortfoliosUseCase(
      PORTFOLIO_REPOSITORY
    )
    const PORTFOLIOS = await PORTFOLIOS_USE_CASE.execute({
      userId: SESSION.user.id,
    })

    const OWNS_PORTFOLIO = PORTFOLIOS.some(
      (portfolio) => portfolio.id === input.portfolioId
    )

    if (!OWNS_PORTFOLIO) {
      return { error: "Selecione uma carteira válida." }
    }

    const PERIOD = BuildStatementPeriod(input.month)
    const FILE_URL = BuildStatementFileUrl({
      portfolioId: input.portfolioId,
      month: input.month,
    })

    const REPOSITORY = new StatementRepository(db)
    const USE_CASE = new GenerateStatementUseCase(REPOSITORY)

    await USE_CASE.execute({
      portfolioId: input.portfolioId,
      periodStart: PERIOD.periodStart,
      periodEnd: PERIOD.periodEnd,
      generatedByUserId: SESSION.user.id,
      fileUrl: FILE_URL,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível gerar o relatório.",
    }
  }
}
