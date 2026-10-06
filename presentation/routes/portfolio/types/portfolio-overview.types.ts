import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

import type { ApplicationAddOptions } from "@/presentation/routes/application/types/application-add.types"
import type { WithdrawalAddOptions } from "@/presentation/routes/withdrawal/types/withdrawal-add.types"
import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"
import type { PortfolioBankAccountView } from "@/presentation/types/portfolio-checking.types"
import type { PortfolioHolding } from "@/presentation/types/portfolio-holding.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type { NormPortfolioAllocation } from "@/presentation/types/norms-portfolio.types"
import type { UserIdentity } from "@/presentation/types/user-identity.types"

/**
 * @summary
 * Data resolved by the portfolio detail loader.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface PortfolioOverviewData {
  // Id of the resolved portfolio, empty while it cannot
  // be resolved.
  portfolioId: string
  // Daily snapshots of the portfolio, ascending by date.
  performances: PortfolioPerformanceResponseDTO[]
  // UTC day keys holding at least one snapshot.
  availableDates: string[]
  // Holdings of the portfolio, resolved down to the bank
  // that custodies each fund. Drives the distribution
  // charts and labels the activity rows.
  holdings: PortfolioHolding[]
  // Applications and withdrawals of the portfolio, newest
  // first, waiting for the selected window to filter them.
  activity: PortfolioActivityRow[]
  // Bank accounts of the portfolio, resolved down to the
  // bank that hosts each one. Labels the checking
  // distribution.
  bankAccounts: PortfolioBankAccountView[]
  // Daily balance snapshots of the portfolio bank accounts,
  // for the checking evolution and distribution charts.
  balances: CheckingAccountResponseDTO[]
  // Funds offered by the add application flow.
  applicationOptions: ApplicationAddOptions
  // Portfolios and positions offered by the add
  // withdrawal flow.
  withdrawalOptions: WithdrawalAddOptions
  // Portfolios of the session user, offered by the
  // calculate performance and the generate report dialogs.
  portfolios: PortfolioRow[]
  // The user who owns the portfolio, naming it beside the
  // headline figure of the summary. Null while the profile
  // cannot be resolved, so the summary falls back to the
  // figure alone.
  owner: UserIdentity | null
  // Allocation bounds of every norm bound to this portfolio.
  // Empty while the registry cannot be resolved, so the chart
  // is dropped rather than drawn as an empty axis.
  normAllocations: NormPortfolioAllocation[]
}

// Neutral payload rendered while the loader returns null.
export const EMPTY_PORTFOLIO_OVERVIEW: PortfolioOverviewData = {
  portfolioId: "",
  performances: [],
  availableDates: [],
  holdings: [],
  activity: [],
  bankAccounts: [],
  balances: [],
  applicationOptions: { funds: [], portfolios: [] },
  withdrawalOptions: { positions: [], portfolios: [] },
  portfolios: [],
  owner: null,
  normAllocations: [],
}
