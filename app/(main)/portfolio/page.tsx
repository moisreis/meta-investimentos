import type { Metadata } from "next"

import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import { UserContainer } from "@/presentation/composition/user.container"
import { BuildPortfolioRowSummaries } from "@/presentation/routes/portfolio/helpers/build-portfolio-row-summaries.helper"
import { LoadSessionPortfolios } from "@/presentation/routes/portfolio/helpers/load-session-portfolios.helper"
import { PortfolioList } from "@/presentation/routes/portfolio/pages/list"
import type { PortfolioRowSummary } from "@/presentation/routes/portfolio/types/portfolio-list.types"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

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

    const {
      listPerformanceDates: LIST_PERFORMANCE_DATES,
      listRowSummaries: LIST_ROW_SUMMARIES,
    } = PortfolioContainer()
    const { get: GET_USER } = UserContainer()

    const [DATES, USER, ROW_SUMMARIES] = await Promise.all([
      LIST_PERFORMANCE_DATES.execute({
        portfolioIds: PORTFOLIO_IDS,
      }),
      GET_USER.execute({ userId: USER_ID }),
      LIST_ROW_SUMMARIES.execute({
        portfolioIds: PORTFOLIO_IDS,
      }),
    ])

    PERFORMANCE_DATES = DATES

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
