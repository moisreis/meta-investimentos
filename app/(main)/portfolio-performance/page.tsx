import type { Metadata } from "next"

import { LoadPortfolioPerformancePageProps } from "@/presentation/routes/portfolio-performance/helpers/load-portfolio-performance-page-props.helper"
import { PortfolioPerformanceList } from "@/presentation/routes/portfolio-performance/pages/list"

export const metadata: Metadata = {
  title: "Desempenho",
}

export default async function PortfolioPerformanceRoutePage() {
  const PROPS = await LoadPortfolioPerformancePageProps()

  return <PortfolioPerformanceList {...PROPS} />
}