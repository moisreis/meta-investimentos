import type { Metadata } from "next"

import { db } from "@/clients/database.client"
import { BankAccountRepository } from "@/infrastructure/bank-account/repositories/bank-account.repository"
import { PortfolioPerformanceRepository } from "@/infrastructure/portfolio-performance/repositories/portfolio-performance.repository"
import { PositionRepository } from "@/infrastructure/position/repositories/position.repository"
import { UserRepository } from "@/infrastructure/user/repositories/user.repository"
import { BuildPortfolioRowSummaries } from "@/presentation/routes/portfolio/helpers/build-portfolio-row-summaries.helper"
import { LoadSessionPortfolios } from "@/presentation/routes/portfolio/helpers/load-session-portfolios.helper"
import { PortfolioList } from "@/presentation/routes/portfolio/pages/list"
import type { PortfolioRowSummary } from "@/presentation/routes/portfolio/types/portfolio-list.types"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import { ListPortfolioPerformanceDatesUseCase } from "@/services/portfolio-performance/use-cases/list-portfolio-performance-dates.use-case"
import { ListPortfolioRowSummariesUseCase } from "@/services/portfolio/use-cases/list-portfolio-row-summaries.use-case"
import { GetUserUseCase } from "@/services/user/use-cases/get-user.use-case"

export const metadata: Metadata = {
  title: "Carteiras",
}

export default async function PortfoliosRoutePage() {
  let PORTFOLIOS: PortfolioResponseDTO[] | null = null
  let PERFORMANCE_DATES: string[] = []
  let SUMMARIES: Record<string, PortfolioRowSummary> = {}

  const SESSION_BUNDLE = await LoadSessionPortfolios()

  if (SESSION_BUNDLE) {
    const { userId: USER_ID, portfolios: PORTFOLIOS_LOADED } =
      SESSION_BUNDLE
    PORTFOLIOS = PORTFOLIOS_LOADED

    const PORTFOLIO_IDS = PORTFOLIOS.map(
      (portfolio) => portfolio.id
    )

    const PERFORMANCE_REPOSITORY =
      new PortfolioPerformanceRepository(db)
    const DATES_USE_CASE =
      new ListPortfolioPerformanceDatesUseCase(
        PERFORMANCE_REPOSITORY
      )

    PERFORMANCE_DATES = await DATES_USE_CASE.execute({
      portfolioIds: PORTFOLIO_IDS,
    })

    const USER_REPOSITORY = new UserRepository(db)
    const GET_USER_USE_CASE = new GetUserUseCase(USER_REPOSITORY)

    const SUMMARIES_USE_CASE =
      new ListPortfolioRowSummariesUseCase(
        new PositionRepository(db),
        new BankAccountRepository(db)
      )

    const [USER, ROW_SUMMARIES] = await Promise.all([
      GET_USER_USE_CASE.execute({ userId: USER_ID }),
      SUMMARIES_USE_CASE.execute({
        portfolioIds: PORTFOLIO_IDS,
      }),
    ])

    SUMMARIES = BuildPortfolioRowSummaries(
      PORTFOLIOS,
      ROW_SUMMARIES,
      USER_ID,
      USER
    )
  }

  return (
    <>
      <PortfolioList
        data={PORTFOLIOS}
        availableDates={PERFORMANCE_DATES}
        summaries={SUMMARIES}
      />
    </>
  )
}
