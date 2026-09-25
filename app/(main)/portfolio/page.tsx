import { headers } from "next/headers"
import type { Metadata } from "next"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { BankAccountRepository } from "@/infrastructure/bank-account/repositories/bank-account.repository"
import { PortfolioPerformanceRepository } from "@/infrastructure/portfolio-performance/repositories/portfolio-performance.repository"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { PositionRepository } from "@/infrastructure/position/repositories/position.repository"
import { UserRepository } from "@/infrastructure/user/repositories/user.repository"
import { PortfolioList } from "@/presentation/routes/portfolio/pages/list"
import type {
  PortfolioHoldingsCount,
  PortfolioOwner,
} from "@/presentation/routes/portfolio/types/portfolio-list.types"
import type { BankAccount } from "@domain/bank-account/entities/bank-account.entity"
import type { Position } from "@domain/position/entities/position.entity"
import { ListBankAccountsByPortfolioIdsUseCase } from "@/services/bank-account/use-cases/list-bank-accounts-by-portfolio-ids.use-case"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import { ListPortfolioPerformanceDatesUseCase } from "@/services/portfolio-performance/use-cases/list-portfolio-performance-dates.use-case"
import { ListPositionsByPortfolioIdsUseCase } from "@/services/position/use-cases/list-positions-by-portfolio-ids.use-case"
import { ListPortfoliosUseCase } from "@/services/portfolio/use-cases/list-portfolios.use-case"
import { GetUserUseCase } from "@/services/user/use-cases/get-user.use-case"

export const metadata: Metadata = {
  title: "Carteiras",
}

// Tallies distinct funds and bank accounts per portfolio.
function BuildHoldingsCounts(
  positions: Position[],
  bankAccounts: BankAccount[]
): Record<string, PortfolioHoldingsCount> {
  const COUNTS: Record<string, PortfolioHoldingsCount> = {}
  const SEEN_FUNDS: Record<string, Set<string>> = {}

  for (const positioned of positions) {
    const PORTFOLIO_ID = positioned.portfolioId as string
    const FUND_ID = positioned.fundId as string

    const FUNDS = SEEN_FUNDS[PORTFOLIO_ID] ?? new Set<string>()
    if (FUNDS.has(FUND_ID)) continue
    FUNDS.add(FUND_ID)
    SEEN_FUNDS[PORTFOLIO_ID] = FUNDS

    const COUNT = COUNTS[PORTFOLIO_ID] ?? {
      fundCount: 0,
      bankAccountCount: 0,
    }
    COUNTS[PORTFOLIO_ID] = {
      ...COUNT,
      fundCount: COUNT.fundCount + 1,
    }
  }

  for (const account of bankAccounts) {
    const PORTFOLIO_ID = account.portfolioId as string
    const COUNT = COUNTS[PORTFOLIO_ID] ?? {
      fundCount: 0,
      bankAccountCount: 0,
    }
    COUNTS[PORTFOLIO_ID] = {
      ...COUNT,
      bankAccountCount: COUNT.bankAccountCount + 1,
    }
  }

  return COUNTS
}

export default async function PortfoliosRoutePage() {
  let PORTFOLIOS: PortfolioResponseDTO[] | null = null
  let PERFORMANCE_DATES: string[] = []
  let OWNER: PortfolioOwner | null = null
  let HOLDINGS_COUNTS: Record<string, PortfolioHoldingsCount> =
    {}

  const SESSION = await auth.api.getSession({
    headers: await headers(),
  })

  if (SESSION?.user) {
    const REPOSITORY = new PortfolioRepository(db)
    const USE_CASE = new ListPortfoliosUseCase(REPOSITORY)

    PORTFOLIOS = await USE_CASE.execute({
      userId: SESSION.user.id,
    })

    const PORTFOLIO_IDS = PORTFOLIOS.map(
      (portfolio) => portfolio.id
    )

    const PERFORMANCE_REPOSITORY =
      new PortfolioPerformanceRepository(db)
    const DATES_USE_CASE =
      new ListPortfolioPerformanceDatesUseCase(
        PERFORMANCE_REPOSITORY
      )

    PERFORMANCE_DATES = await DATES_USE_CASE.execute({
      portfolioIds: PORTFOLIO_IDS,
    })

    const USER_REPOSITORY = new UserRepository(db)
    const GET_USER_USE_CASE = new GetUserUseCase(USER_REPOSITORY)

    const POSITION_REPOSITORY = new PositionRepository(db)
    const POSITIONS_USE_CASE =
      new ListPositionsByPortfolioIdsUseCase(POSITION_REPOSITORY)

    const BANK_ACCOUNT_REPOSITORY = new BankAccountRepository(db)
    const BANK_ACCOUNTS_USE_CASE =
      new ListBankAccountsByPortfolioIdsUseCase(
        BANK_ACCOUNT_REPOSITORY
      )

    const [USER, POSITIONS, BANK_ACCOUNTS] = await Promise.all([
      GET_USER_USE_CASE.execute({ userId: SESSION.user.id }),
      POSITIONS_USE_CASE.execute({
        portfolioIds: PORTFOLIO_IDS,
      }),
      BANK_ACCOUNTS_USE_CASE.execute({
        portfolioIds: PORTFOLIO_IDS,
      }),
    ])

    OWNER = {
      firstName: USER.firstName,
      lastName: USER.lastName,
      image: USER.image,
    }

    HOLDINGS_COUNTS = BuildHoldingsCounts(
      POSITIONS,
      BANK_ACCOUNTS
    )
  }

  return (
    <>
      <PortfolioList
        data={PORTFOLIOS}
        availableDates={PERFORMANCE_DATES}
        holdingsCounts={HOLDINGS_COUNTS}
        owner={OWNER}
      />
    </>
  )
}
