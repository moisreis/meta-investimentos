import type { Metadata } from "next"

import { LoadPositionPerformancePageProps } from "@/presentation/routes/position-performance/helpers/load-position-performance-page-props.helper"
import { PositionPerformanceList } from "@/presentation/routes/position-performance/pages/list"

export const metadata: Metadata = {
  title: "Desempenho",
}

export default async function PositionPerformanceRoutePage() {
  const PROPS = await LoadPositionPerformancePageProps()

  return <PositionPerformanceList {...PROPS} />
}