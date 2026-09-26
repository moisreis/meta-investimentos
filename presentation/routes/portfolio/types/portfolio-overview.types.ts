import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

// Data resolved by the portfolio detail loader.
export interface PortfolioOverviewData {
  // Daily snapshots of the portfolio, ascending by date.
  performances: PortfolioPerformanceResponseDTO[]
  // UTC day keys holding at least one snapshot.
  availableDates: string[]
}

// Neutral payload rendered while the loader returns null.
export const EMPTY_PORTFOLIO_OVERVIEW: PortfolioOverviewData = {
  performances: [],
  availableDates: [],
}
