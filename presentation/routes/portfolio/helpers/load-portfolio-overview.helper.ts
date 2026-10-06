import { RequireSessionUser } from "@/lib/auth/require-session"
import { LogError, LogWarn } from "@/lib/log/logger"
import { ApplicationContainer } from "@/presentation/composition/application.container"
import { BankAccountContainer } from "@/presentation/composition/bank-account.container"
import { BankContainer } from "@/presentation/composition/bank.container"
import { BenchmarkContainer } from "@/presentation/composition/benchmark.container"
import { CheckingAccountContainer } from "@/presentation/composition/checking-account.container"
import { FundContainer } from "@/presentation/composition/fund.container"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import { PositionContainer } from "@/presentation/composition/position.container"
import { WithdrawalContainer } from "@/presentation/composition/withdrawal.container"

import { BuildPortfolioActivityRows } from "./build-portfolio-activity-rows.helper"
import { LoadPortfolioApplicationOptions } from "./load-portfolio-application-options.helper"
import { LoadPortfolioWithdrawalOptions } from "./load-portfolio-withdrawal-options.helper"
import { LoadPortfolioOwner } from "./load-portfolio-owner.helper"
import { LoadPortfolioNormRegistry } from "./load-portfolio-norm-registry.helper"
import { LoadSessionPortfolios } from "./load-session-portfolios.helper"

import { EMPTY_APPLICATION_ADD_OPTIONS } from "@/presentation/routes/application/types/application-add.types"
import { EMPTY_WITHDRAWAL_ADD_OPTIONS } from "@/presentation/routes/withdrawal/types/withdrawal-add.types"
import { BuildPortfolioBankAccountViews } from "@/presentation/mappers/portfolio-bank-account.mapper"
import { BuildPortfolioHoldings } from "@/presentation/mappers/portfolio-holding.mapper"

import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"
import type { ApplicationAddOptions } from "@/presentation/routes/application/types/application-add.types"
import type { WithdrawalAddOptions } from "@/presentation/routes/withdrawal/types/withdrawal-add.types"
import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"
import type { PortfolioBankAccountView } from "@/presentation/types/portfolio-checking.types"
import type { PortfolioHolding } from "@/presentation/types/portfolio-holding.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type { PortfolioOverviewData } from "../types/portfolio-overview.types"

// Data resolved by the portfolio detail loader beyond the
// daily snapshots and the add flow options.
export interface LoadedPortfolioOverviewExtras {
  // Holdings of the portfolio, resolved down to the
  // custodian bank of each fund.
  holdings: PortfolioHolding[]
  // Applications and withdrawals of the portfolio, newest
  // first, still unfiltered by the selected window.
  activity: PortfolioActivityRow[]
  // Bank accounts of the portfolio, resolved down to the
  // bank that hosts each one.
  bankAccounts: PortfolioBankAccountView[]
  // Daily balance snapshots of the portfolio bank accounts.
  balances: CheckingAccountResponseDTO[]
}

// Neutral extras rendered while the registries cannot be
// resolved.
const EMPTY_PORTFOLIO_OVERVIEW_EXTRAS: LoadedPortfolioOverviewExtras =
  {
    holdings: [],
    activity: [],
    bankAccounts: [],
    balances: [],
  }

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
 * The add application and add withdrawal option registries,
 * the session portfolios offered by the calculate and report
 * dialogs, the holdings and the activity are all loaded in
 * parallel. A failure of the registers degrades to the empty
 * extras, so the summary and the performance charts stay
 * visible while the distributions and the activity table
 * explain the missing records through their own empty copy.
 * Returns null when there is no session, the portfolio is
 * missing, or the portfolio is not owned by the session user.
 * The owner of the portfolio joins the same parallel batch,
 * read by the id the portfolio carries, and degrades to a
 * null byline rather than failing the screen.
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
      listPerformances: LIST_PERFORMANCES,
    } = PortfolioContainer()

    const PORTFOLIO = await GET_PORTFOLIO.execute({
      portfolioId,
    })

    if (PORTFOLIO.userId !== USER.id) {
      LogWarn(
        "LoadPortfolioOverview",
        `portfolio ${portfolioId} does not belong to the session user.`
      )
      return null
    }

    const PERFORMANCES = await LIST_PERFORMANCES.execute({
      portfolioId,
    })

    const AVAILABLE_DATES = [
      ...new Set(
        PERFORMANCES.map((performance) =>
          performance.date.slice(0, 10)
        )
      ),
    ].sort()

    const [
      [APPLICATION_OPTIONS, WITHDRAWAL_OPTIONS],
      PICKER_OPTIONS,
      EXTRAS,
      OWNER,
      NORM_REGISTRY,
    ] = await Promise.all([
      LoadPortfolioAddOptions(portfolioId),
      LoadPortfolioPickerOptions(),
      LoadPortfolioOverviewExtras(portfolioId),
      LoadPortfolioOwner(PORTFOLIO.userId),
      LoadPortfolioNormRegistry([portfolioId]),
    ])

    return {
      portfolioId,
      performances: PERFORMANCES,
      availableDates: AVAILABLE_DATES,
      holdings: EXTRAS.holdings,
      activity: EXTRAS.activity,
      bankAccounts: EXTRAS.bankAccounts,
      balances: EXTRAS.balances,
      applicationOptions: APPLICATION_OPTIONS,
      withdrawalOptions: WITHDRAWAL_OPTIONS,
      portfolios: PICKER_OPTIONS,
      owner: OWNER,
      normAllocations:
        NORM_REGISTRY?.allocations[portfolioId] ?? [],
    }
  } catch (cause) {
    LogError(
      "LoadPortfolioOverview",
      "failed to resolve the portfolio overview.",
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
 * instead of failing the whole screen, so the summary stays
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
    LogError(
      "LoadPortfolioAddOptions",
      "failed to resolve the add flow options.",
      cause
    )
    return [
      EMPTY_APPLICATION_ADD_OPTIONS,
      EMPTY_WITHDRAWAL_ADD_OPTIONS,
    ]
  }
}

/**
 * @summary
 * Resolves the portfolios offered by the dialogs the detail
 * screen borrows from other routes.
 *
 * @remarks
 * The calculate performance and the generate report dialogs
 * preselect the portfolio of the screen, so the list they
 * start from is the registry of the session user rather than
 * the single portfolio of the route. A failure here degrades
 * to an empty list instead of failing the whole screen, so
 * the two pickers lose their options and the extrato stays.
 *
 * @explanation
 * Use this helper from the portfolio detail loader to keep
 * the borrowed dialogs on the shared session composition
 * point and a registry outage isolated from the overview.
 *
 * @returns The portfolios of the session user.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
async function LoadPortfolioPickerOptions(): Promise<
  PortfolioRow[]
> {
  try {
    const BUNDLE = await LoadSessionPortfolios()
    const PORTFOLIOS = BUNDLE === null ? [] : BUNDLE.portfolios

    return PORTFOLIOS
  } catch (cause) {
    LogError(
      "LoadPortfolioPickerOptions",
      "failed to resolve the session portfolios.",
      cause
    )
    return []
  }
}

/**
 * @summary
 * Resolves the holdings, the activity, the bank accounts and
 * the checking balances of the portfolio detail screen.
 *
 * @remarks
 * Lists the position weights of the portfolio and the fund,
 * bank and bank account registries in parallel, resolves the
 * holdings and the bank account views from them, and then
 * lists the applications, the withdrawals and the checking
 * balances of the resolved positions and accounts in parallel
 * too. The activity rows are built from the same holdings
 * that drive the distribution charts, so a fund name can
 * never differ between the ring and the table. A failure
 * here degrades to the empty extras, so a registry outage
 * does not take the KPIs and the performance charts down
 * with it.
 *
 * @explanation
 * Use this helper from the portfolio detail loader. It keeps
 * the movement listing out of the option helper, because the
 * withdrawals list would query the positions of the portfolio
 * a second time when the options were already resolved.
 *
 * @param portfolioId - The portfolio whose holdings and
 * movements are resolved.
 *
 * @returns The holdings, the activity, the bank accounts and
 *   the checking balances.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
async function LoadPortfolioOverviewExtras(
  portfolioId: string
): Promise<LoadedPortfolioOverviewExtras> {
  try {
    const { listWeights: LIST_WEIGHTS } = PositionContainer()
    const { list: LIST_FUNDS } = FundContainer()
    const { list: LIST_BANKS } = BankContainer()
    const { list: LIST_BENCHMARKS } = BenchmarkContainer()
    const { list: LIST_BANK_ACCOUNTS } = BankAccountContainer()
    const { listAllApplications: LIST_APPLICATIONS } =
      ApplicationContainer()
    const { listAllWithdrawals: LIST_WITHDRAWALS } =
      WithdrawalContainer()
    const { listByBankAccounts: LIST_CHECKING_BY_ACCOUNTS } =
      CheckingAccountContainer()

    const [WEIGHTS, FUNDS, BANKS, BENCHMARKS, BANK_ACCOUNTS] =
      await Promise.all([
        LIST_WEIGHTS.execute({ portfolioIds: [portfolioId] }),
        LIST_FUNDS.execute({}),
        LIST_BANKS.execute({}),
        LIST_BENCHMARKS.execute({}),
        LIST_BANK_ACCOUNTS.execute({}),
      ])

    const HOLDINGS = BuildPortfolioHoldings(
      WEIGHTS,
      FUNDS,
      BANKS,
      BENCHMARKS
    )
    const BANK_ACCOUNT_VIEWS = BuildPortfolioBankAccountViews(
      BANK_ACCOUNTS,
      BANKS,
      portfolioId
    )

    const POSITION_IDS = HOLDINGS.map(
      (holding) => holding.positionId
    )
    const BANK_ACCOUNT_IDS = BANK_ACCOUNT_VIEWS.map(
      (account) => account.id
    )

    const [APPLICATIONS, WITHDRAWALS, BALANCES] =
      await Promise.all([
        LIST_APPLICATIONS.execute({ positionIds: POSITION_IDS }),
        LIST_WITHDRAWALS.execute({ positionIds: POSITION_IDS }),
        LIST_CHECKING_BY_ACCOUNTS.execute({
          bankAccountIds: BANK_ACCOUNT_IDS,
        }),
      ])

    return {
      holdings: HOLDINGS,
      activity: BuildPortfolioActivityRows(
        HOLDINGS,
        APPLICATIONS,
        WITHDRAWALS
      ),
      bankAccounts: BANK_ACCOUNT_VIEWS,
      balances: BALANCES,
    }
  } catch (cause) {
    LogError(
      "LoadPortfolioOverviewExtras",
      "failed to resolve the holdings, the activity, the bank accounts and the balances.",
      cause
    )
    return EMPTY_PORTFOLIO_OVERVIEW_EXTRAS
  }
}
