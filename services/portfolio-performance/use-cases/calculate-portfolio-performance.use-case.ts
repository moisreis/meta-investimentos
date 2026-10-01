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
import { CalculatePositionPerformanceUseCase } from "@/services/position-performance/use-cases/calculate-position-performance.use-case"
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
 * Each position is valued for the target day before the
 * portfolio is aggregated, so the opening balance this use
 * case carries forward is always present. That makes the
 * calculation self-contained: it does not require the
 * position performance route to have been run over the same
 * period first.
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
    private portfolioPerformanceRepository: IPortfolioPerformance,
    private calculatePositionPerformanceUseCase: CalculatePositionPerformanceUseCase
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
   * A day on which no fund of the portfolio publishes a
   * quota is a non-trading day, not a failure: there is no
   * price to value the portfolio against, so the day is
   * skipped and `null` is returned. A day that prices *some*
   * funds but not a fund whose position actually holds
   * quotas is a genuine data gap and still throws. A day on
   * which the portfolio holds nothing is skipped too, rather
   * than stored as a zero snapshot.
   *
   * @param input - Portfolio id, target date and optional rates.
   *
   * @returns The saved performance, or `null` when the day
   * has no quotes, or the portfolio holds nothing, and was
   * therefore skipped.
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
  ): Promise<PortfolioPerformanceResponseDTO | null> {
    const TARGET_DATE = new Date(input.date)
    const PORTFOLIO_ID = EntityId.create(input.portfolioId)

    const PORTFOLIO =
      await this.portfolioRepository.findById(PORTFOLIO_ID)
    if (!PORTFOLIO) {
      throw new NotFoundError("`Portfolio` not found.")
    }

    const POSITIONS =
      await this.positionRepository.findAllByPortfolioId(
        PORTFOLIO_ID
      )
    const POSITION_IDS = POSITIONS.map(
      (position) => position.id as EntityId
    )

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
        target: await this.resolveTarget(
          input,
          PORTFOLIO.annualInterestRate
        ),
      })
      const SAVED =
        await this.portfolioPerformanceRepository.save(EMPTY)
      return toResponseDTO(SAVED)
    }

    // A portfolio snapshot is the aggregate of its positions'
    // snapshots, and the carry-forward below reads those rows
    // for the opening balance. Calculating the positions here
    // is what makes this use case correct on its own: without
    // it, every day after the first with no movement would
    // value the portfolio at zero.
    //
    // A position that returns `null` is skipped, either
    // because its fund has no quote that day or because it
    // holds nothing. Either way it contributes nothing to the
    // total, and a portfolio made only of such positions is
    // skipped below.
    for (const POSITION_ID of POSITION_IDS) {
      await this.calculatePositionPerformanceUseCase.execute({
        positionId: POSITION_ID,
        date: input.date,
      })
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

    // Bounded by TARGET_DATE so a recalculated day reads the
    // snapshot before it, never its own. Without the bound, a
    // re-run of a period that already has data would carry the
    // day twice and then trip the `(portfolio_id, date)`
    // unique index.
    const PREVIOUS_POSITIONS =
      await this.positionPerformanceRepository.findLatestByPositionIds(
        POSITION_IDS,
        TARGET_DATE
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
      const HELD_APPLICATION_QUOTAS =
        calculatePortfolioApplicationQuotasSum({
          quotaQuantity: DAY_APPLICATIONS.map((application) => ({
            value: application.quotas,
          })),
        })
      const HELD_WITHDRAWAL_QUOTAS =
        calculatePortfolioWithdrawalQuotasSum({
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
      quotaQuantity: [...QUOTAS_BY_POSITION.values()].map(
        (quotas) => ({
          value: quotas,
        })
      ),
    })

    const PATRIMONY = await this.calculatePatrimony({
      positions: POSITIONS,
      quotasByPosition: QUOTAS_BY_POSITION,
      targetDate: TARGET_DATE,
    })

    if (!PATRIMONY) {
      return null
    }

    // Same exclusive bound as the position lookup: the opening
    // balance for a day is the day before it, never the day
    // itself.
    const PREVIOUS_PORTFOLIO =
      await this.portfolioPerformanceRepository.findLatestByPortfolioId(
        PORTFOLIO_ID,
        TARGET_DATE
      )

    const EARNINGS = calculatePortfolioEarnings({
      sumOfPositionCurrentBalances: SignedMoney.create(
        PATRIMONY.value
      ),
      sumOfPositionInitialBalance: SignedMoney.create(
        PREVIOUS_PORTFOLIO
          ? PREVIOUS_PORTFOLIO.patrimony.value
          : "0"
      ),
      cashFlow: DAILY_CALCULATION.cashFlowNet,
    })

    const RETURN_DAILY = await this.calculateDailyReturn({
      portfolioId: PORTFOLIO_ID,
      targetDate: TARGET_DATE,
      currentDayPortfolioValue: PATRIMONY,
      currentDayCashFlow: DAILY_CALCULATION.cashFlowNet,
      previousDayPortfolioValue:
        PREVIOUS_PORTFOLIO?.patrimony ?? null,
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
      target: await this.resolveTarget(
        input,
        PORTFOLIO.annualInterestRate
      ),
      cumulativeTarget: input.inflationRate
        ? calculatePortfolioCumulativeTarget({
            monthlyTargets: [
              {
                value: calculatePortfolioTarget({
                  annualInterestRate:
                    PORTFOLIO.annualInterestRate,
                  inflationRate: SignedPercentage.create(
                    input.inflationRate
                  ),
                }),
              },
            ],
          })
        : null,
      inflationSpread: input.inflationRate
        ? calculatePortfolioInflationSpread({
            portfolioReturn: RETURN_DAILY,
            inflationRate: SignedPercentage.create(
              input.inflationRate
            ),
          })
        : null,
      riskFreeSpread: input.riskFreeRate
        ? calculatePortfolioRiskFreeSpread({
            portfolioReturn: RETURN_DAILY,
            riskFreeRate: SignedPercentage.create(
              input.riskFreeRate
            ),
          })
        : null,
      marketSpread: input.marketRate
        ? calculatePortfolioMarketSpread({
            portfolioReturn: RETURN_DAILY,
            marketRate: SignedPercentage.create(
              input.marketRate
            ),
          })
        : null,
    })

    const SAVED =
      await this.portfolioPerformanceRepository.save(PERFORMANCE)
    return toResponseDTO(SAVED)
  }

  private calculateDailyTotals(input: {
    applications: Application[]
    withdrawals: Withdrawal[]
  }): {
    applicationTotal: ReturnType<
      typeof calculatePortfolioApplicationSum
    >
    redemptionTotal: ReturnType<
      typeof calculatePortfolioWithdrawalSum
    >
    cashFlowNet: ReturnType<typeof calculatePortfolioCashFlowNet>
    applicationQuotas: ReturnType<
      typeof calculatePortfolioApplicationQuotasSum
    >
    withdrawalQuotas: ReturnType<
      typeof calculatePortfolioWithdrawalQuotasSum
    >
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
    const APPLICATION_QUOTAS =
      calculatePortfolioApplicationQuotasSum({
        quotaQuantity: input.applications.map((application) => ({
          value: application.quotas,
        })),
      })
    const WITHDRAWAL_QUOTAS =
      calculatePortfolioWithdrawalQuotasSum({
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

  /**
   * @summary
   * Values the portfolio on the target date.
   *
   * @remarks
   * Loads every fund quote of the day in a single query
   * instead of one query per position, then sums the quote
   * price times the held quotas.
   *
   * A position holding nothing is skipped: it contributes
   * zero to the patrimony, so it has no business demanding a
   * price. That is what lets a portfolio keep calculating on
   * days when only some of its funds are quoted.
   *
   * @explanation
   * Returns `null` when no fund of the portfolio has a quote
   * on the target date, which marks the day as a non-trading
   * day for the caller to skip. Also returns `null` when the
   * portfolio holds no quotas at all, because a snapshot of
   * an empty portfolio carries no information and would leave
   * the next day with a zero opening balance. Throws when a
   * fund whose position *does* hold quotas is missing its
   * quote, since that is a gap in the price series rather
   * than a holiday.
   *
   * @param input - The positions, their balances and the day.
   *
   * @returns The portfolio patrimony, or `null` when the day
   * has no quotes or the portfolio holds nothing.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-28
   */
  private async calculatePatrimony(input: {
    positions: {
      id: EntityId | undefined
      fundId: EntityId
    }[]
    quotasByPosition: Map<string, QuotaQuantity>
    targetDate: Date
  }): Promise<PositiveMoney | null> {
    const FUND_IDS = [
      ...new Set(
        input.positions.map((position) => position.fundId)
      ),
    ]

    const QUOTAS =
      await this.quotaRepository.findAllByFundIdsInPeriod(
        FUND_IDS,
        input.targetDate,
        input.targetDate
      )

    if (QUOTAS.length === 0) {
      return null
    }

    const PRICE_BY_FUND = new Map(
      QUOTAS.map((quota) => [
        quota.fundId as string,
        quota.price,
      ])
    )

    let TOTAL = new Decimal(0)
    for (const position of input.positions) {
      const HELD = input.quotasByPosition.get(
        position.id as string
      )

      if (!HELD || HELD.value.isZero()) {
        continue
      }

      const PRICE = PRICE_BY_FUND.get(position.fundId as string)
      if (!PRICE) {
        throw new ValidationError(
          "`Quota` is required for the target date."
        )
      }

      TOTAL = TOTAL.plus(PRICE.value.times(HELD.value))
    }

    // An empty portfolio has nothing to snapshot. Writing a
    // zero row would also poison the next day, which needs a
    // non-zero opening balance to compute a daily return.
    if (TOTAL.isZero()) {
      return null
    }

    return PositiveMoney.create(TOTAL)
  }

  private async calculateDailyReturn(input: {
    portfolioId: EntityId
    targetDate: Date
    currentDayPortfolioValue: PositiveMoney
    currentDayCashFlow: ReturnType<
      typeof calculatePortfolioCashFlowNet
    >
    previousDayPortfolioValue: PositiveMoney | null
  }): Promise<SignedPercentage> {
    // A portfolio that held nothing yesterday had no capital
    // at risk, so it has no daily return. This must be caught
    // here: `calculatePortfolioDailyFactor` rejects a zero
    // previous value, and an empty portfolio legitimately
    // produces one.
    if (
      !input.previousDayPortfolioValue ||
      input.previousDayPortfolioValue.value.isZero()
    ) {
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
    const WINDOW_START = this.addMonths(
      input.targetDate,
      -input.months
    )
    const PERFORMANCES =
      await this.portfolioPerformanceRepository.findAllByPortfolioId(
        input.portfolioId
      )
    const IN_WINDOW = PERFORMANCES.filter(
      (performance) =>
        performance.date >= WINDOW_START &&
        performance.date <= input.targetDate
    ).sort(
      (left, right) => left.date.getTime() - right.date.getTime()
    )
    if (IN_WINDOW.length < 2) {
      return null
    }

    const FACTORS: { value: GrowthFactor }[] = IN_WINDOW.map(
      (performance) => ({
        value: GrowthFactor.create(
          new Decimal(1).plus(
            performance.returnDaily.value.dividedBy(100)
          )
        ),
      })
    )

    return calculatePortfolioReturn({
      dailyGrowthFactors: FACTORS,
    })
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
      inflationRate: SignedPercentage.create(
        input.inflationRate
      ),
    })
  }

  private addMonths(date: Date, months: number): Date {
    const RESULT = new Date(date)
    RESULT.setMonth(RESULT.getMonth() + months)
    return RESULT
  }
}
