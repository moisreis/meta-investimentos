import type { Metadata } from "next"

import { UserContainer } from "@/presentation/composition/user.container"
import { BuildStatementRowSummaries } from "@/presentation/routes/statement/helpers/build-statement-row-summaries.helper"
import { LoadSessionStatements } from "@/presentation/routes/statement/helpers/load-session-statements.helper"
import { StatementList } from "@/presentation/routes/statement/pages/list"
import type { StatementRowSummary } from "@/presentation/routes/statement/types/statement-list.types"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

export const metadata: Metadata = {
  title: "Relatórios",
}

export default async function StatementsRoutePage() {
  let STATEMENTS: StatementResponseDTO[] | null = null
  let PORTFOLIOS: PortfolioResponseDTO[] = []
  let SUMMARIES: Record<string, StatementRowSummary> = {}

  const BUNDLE = await LoadSessionStatements()

  if (BUNDLE) {
    const {
      userId: USER_ID,
      portfolios: PORTFOLIOS_LOADED,
      statements: STATEMENTS_LOADED,
    } = BUNDLE

    STATEMENTS = STATEMENTS_LOADED
    PORTFOLIOS = PORTFOLIOS_LOADED

    const { get: GET_USER } = UserContainer()
    const USER = await GET_USER.execute({
      userId: USER_ID,
    })

    SUMMARIES = BuildStatementRowSummaries(
      STATEMENTS_LOADED,
      PORTFOLIOS_LOADED,
      USER_ID,
      USER
    )
  }

  return (
    <>
      <StatementList
        data={STATEMENTS}
        portfolios={PORTFOLIOS}
        summaries={SUMMARIES}
      />
    </>
  )
}
