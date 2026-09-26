import { RequireSessionUser } from "@/lib/auth/require-session"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"

import { LoadPortfolioApplicationOptions } from "./load-portfolio-application-options.helper"
import { LoadPortfolioWithdrawalOptions } from "./load-portfolio-withdrawal-options.helper"

import { EMPTY_APPLICATION_ADD_OPTIONS } from "@/presentation/routes/application/types/application-add.types"
import { EMPTY_WITHDRAWAL_ADD_OPTIONS } from "@/presentation/routes/withdrawal/types/withdrawal-add.types"

import type { ApplicationAddOptions } from "@/presentation/routes/application/types/application-add.types"
import type { WithdrawalAddOptions } from "@/presentation/routes/withdrawal/types/withdrawal-add.types"
import type { PortfolioOverviewData } from "../types/portfolio-overview.types"

/**
 * @summary
 * Resolves the portfolio detail screen data.
 *
 * @remarks
 * Resolves the session through the shared auth helper,
 * loads the portfolio through the container and rejects
 * when it belongs to another user. The daily snapshots of
 * the portfolio are listed through the container too and
 * the distinct UTC day keys are derived from their dates.
 * The add application and add withdrawal option registries
 * are loaded in parallel. Returns null when there is no
 * session, the portfolio is missing, or the portfolio is
 * not owned by the session user.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution, the ownership check and the snapshot
 * listing stay in a single composition point.
 *
 * @param portfolioId - The portfolio id to resolve.
 *
 * @returns The overview data, or `null`.
 *
 * @example
 * const DATA = await LoadPortfolioOverview("portfolio-1");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadPortfolioOverview(
  portfolioId: string
): Promise<PortfolioOverviewData | null> {
  try {
    const USER = await RequireSessionUser()

    if (!USER) return null

    const {
      get: GET_PORTFOLIO,
      listPerformance: LIST_PERFORMANCE,
    } = PortfolioContainer()

    const PORTFOLIO = await GET_PORTFOLIO.execute({
      portfolioId,
    })

    if (PORTFOLIO.userId !== USER.id) {
      console.warn(
        `[LoadPortfolioOverview] portfolio ${portfolioId} does not belong to the session user.`
      )
      return null
    }

    const PERFORMANCES = await LIST_PERFORMANCE.execute({
      portfolioId,
    })

    const AVAILABLE_DATES = [
      ...new Set(
        PERFORMANCES.map((performance) =>
          performance.date.slice(0, 10)
        )
      ),
    ].sort()

    const [APPLICATION_OPTIONS, WITHDRAWAL_OPTIONS] =
      await LoadPortfolioAddOptions(portfolioId)

    return {
      portfolioId,
      performances: PERFORMANCES,
      availableDates: AVAILABLE_DATES,
      applicationOptions: APPLICATION_OPTIONS,
      withdrawalOptions: WITHDRAWAL_OPTIONS,
    }
  } catch (cause) {
    console.error(
      "[LoadPortfolioOverview] failed to resolve the portfolio overview.",
      cause
    )
    return null
  }
}

/**
 * @summary
 * Resolves the option registries of the add flows of the
 * portfolio detail screen.
 *
 * @remarks
 * Loads the funds of the add application flow and the
 * positions of the add withdrawal flow in parallel. A
 * failure here degrades to the empty option registries
 * instead of failing the whole screen, so the KPIs stay
 * visible and the add dialogs explain the missing options
 * through their own empty copy.
 *
 * @explanation
 * Use this helper from the portfolio detail loader to keep
 * a registry outage isolated from the overview data.
 *
 * @param portfolioId - The portfolio whose positions are
 * offered.
 *
 * @returns The application and withdrawal add options.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
async function LoadPortfolioAddOptions(
  portfolioId: string
): Promise<[ApplicationAddOptions, WithdrawalAddOptions]> {
  try {
    const [APPLICATION_OPTIONS, WITHDRAWAL_OPTIONS] =
      await Promise.all([
        LoadPortfolioApplicationOptions(),
        LoadPortfolioWithdrawalOptions(portfolioId),
      ])

    return [APPLICATION_OPTIONS, WITHDRAWAL_OPTIONS]
  } catch (cause) {
    console.error(
      "[LoadPortfolioAddOptions] failed to resolve the add flow options.",
      cause
    )
    return [
      EMPTY_APPLICATION_ADD_OPTIONS,
      EMPTY_WITHDRAWAL_ADD_OPTIONS,
    ]
  }
}
