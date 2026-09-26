import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

import type { ApplicationAddOptions } from "@/presentation/routes/application/types/application-add.types"
import type { WithdrawalAddOptions } from "@/presentation/routes/withdrawal/types/withdrawal-add.types"

// Data resolved by the portfolio detail loader.
export interface PortfolioOverviewData {
  // Id of the resolved portfolio, empty while it cannot
  // be resolved.
  portfolioId: string
  // Daily snapshots of the portfolio, ascending by date.
  performances: PortfolioPerformanceResponseDTO[]
  // UTC day keys holding at least one snapshot.
  availableDates: string[]
  // Funds offered by the add application flow.
  applicationOptions: ApplicationAddOptions
  // Positions offered by the add withdrawal flow.
  withdrawalOptions: WithdrawalAddOptions
}

// Neutral payload rendered while the loader returns null.
export const EMPTY_PORTFOLIO_OVERVIEW: PortfolioOverviewData = {
  portfolioId: "",
  performances: [],
  availableDates: [],
  applicationOptions: { funds: [] },
  withdrawalOptions: { positions: [] },
}
