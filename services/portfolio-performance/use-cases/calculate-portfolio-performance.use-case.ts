import Decimal from "decimal.js"

import { PortfolioPerformance } from "@domain/portfolio-performance/entities/portfolio-performance.entity"
import { IPortfolioPerformance } from "@domain/portfolio-performance/interfaces/portfolio-performance.interface"
import { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import { IPosition } from "@domain/position/interfaces/position.interface"
import { IPositionPerformance } from "@domain/position-performance/interfaces/position-performance.interface"
import { IQuota } from "@domain/quota/interfaces/quota.interface"
import { IApplication } from "@domain/application/interfaces/application.interface"
import { IWithdrawal } from "@domain/withdrawal/interfaces/withdrawal.interface"
import { Application } from "@domain/application/entities/application.entity"
import { Withdrawal } from "@domain/withdrawal/entities/withdrawal.entity"
import { calculatePortfolioApplicationQuotasSum } from "@domain/portfolio/calculators/application-quotas-sum.calculator"
import { calculatePortfolioApplicationSum } from "@domain/portfolio/calculators/application-sum.calculator"
import { calculatePortfolioCashFlowNet } from "@domain/portfolio/calculators/cash-flow-net.calculator"
import { calculatePortfolioCumulativeTarget } from "@domain/portfolio/calculators/cumulative-target.calculator"
import { calculatePortfolioDailyFactor } from "@domain/portfolio/calculators/daily-factor.calculator"
import { calculatePortfolioEarnings } from "@domain/portfolio/calculators/earnings.calculator"
import { calculatePortfolioQuotasHeldSum } from "@domain/portfolio/calculators/quotas-held-sum.calculator"
import { calculatePortfolioReturn } from "@domain/portfolio/calculators/return.calculator"
import { calculatePortfolioTarget } from "@domain/portfolio/calculators/target.calculator"
import { calculatePortfolioWithdrawalQuotasSum } from "@domain/portfolio/calculators/withdrawal-quotas-sum.calculator"
import { calculatePortfolioWithdrawalSum } from "@domain/portfolio/calculators/withdrawal-sum.calculator"
import { calculatePortfolioInflationSpread } from "@domain/benchmark/calculators/inflation-spread.calculator"
import { calculatePortfolioRiskFreeSpread } from "@domain/benchmark/calculators/risk-free-spread.calculator"
import { calculatePortfolioMarketSpread } from "@domain/benchmark/calculators/market-spread.calculator"
import {
  EntityId,
  GrowthFactor,
  PositiveMoney,
  QuotaQuantity,
  SignedMoney,
  SignedPercentage,
} from "@/value-objects"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import type { PortfolioPerformanceResponseDTO } from "../dto/portfolio-performance-response.dto"
import { toResponseDTO } from "../mappers/portfolio-performance.mapper"

export interface CalculatePortfolioPerformanceInput {
  portfolioId: string
  date: string
  inflationRate?: string | null
  riskFreeRate?: string | null
  marketRate?: string | null
}

/**
 * @summary
 * Calculates the daily performance of a portfolio.
 *
 * @remarks
 * Orchestrates positions, quotas, applications, withdrawals
 * and previous snapshots to produce a fresh daily portfolio
 * performance record using the domain calculators.
 *
 * @explanation
 * Patrimony aggregates the position values for the date.
 * The optional rates feed the target and the benchmark
 * spreads, remaining null when not provided.
 *
 * @example
 * const RESULT = await USE_CASE.execute({
 *   portfolioId: "portfolio-1",
 *   date: "2026-09-15T00:00:00.000Z",
 *   inflationRate: "0.44",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CalculatePortfolioPerformanceUseCase {
  constructor(
    private portfolioRepository: IPortfolio,
    private positionRepository: IPosition,
    private quotaRepository: IQuota,
    private applicationRepository: IApplication,
    private withdrawalRepository: IWithdrawal,
    private positionPerformanceRepository: IPositionPerformance,
    private portfolioPerformanceRepository: IPortfolioPerformance
  ) {}

  /**
   * @summary
   * Calculates and persists the portfolio performance.
   *
   * @remarks
   * Orchestrates positions, quotas, applications, withdrawals
   * and previous snapshots to produce a fresh daily portfolio
   * performance record using the domain calculators.
   *
   * @explanation
   * Patrimony aggregates the position values for the date.
   * The optional rates feed the target and the benchmark
   * spreads, remaining null when not provided.
   *
   * @param input - Portfolio id, target date and optional rates.
   *
   * @returns The saved performance.
   *
   * @example
   * const RESULT = await USE_CASE.execute({
   *   portfolioId: "portfolio-1",
   *   date: "2026-09-15T00:00:00.000Z",
   *   inflationRate: "0.44",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: CalculatePortfolioPerformanceInput
  ): Promise<PortfolioPerformanceResponseDTO> {
    const TARGET_DATE = new Date(input.date)
    const PORTFOLIO_ID = EntityId.create(input.portfolioId)

    const PORTFOLIO = await this.portfolioRepository.findById(PORTFOLIO_ID)
    if (!PORTFOLIO) {
      throw new NotFoundError("`Portfolio` not found.")
    }

    const POSITIONS =
      await this.positionRepository.findAllByPortfolioId(PORTFOLIO_ID)
    const POSITION_IDS = POSITIONS.map((position) => position.id as EntityId)

    if (POSITION_IDS.length === 0) {
      const EMPTY = PortfolioPerformance.create({
        portfolioId: PORTFOLIO_ID,
        date: TARGET_DATE,
        quotasHeld: QuotaQuantity.create("0") as QuotaQuantity,
        patrimony: PositiveMoney.create("0"),
        applicationTotal: PositiveMoney.create("0"),
        redemptionTotal: PositiveMoney.create("0"),
        cashFlowNet: SignedMoney.create("0"),
        earnings: SignedMoney.create("0"),
        returnDaily: SignedPercentage.create("0"),
        target: await this.resolveTarget(input, PORTFOLIO.annualInterestRate),
      })
      const SAVED = await this.portfolioPerformanceRepository.save(EMPTY)
      return toResponseDTO(SAVED)
    }

    const APPLICATIONS =
      await this.applicationRepository.findAllByPositionIdsInPeriod(
        POSITION_IDS,
        TARGET_DATE,
        TARGET_DATE
      )
    const WITHDRAWALS =
      await this.withdrawalRepository.findAllByPositionIdsInPeriod(
        POSITION_IDS,
        TARGET_DATE,
        TARGET_DATE
      )

    const DAILY_CALCULATION = this.calculateDailyTotals({
      applications: APPLICATIONS,
      withdrawals: WITHDRAWALS,
    })

    const PREVIOUS_POSITIONS =
      await this.positionPerformanceRepository.findLatestByPositionIds(
        POSITION_IDS
      )
    const PREVIOUS_POSITIONS_BY_ID = new Map(
      PREVIOUS_POSITIONS.map((performance) => [
        performance.positionId as string,
        performance.quotasHeld,
      ])
    )

    const QUOTAS_BY_POSITION = new Map<string, QuotaQuantity>()
    for (const position of POSITIONS) {
      const LAST_PERIOD =
        PREVIOUS_POSITIONS_BY_ID.get(position.id as string) ??
        QuotaQuantity.create("0")
      const DAY_APPLICATIONS = APPLICATIONS.filter(
        (application) => application.positionId === position.id
      )
      const DAY_WITHDRAWALS = WITHDRAWALS.filter(
        (withdrawal) => withdrawal.positionId === position.id
      )
      const HELD_APPLICATION_QUOTAS = calculatePortfolioApplicationQuotasSum({
        quotaQuantity: DAY_APPLICATIONS.map((application) => ({
          value: application.quotas,
        })),
      })
      const HELD_WITHDRAWAL_QUOTAS = calculatePortfolioWithdrawalQuotasSum({
        quotaQuantity: DAY_WITHDRAWALS.map((withdrawal) => ({
          value: withdrawal.quotas,
        })),
      })
      QUOTAS_BY_POSITION.set(
        position.id as string,
        QuotaQuantity.create(
          LAST_PERIOD.value
            .plus(HELD_APPLICATION_QUOTAS.value)
            .minus(HELD_WITHDRAWAL_QUOTAS.value)
        )
      )
    }

    const QUOTAS_HELD = calculatePortfolioQuotasHeldSum({
      quotaQuantity: [...QUOTAS_BY_POSITION.values()].map((quotas) => ({
        value: quotas,
      })),
    })

    const PATRIMONY = await this.calculatePatrimony({
      positions: POSITIONS,
      quotasByPosition: QUOTAS_BY_POSITION,
      targetDate: TARGET_DATE,
    })

    const PREVIOUS_PORTFOLIO =
      await this.portfolioPerformanceRepository.findLatestByPortfolioId(
        PORTFOLIO_ID
      )

    const EARNINGS = calculatePortfolioEarnings({
      sumOfPositionCurrentBalances: SignedMoney.create(PATRIMONY.value),
      sumOfPositionInitialBalance: SignedMoney.create(
        PREVIOUS_PORTFOLIO ? PREVIOUS_PORTFOLIO.patrimony.value : "0"
      ),
      cashFlow: DAILY_CALCULATION.cashFlowNet,
    })

    const RETURN_DAILY = await this.calculateDailyReturn({
      portfolioId: PORTFOLIO_ID,
      targetDate: TARGET_DATE,
      currentDayPortfolioValue: PATRIMONY,
      currentDayCashFlow: DAILY_CALCULATION.cashFlowNet,
      previousDayPortfolioValue: PREVIOUS_PORTFOLIO?.patrimony ?? null,
    })

    const PERFORMANCE = PortfolioPerformance.create({
      portfolioId: PORTFOLIO_ID,
      date: TARGET_DATE,
      quotasHeld: QUOTAS_HELD,
      patrimony: PATRIMONY,
      applicationTotal: DAILY_CALCULATION.applicationTotal,
      redemptionTotal: DAILY_CALCULATION.redemptionTotal,
      cashFlowNet: DAILY_CALCULATION.cashFlowNet,
      earnings: EARNINGS,
      returnDaily: RETURN_DAILY,
      returnMonthly: await this.calculateTrailingReturn({
        portfolioId: PORTFOLIO_ID,
        targetDate: TARGET_DATE,
        months: 1,
      }),
      returnYearly: await this.calculateTrailingReturn({
        portfolioId: PORTFOLIO_ID,
        targetDate: TARGET_DATE,
        months: 12,
      }),
      returnLast12m: await this.calculateTrailingReturn({
        portfolioId: PORTFOLIO_ID,
        targetDate: TARGET_DATE,
        months: 12,
      }),
      target: await this.resolveTarget(input, PORTFOLIO.annualInterestRate),
      cumulativeTarget: input.inflationRate
        ? calculatePortfolioCumulativeTarget({
            monthlyTargets: [
              {
                value: calculatePortfolioTarget({
                  annualInterestRate: PORTFOLIO.annualInterestRate,
                  inflationRate: SignedPercentage.create(input.inflationRate),
                }),
              },
            ],
          })
        : null,
      inflationSpread: input.inflationRate
        ? calculatePortfolioInflationSpread({
            portfolioReturn: RETURN_DAILY,
            inflationRate: SignedPercentage.create(input.inflationRate),
          })
        : null,
      riskFreeSpread: input.riskFreeRate
        ? calculatePortfolioRiskFreeSpread({
            portfolioReturn: RETURN_DAILY,
            riskFreeRate: SignedPercentage.create(input.riskFreeRate),
          })
        : null,
      marketSpread: input.marketRate
        ? calculatePortfolioMarketSpread({
            portfolioReturn: RETURN_DAILY,
            marketRate: SignedPercentage.create(input.marketRate),
          })
        : null,
    })

    const SAVED = await this.portfolioPerformanceRepository.save(PERFORMANCE)
    return toResponseDTO(SAVED)
  }

  private calculateDailyTotals(input: {
    applications: Application[]
    withdrawals: Withdrawal[]
  }): {
    applicationTotal: ReturnType<typeof calculatePortfolioApplicationSum>
    redemptionTotal: ReturnType<typeof calculatePortfolioWithdrawalSum>
    cashFlowNet: ReturnType<typeof calculatePortfolioCashFlowNet>
    applicationQuotas: ReturnType<typeof calculatePortfolioApplicationQuotasSum>
    withdrawalQuotas: ReturnType<typeof calculatePortfolioWithdrawalQuotasSum>
  } {
    const APPLICATION_TOTAL = calculatePortfolioApplicationSum({
      application: input.applications.map((application) => ({
        value: application.amount,
      })),
    })
    const REDEMPTION_TOTAL = calculatePortfolioWithdrawalSum({
      withdrawal: input.withdrawals.map((withdrawal) => ({
        value: withdrawal.amount,
      })),
    })
    const CASH_FLOW_NET = calculatePortfolioCashFlowNet({
      applications: APPLICATION_TOTAL,
      withdrawals: REDEMPTION_TOTAL,
    })
    const APPLICATION_QUOTAS = calculatePortfolioApplicationQuotasSum({
      quotaQuantity: input.applications.map((application) => ({
        value: application.quotas,
      })),
    })
    const WITHDRAWAL_QUOTAS = calculatePortfolioWithdrawalQuotasSum({
      quotaQuantity: input.withdrawals.map((withdrawal) => ({
        value: withdrawal.quotas,
      })),
    })

    return {
      applicationTotal: APPLICATION_TOTAL,
      redemptionTotal: REDEMPTION_TOTAL,
      cashFlowNet: CASH_FLOW_NET,
      applicationQuotas: APPLICATION_QUOTAS,
      withdrawalQuotas: WITHDRAWAL_QUOTAS,
    }
  }

  private async calculatePatrimony(input: {
    positions: {
      id: EntityId | undefined
      fundId: EntityId
    }[]
    quotasByPosition: Map<string, QuotaQuantity>
    targetDate: Date
  }): Promise<PositiveMoney> {
    let TOTAL = new Decimal(0)
    for (const position of input.positions) {
      const positionId = position.id as string
      const QUOTAS = input.quotasByPosition.get(positionId)
      if (!QUOTAS) {
        continue
      }
      const QUOTA = await this.quotaRepository.findByFundIdAndDate(
        position.fundId,
        input.targetDate
      )
      if (!QUOTA) {
        throw new ValidationError("`Quota` is required for the target date.")
      }
      TOTAL = TOTAL.plus(QUOTA.price.value.times(QUOTAS.value))
    }
    return PositiveMoney.create(TOTAL)
  }

  private async calculateDailyReturn(input: {
    portfolioId: EntityId
    targetDate: Date
    currentDayPortfolioValue: PositiveMoney
    currentDayCashFlow: ReturnType<typeof calculatePortfolioCashFlowNet>
    previousDayPortfolioValue: PositiveMoney | null
  }): Promise<SignedPercentage> {
    if (!input.previousDayPortfolioValue) {
      return SignedPercentage.create("0")
    }

    const DAILY_FACTOR = calculatePortfolioDailyFactor({
      currentDayPortfolioValue: SignedMoney.create(
        input.currentDayPortfolioValue.value
      ),
      currentDayCashFlow: input.currentDayCashFlow,
      previousDayPortfolioValue: SignedMoney.create(
        input.previousDayPortfolioValue.value
      ),
    })

    return calculatePortfolioReturn({
      dailyGrowthFactors: [{ value: DAILY_FACTOR }],
    })
  }

  private async calculateTrailingReturn(input: {
    portfolioId: EntityId
    targetDate: Date
    months: number
  }): Promise<SignedPercentage | null> {
    const WINDOW_START = this.addMonths(input.targetDate, -input.months)
    const PERFORMANCES =
      await this.portfolioPerformanceRepository.findAllByPortfolioId(
        input.portfolioId
      )
    const IN_WINDOW = PERFORMANCES.filter(
      (performance) =>
        performance.date >= WINDOW_START && performance.date <= input.targetDate
    ).sort((left, right) => left.date.getTime() - right.date.getTime())
    if (IN_WINDOW.length < 2) {
      return null
    }

    const FACTORS: { value: GrowthFactor }[] = IN_WINDOW.map((performance) => ({
      value: GrowthFactor.create(
        new Decimal(1).plus(performance.returnDaily.value.dividedBy(100))
      ),
    }))

    return calculatePortfolioReturn({ dailyGrowthFactors: FACTORS })
  }

  private resolveTarget(
    input: CalculatePortfolioPerformanceInput,
    annualInterestRate: SignedPercentage
  ): SignedPercentage | null {
    if (!input.inflationRate) {
      return null
    }
    return calculatePortfolioTarget({
      annualInterestRate,
      inflationRate: SignedPercentage.create(input.inflationRate),
    })
  }

  private addMonths(date: Date, months: number): Date {
    const RESULT = new Date(date)
    RESULT.setMonth(RESULT.getMonth() + months)
    return RESULT
  }
}
