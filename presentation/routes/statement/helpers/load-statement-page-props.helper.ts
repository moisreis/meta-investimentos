import { LoadSessionStatements } from "../helpers/load-session-statements.helper"
import { BuildStatementRowSummaries } from "../helpers/build-statement-row-summaries.helper"
import type { StatementListProps } from "../pages/list"
import type { StatementRow } from "@/presentation/types/statement-row.types"
import type { StatementRowSummary } from "../types/statement-list.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type { UserRow } from "@/presentation/types/user-row.types"
import { UserContainer } from "@/presentation/composition/user.container"
import { StatementContainer } from "@/presentation/composition/statement.container"

/**
 * @summary
 * Resolves the props for the statement list page.
 *
 * @remarks
 * Loads the session statements and their summaries.
 *
 * @returns The statement list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadStatementPageProps();
 *
 * @author MoisAcs Reis
 *
 * @date 2026-09-27
 */
export async function LoadStatementPageProps(): Promise<StatementListProps> {
  let data: StatementRow[] | null = null
  let portfolios: PortfolioRow[] = []
  let summaries: Record<string, StatementRowSummary> | null = null

  const BUNDLE = await LoadSessionStatements()

  if (BUNDLE) {
    const { userId: USER_ID, portfolios: PORTFOLIOS_LOADED, statements: STATEMENTS_LOADED } = BUNDLE

    const { get: GET_USER } = UserContainer()
    const USER = await GET_USER.execute({ userId: USER_ID })

    const SUMMARIES = BuildStatementRowSummaries(STATEMENTS_LOADED, PORTFOLIOS_LOADED, USER_ID, USER)

    return { data: STATEMENTS_LOADED, portfolios: PORTFOLIOS_LOADED, summaries: SUMMARIES }
  }

  return { data: null, portfolios: [], summaries: null }
}