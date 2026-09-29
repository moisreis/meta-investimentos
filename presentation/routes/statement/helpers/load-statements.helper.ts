import { RequireSessionUser } from "@/lib/auth/require-session"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import { StatementContainer } from "@/presentation/composition/statement.container"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"
import { ToStatementRows } from "@/presentation/mappers/statement-row.mapper"
import { ToPortfolioRows } from "@/presentation/mappers/portfolio-row.mapper"
import type { StatementRow } from "@/presentation/types/statement-row.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"

export interface LoadStatementsOutput {
  userId: string
  portfolios: PortfolioRow[]
  statements: StatementRow[]
}

/**
 * @summary
 * Resolves the session user, their portfolios and the
 * statements of those portfolios.
 *
 * @remarks
 * Derives the acting user from the session, lists the
 * portfolios through the portfolio use case and lists every
 * statement of those portfolios in a single batched query.
 * Returns null when there is no active session.
 *
 * @explanation
 * Use this helper from the statement page loader so session
 * resolution, portfolio listing and statement listing stay
 * in a single composition point.
 *
 * @returns The user id, portfolios and statements, or null.
 *
 * @example
 * const BUNDLE = await LoadStatements();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadStatements(): Promise<LoadStatementsOutput | null> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const { list: LIST_PORTFOLIOS } = PortfolioContainer()
  const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
    userId: USER.id,
  })

  const { listByPortfolios: LIST_STATEMENTS } =
    StatementContainer()
  const STATEMENTS = await LIST_STATEMENTS.execute({
    portfolioIds: PORTFOLIOS.map((portfolio) => portfolio.id),
  })

  return {
    userId: USER.id,
    portfolios: ToPortfolioRows(PORTFOLIOS),
    statements: ToStatementRows(STATEMENTS),
  }
}
