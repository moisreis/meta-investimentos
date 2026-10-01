import { RequireSessionUser } from "@/lib/auth/require-session"
import { LogError, LogWarn } from "@/lib/log/logger"
import { ApplicationContainer } from "@/presentation/composition/application.container"
import { BankContainer } from "@/presentation/composition/bank.container"
import { FundContainer } from "@/presentation/composition/fund.container"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import { PositionContainer } from "@/presentation/composition/position.container"
import { WithdrawalContainer } from "@/presentation/composition/withdrawal.container"

import { BuildPositionActivityRows } from "./build-position-activity-rows.helper"

import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"
import type { PositionOverviewData } from "../types/position-overview.types"

// Data resolved by the position detail loader beyond the
// daily snapshots.
export interface LoadedPositionOverviewExtras {
  // Applications and withdrawals of the position, newest
  // first, still unfiltered by the selected window.
  activity: PortfolioActivityRow[]
}

// Neutral extras rendered while the registries cannot be
// resolved.
const EMPTY_POSITION_OVERVIEW_EXTRAS: LoadedPositionOverviewExtras =
  {
    activity: [],
  }

/**
 * @summary
 * Resolves the position detail screen data.
 *
 * @remarks
 * Resolves the session through the shared auth helper,
 * loads the position through the container, walks to its
 * portfolio and rejects when that portfolio belongs to
 * another user. The daily snapshots of the position are
 * listed through the container too and the distinct UTC day
 * keys are derived from their dates. The fund, the bank and
 * the movements are all loaded in parallel. A failure of the
 * registers degrades to the empty extras, so the summary and
 * the performance charts stay visible while the activity
 * table explains the missing records through its own empty
 * copy. Returns null when there is no session, the position
 * is missing, or the position is not owned by the session
 * user.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution, the ownership check and the snapshot listing
 * stay in a single composition point.
 *
 * @param positionId - The position id to resolve.
 *
 * @returns The overview data, or `null`.
 *
 * @example
 * const DATA = await LoadPositionOverview("position-1");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export async function LoadPositionOverview(
  positionId: string
): Promise<PositionOverviewData | null> {
  try {
    const USER = await RequireSessionUser()

    if (!USER) return null

    const { get: GET_POSITION } = PositionContainer()
    const POSITION = await GET_POSITION.execute({ positionId })

    const { get: GET_PORTFOLIO } = PortfolioContainer()
    const PORTFOLIO = await GET_PORTFOLIO.execute({
      portfolioId: POSITION.portfolioId,
    })

    if (PORTFOLIO.userId !== USER.id) {
      LogWarn(
        "LoadPositionOverview",
        `position ${positionId} does not belong to the session user.`
      )
      return null
    }

    const { listPerformances: LIST_PERFORMANCES } =
      PositionContainer()

    const PERFORMANCES = await LIST_PERFORMANCES.execute({
      positionId,
    })

    const AVAILABLE_DATES = [
      ...new Set(
        PERFORMANCES.map((performance) =>
          performance.date.slice(0, 10)
        )
      ),
    ].sort()

    const EXTRAS = await LoadPositionOverviewExtras(
      POSITION.fundId,
      positionId
    )

    return {
      positionId,
      fundId: POSITION.fundId,
      performances: PERFORMANCES,
      availableDates: AVAILABLE_DATES,
      activity: EXTRAS.activity,
    }
  } catch (cause) {
    LogError(
      "LoadPositionOverview",
      "failed to resolve the position overview.",
      cause
    )
    return null
  }
}

/**
 * @summary
 * Resolves the movements of the position detail screen.
 *
 * @remarks
 * Lists the fund and the bank registries in parallel, then
 * lists the applications and the withdrawals of the position
 * in parallel too. The activity rows are built from the fund
 * name and the custodian bank name resolved above, so a fund
 * can never be labeled with a name that differs from the one
 * the registry returns. A failure here degrades to the empty
 * extras, so a registry outage does not take the summary and
 * the performance charts down with it.
 *
 * @explanation
 * Use this helper from the position detail loader. It keeps
 * the movement listing isolated, so a registry outage cannot
 * fail the whole overview.
 *
 * @param fundId - The fund the position holds.
 * @param positionId - The position whose movements are
 *   resolved.
 *
 * @returns The activity rows, still unfiltered by the window.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
async function LoadPositionOverviewExtras(
  fundId: string,
  positionId: string
): Promise<LoadedPositionOverviewExtras> {
  try {
    const { get: GET_FUND } = FundContainer()
    const { list: LIST_BANKS } = BankContainer()
    const { listAllApplications: LIST_APPLICATIONS } =
      ApplicationContainer()
    const { listAllWithdrawals: LIST_WITHDRAWALS } =
      WithdrawalContainer()

    const [FUND, BANKS] = await Promise.all([
      GET_FUND.execute({ fundId }),
      LIST_BANKS.execute({}),
    ])

    const BANK = BANKS.find((entry) => entry.id === FUND.bankId)

    // A movement without its custodian bank cannot be
    // labeled, so the rows stay empty and the section
    // explains the missing records through its own copy.
    if (!BANK) return { activity: [] }

    const [APPLICATIONS, WITHDRAWALS] = await Promise.all([
      LIST_APPLICATIONS.execute({ positionIds: [positionId] }),
      LIST_WITHDRAWALS.execute({ positionIds: [positionId] }),
    ])

    const ACTIVITY = BuildPositionActivityRows(
      {
        id: positionId,
        fundId: FUND.id,
        fundName: FUND.name,
        bankName: BANK.name,
      },
      APPLICATIONS,
      WITHDRAWALS
    )

    return { activity: ACTIVITY }
  } catch (cause) {
    LogError(
      "LoadPositionOverviewExtras",
      "failed to resolve the position extras.",
      cause
    )
    return EMPTY_POSITION_OVERVIEW_EXTRAS
  }
}
