import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"
import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"

/**
 * @summary
 * Data resolved by the position detail loader.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export interface PositionOverviewData {
  // Id of the resolved position, empty while it cannot
  // be resolved.
  positionId: string
  // Id of the fund the position holds, empty while the
  // position cannot be resolved.
  fundId: string
  // Daily snapshots of the position, ascending by date.
  performances: PositionPerformanceResponseDTO[]
  // UTC day keys holding at least one snapshot.
  availableDates: string[]
  // Applications and withdrawals of the position, newest
  // first, waiting for the selected window to filter them.
  activity: PortfolioActivityRow[]
}

// Neutral payload rendered while the loader returns null.
export const EMPTY_POSITION_OVERVIEW: PositionOverviewData = {
  positionId: "",
  fundId: "",
  performances: [],
  availableDates: [],
  activity: [],
}
