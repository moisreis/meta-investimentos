import type { Metadata } from "next"

import { BuildPositionPerformanceLookups } from "@/presentation/routes/position-performance/helpers/build-position-performance-lookups.helper"
import { EMPTY_POSITION_PERFORMANCE_LOOKUPS } from "@/presentation/routes/position-performance/helpers/build-position-performance-lookups.helper"
import { LoadPositionPerformances } from "@/presentation/routes/position-performance/helpers/load-position-performances.helper"
import { PositionPerformanceList } from "@/presentation/routes/position-performance/pages/list"
import type { PositionPerformanceLookups } from "@/presentation/routes/position-performance/types/position-performance-list.types"
import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"

export const metadata: Metadata = {
  title: "Desempenho",
}

export default async function PositionPerformanceRoutePage() {
  let PERFORMANCES: PositionPerformanceResponseDTO[] | null =
    null
  let LOOKUPS: PositionPerformanceLookups =
    EMPTY_POSITION_PERFORMANCE_LOOKUPS

  const LOADED = await LoadPositionPerformances()

  if (LOADED) {
    PERFORMANCES = LOADED.performances
    LOOKUPS = BuildPositionPerformanceLookups(LOADED)
  }

  return (
    <PositionPerformanceList
      data={PERFORMANCES}
      lookups={LOOKUPS}
    />
  )
}
