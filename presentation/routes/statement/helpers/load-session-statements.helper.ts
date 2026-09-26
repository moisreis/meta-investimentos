import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

import { db } from "@/clients/database.client"
import { StatementRepository } from "@/infrastructure/statement/repositories/statement.repository"
import { ListStatementsByPortfoliosUseCase } from "@/services/statement/use-cases/list-statements-by-portfolios.use-case"

import { LoadSessionPortfolios } from "@/presentation/routes/portfolio/helpers/load-session-portfolios.helper"

export interface LoadSessionStatementsOutput {
  userId: string
  portfolios: PortfolioResponseDTO[]
  statements: StatementResponseDTO[]
}

/**
 * @summary
 * Resolves the session user, their portfolios and the
 * statements of those portfolios.
 *
 * @remarks
 * Reuses the portfolio session loader and lists every
 * statement of the owned portfolios in a single batched
 * query. Returns null when there is no active session.
 *
 * @explanation
 * Use this helper from the statement page loader so session
 * resolution, portfolio listing and statement listing stay
 * in a single composition point.
 *
 * @returns The user id, portfolios and statements, or null.
 *
 * @example
 * const BUNDLE = await LoadSessionStatements();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadSessionStatements(): Promise<LoadSessionStatementsOutput | null> {
  const SESSION_BUNDLE = await LoadSessionPortfolios()

  if (!SESSION_BUNDLE) return null

  const { userId: USER_ID, portfolios: PORTFOLIOS } =
    SESSION_BUNDLE

  const STATEMENT_REPOSITORY = new StatementRepository(db)
  const LIST_USE_CASE = new ListStatementsByPortfoliosUseCase(
    STATEMENT_REPOSITORY
  )
  const STATEMENTS = await LIST_USE_CASE.execute({
    portfolioIds: PORTFOLIOS.map((portfolio) => portfolio.id),
  })

  return {
    userId: USER_ID,
    portfolios: PORTFOLIOS,
    statements: STATEMENTS,
  }
}
