import type { Metadata } from "next"

import { BuildPortfolioPerformanceLookups } from "@/presentation/routes/portfolio-performance/helpers/build-portfolio-performance-lookups.helper"
import { EMPTY_PORTFOLIO_PERFORMANCE_LOOKUPS } from "@/presentation/routes/portfolio-performance/helpers/build-portfolio-performance-lookups.helper"
import { LoadPortfolioPerformances } from "@/presentation/routes/portfolio-performance/helpers/load-portfolio-performances.helper"
import { PortfolioPerformanceList } from "@/presentation/routes/portfolio-performance/pages/list"
import type { PortfolioPerformanceLookups } from "@/presentation/routes/portfolio-performance/types/portfolio-performance-list.types"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

export const metadata: Metadata = {
  title: "Desempenho",
}

export default async function PortfolioPerformanceRoutePage() {
  let PERFORMANCES: PortfolioPerformanceResponseDTO[] | null =
    null
  let PORTFOLIOS: PortfolioResponseDTO[] = []
  let LOOKUPS: PortfolioPerformanceLookups =
    EMPTY_PORTFOLIO_PERFORMANCE_LOOKUPS

  const LOADED = await LoadPortfolioPerformances()

  if (LOADED) {
    PERFORMANCES = LOADED.performances
    PORTFOLIOS = LOADED.portfolios
    LOOKUPS = BuildPortfolioPerformanceLookups(LOADED)
  }

  return (
    <PortfolioPerformanceList
      data={PERFORMANCES}
      portfolios={PORTFOLIOS}
      lookups={LOOKUPS}
    />
  )
}
