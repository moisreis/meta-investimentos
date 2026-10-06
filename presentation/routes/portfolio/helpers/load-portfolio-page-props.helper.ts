import { LoadSessionPortfolios } from "../helpers/load-session-portfolios.helper"
import { BuildPortfolioRowSummaries } from "../helpers/build-portfolio-row-summaries.helper"
import { LoadPortfolioNormRegistry } from "../helpers/load-portfolio-norm-registry.helper"
import type { PortfolioListProps } from "../pages/list"

import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import { UserContainer } from "@/presentation/composition/user.container"

/**
 * @summary
 * Resolves the props for the portfolio list page.
 *
 * @remarks
 * Loads the session portfolios and, when there is a
 * session, the performance dates, the row summaries and the
 * owner the KPIs read, all in one pass. The norm registry
 * rides along because the add and edit dialogs need every
 * norm to offer and the bounds already stored per row, so
 * opening an edit dialog cannot drop the relations the user
 * configured earlier. An absent session leaves the screen on
 * its empty state instead of failing, so the chrome still
 * renders while the session is resolving.
 *
 * @returns The portfolio list props.
 *
 * @example
 * const PROPS = await LoadPortfolioPageProps();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export async function LoadPortfolioPageProps(): Promise<PortfolioListProps> {
  const SESSION_BUNDLE = await LoadSessionPortfolios()

  if (!SESSION_BUNDLE) {
    return {
      data: null,
      availableDates: [],
      summaries: null,
      normRegistry: null,
    }
  }

  const { userId: USER_ID, portfolios: PORTFOLIOS } =
    SESSION_BUNDLE
  const PORTFOLIO_IDS = PORTFOLIOS.map(
    (portfolio) => portfolio.id
  )

  const {
    listPerformanceDates: LIST_PERFORMANCE_DATES,
    listRowSummaries: LIST_ROW_SUMMARIES,
  } = PortfolioContainer()
  const { get: GET_USER } = UserContainer()

  const [DATES, USER, ROW_SUMMARIES, NORM_REGISTRY] =
    await Promise.all([
      LIST_PERFORMANCE_DATES.execute({
        portfolioIds: PORTFOLIO_IDS,
      }),
      GET_USER.execute({ userId: USER_ID }),
      LIST_ROW_SUMMARIES.execute({
        portfolioIds: PORTFOLIO_IDS,
      }),
      LoadPortfolioNormRegistry(PORTFOLIO_IDS),
    ])

  return {
    data: PORTFOLIOS,
    availableDates: DATES,
    summaries: BuildPortfolioRowSummaries(
      PORTFOLIOS,
      ROW_SUMMARIES,
      USER_ID,
      USER
    ),
    normRegistry: NORM_REGISTRY,
  }
}
