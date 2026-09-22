import { calculateApplicationQuotasSum } from "@domain/position/calculators/application-quotas-sum.calculator"
import { calculateApplicationSum } from "@domain/position/calculators/application-sum.calculator"
import { calculateCashFlowNet } from "@domain/position/calculators/cash-flow-net.calculator"
import { calculateDailyFactor } from "@domain/position/calculators/daily-factor.calculator"
import { calculateEarnings } from "@domain/position/calculators/earnings.calculator"
import { calculateQuotasHeld } from "@domain/position/calculators/quotas-held.calculator"
import { calculateReturn } from "@domain/position/calculators/return.calculator"
import { calculateWithdrawalQuotasSum } from "@domain/position/calculators/withdrawal-quotas-sum.calculator"
import { calculateWithdrawalSum } from "@domain/position/calculators/withdrawal-sum.calculator"
import { Application } from "@domain/application/entities/application.entity"
import { Withdrawal } from "@domain/withdrawal/entities/withdrawal.entity"
import { PositionPerformance } from "@domain/position-performance/entities/position-performance.entity"
import { IPositionPerformance } from "@domain/position-performance/interfaces/position-performance.interface"
import { IApplication } from "@domain/application/interfaces/application.interface"
import { IWithdrawal } from "@domain/withdrawal/interfaces/withdrawal.interface"
import { IQuota } from "@domain/quota/interfaces/quota.interface"
import { IPosition } from "@domain/position/interfaces/position.interface"
import { IFund } from "@domain/fund/interfaces/fund.interface"
import { INorm } from "@domain/norm/interfaces/norm.interface"
import { INormsPortfolios } from "@domain/norms-portfolio/interfaces/norms-portfolios.interface"
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
import type { PositionPerformanceResponseDTO } from "../dto/position-performance-response.dto"
import { toResponseDTO } from "../mappers/position-performance.mapper"

export interface CalculatePositionPerformanceInput {
  positionId: string
  date: string
}

/**
 * @summary
 * Calculates the daily performance of a position.
 *
 * @remarks
 * Orchestrates quota prices, applications, withdrawals,
 * previous snapshots and norms to produce a fresh daily
 * performance record using the domain calculators.
 *
 * @explanation
 * Patrimony multiplies the held quotas by the quota price
 * of the target date. Earnings track the balance change
 * after inflows and outflows. Longer horizons chain the
 * fund NAV growth factors when enough history exists.
 *
 * @example
 * const RESULT = await USE_CASE.execute({
 *   positionId: "position-1",
 *   date: "2026-09-15T00:00:00.000Z",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CalculatePositionPerformanceUseCase {
  constructor(
    private positionRepository: IPosition,
    private fundRepository: IFund,
    private quotaRepository: IQuota,
    private applicationRepository: IApplication,
    private withdrawalRepository: IWithdrawal,
    private positionPerformanceRepository: IPositionPerformance,
    private normRepository: INorm,
    private normsPortfoliosRepository: INormsPortfolios
  ) {}

  /**
   * @summary
   * Calculates and persists the position performance.
   *
   * @remarks
   * Orchestrates quota prices, applications, withdrawals,
   * previous snapshots and norms to produce a fresh daily
   * performance record using the domain calculators.
   *
   * @explanation
   * Patrimony multiplies the held quotas by the quota price
   * of the target date. Earnings track the balance change
   * after inflows and outflows. Longer horizons chain the
   * fund NAV growth factors when enough history exists.
   *
   * @param input - Position id and target date.
   *
   * @returns The saved performance.
   *
   * @example
   * const RESULT = await USE_CASE.execute({
   *   positionId: "position-1",
   *   date: "2026-09-15T00:00:00.000Z",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: CalculatePositionPerformanceInput
  ): Promise<PositionPerformanceResponseDTO> {
    const TARGET_DATE = new Date(input.date)
    const POSITION_ID = EntityId.create(input.positionId)

    const POSITION = await this.positionRepository.findById(POSITION_ID)
    if (!POSITION) {
      throw new NotFoundError("`Position` not found.")
    }

    const FUND = await this.fundRepository.findById(POSITION.fundId)
    if (!FUND) {
      throw new NotFoundError("`Fund` not found.")
    }

    const CURRENT_QUOTA = await this.quotaRepository.findByFundIdAndDate(
      POSITION.fundId,
      TARGET_DATE
    )
    if (!CURRENT_QUOTA) {
      throw new ValidationError("`Quota` is required for the target date.")
    }

    const PREVIOUS =
      await this.positionPerformanceRepository.findLatestByPositionId(
        POSITION_ID
      )

    const APPLICATIONS =
      await this.applicationRepository.findAllByPositionIdInPeriod(
        POSITION_ID,
        TARGET_DATE,
        TARGET_DATE
      )
    const WITHDRAWALS =
      await this.withdrawalRepository.findAllByPositionIdInPeriod(
        POSITION_ID,
        TARGET_DATE,
        TARGET_DATE
      )

    const DAILY_CALCULATION = this.calculateDailyTotals({
      applications: APPLICATIONS,
      withdrawals: WITHDRAWALS,
    })

    const QUOTAS_TODAY = calculateQuotasHeld({
      lastPeriodQuotaQuantity: PREVIOUS
        ? PREVIOUS.quotasHeld
        : QuotaQuantity.create("0"),
      applicationQuotasQuantity: DAILY_CALCULATION.applicationQuotas,
      withdrawalQuotasQuantity: DAILY_CALCULATION.withdrawalQuotas,
    })

    const PATRIMONY = PositiveMoney.create(
      CURRENT_QUOTA.price.value.times(QUOTAS_TODAY.value)
    ) as PositiveMoney

    const EARNINGS = calculateEarnings({
      currentBalance: SignedMoney.create(PATRIMONY.value),
      initialBalance: SignedMoney.create(
        PREVIOUS
          ? PREVIOUS.patrimony.value
          : POSITION.initialBalance
            ? POSITION.initialBalance.value
            : "0"
      ),
      cashFlow: DAILY_CALCULATION.cashFlowNet,
    })

    const RETURN_DAILY = await this.calculateDailyReturn({
      positionId: POSITION_ID,
      fundId: POSITION.fundId,
      targetDate: TARGET_DATE,
      previousQuotasHeld: PREVIOUS?.quotasHeld ?? null,
    })

    const PERFORMANCE = PositionPerformance.create({
      positionId: POSITION_ID,
      date: TARGET_DATE,
      quotasHeld: QUOTAS_TODAY,
      patrimony: PATRIMONY,
      applicationTotal: DAILY_CALCULATION.applicationTotal,
      redemptionTotal: DAILY_CALCULATION.redemptionTotal,
      cashFlowNet: DAILY_CALCULATION.cashFlowNet,
      earnings: EARNINGS,
      returnDaily: RETURN_DAILY,
      returnMonthly: await this.calculateTrailingReturn({
        fundId: POSITION.fundId,
        targetDate: TARGET_DATE,
        months: 1,
      }),
      returnYearly: await this.calculateTrailingReturn({
        fundId: POSITION.fundId,
        targetDate: TARGET_DATE,
        months: 12,
      }),
      returnLast12m: await this.calculateTrailingReturn({
        fundId: POSITION.fundId,
        targetDate: TARGET_DATE,
        months: 12,
      }),
      allocation: await this.resolveAllocation({
        categoryId: FUND.categoryId,
        portfolioId: POSITION.portfolioId,
        previousAllocation: PREVIOUS?.allocation ?? null,
      }),
    })

    const SAVED = await this.positionPerformanceRepository.save(PERFORMANCE)
    return toResponseDTO(SAVED)
  }

  private calculateDailyTotals(input: {
    applications: Application[]
    withdrawals: Withdrawal[]
  }): {
    applicationTotal: ReturnType<typeof calculateApplicationSum>
    redemptionTotal: ReturnType<typeof calculateWithdrawalSum>
    cashFlowNet: ReturnType<typeof calculateCashFlowNet>
    applicationQuotas: ReturnType<typeof calculateApplicationQuotasSum>
    withdrawalQuotas: ReturnType<typeof calculateWithdrawalQuotasSum>
  } {
    const APPLICATION_TOTAL = calculateApplicationSum({
      application: input.applications.map((application) => ({
        value: application.amount,
      })),
    })
    const REDEMPTION_TOTAL = calculateWithdrawalSum({
      withdrawal: input.withdrawals.map((withdrawal) => ({
        value: withdrawal.amount,
      })),
    })
    const CASH_FLOW_NET = calculateCashFlowNet({
      applications: APPLICATION_TOTAL,
      withdrawals: REDEMPTION_TOTAL,
    })
    const APPLICATION_QUOTAS = calculateApplicationQuotasSum({
      quotaQuantity: input.applications.map((application) => ({
        value: application.quotas,
      })),
    })
    const WITHDRAWAL_QUOTAS = calculateWithdrawalQuotasSum({
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

  private async calculateDailyReturn(input: {
    positionId: EntityId
    fundId: EntityId
    targetDate: Date
    previousQuotasHeld: QuotaQuantity | null
  }): Promise<SignedPercentage> {
    if (!input.previousQuotasHeld) {
      return SignedPercentage.create("0")
    }

    const PREVIOUS_DATE = this.addDays(input.targetDate, -1)
    const PREVIOUS_QUOTA = await this.quotaRepository.findByFundIdAndDate(
      input.fundId,
      PREVIOUS_DATE
    )
    if (!PREVIOUS_QUOTA) {
      return SignedPercentage.create("0")
    }

    const CURRENT_QUOTA = await this.quotaRepository.findByFundIdAndDate(
      input.fundId,
      input.targetDate
    )
    if (!CURRENT_QUOTA) {
      return SignedPercentage.create("0")
    }

    const APPLICATIONS =
      await this.applicationRepository.findAllByPositionIdInPeriod(
        input.positionId,
        input.targetDate,
        input.targetDate
      )
    const WITHDRAWALS =
      await this.withdrawalRepository.findAllByPositionIdInPeriod(
        input.positionId,
        input.targetDate,
        input.targetDate
      )

    const DAILY_CALCULATION = this.calculateDailyTotals({
      applications: APPLICATIONS,
      withdrawals: WITHDRAWALS,
    })

    const QUOTAS_TODAY = calculateQuotasHeld({
      lastPeriodQuotaQuantity: input.previousQuotasHeld,
      applicationQuotasQuantity: DAILY_CALCULATION.applicationQuotas,
      withdrawalQuotasQuantity: DAILY_CALCULATION.withdrawalQuotas,
    })

    const DAILY_FACTOR = calculateDailyFactor({
      currentDayQuotaValue: CURRENT_QUOTA.price,
      currentDayQuotaQuantity: QUOTAS_TODAY,
      currentDayCashFlow: DAILY_CALCULATION.cashFlowNet,
      previousDayQuotaValue: PREVIOUS_QUOTA.price,
      previousDayQuotaQuantity: input.previousQuotasHeld,
    })

    return calculateReturn({
      dailyGrowthFactors: [{ value: DAILY_FACTOR }],
    })
  }

  private async calculateTrailingReturn(input: {
    fundId: EntityId
    targetDate: Date
    months: number
  }): Promise<SignedPercentage | null> {
    const WINDOW_START = this.addMonths(input.targetDate, -input.months)
    const QUOTAS = await this.quotaRepository.findAllByFundIdsInPeriod(
      [input.fundId],
      WINDOW_START,
      input.targetDate
    )
    if (QUOTAS.length < 2) {
      return null
    }

    const SORTED = [...QUOTAS].sort(
      (left, right) => left.date.getTime() - right.date.getTime()
    )
    const FACTORS: { value: GrowthFactor }[] = []
    for (let index = 1; index < SORTED.length; index++) {
      FACTORS.push({
        value: GrowthFactor.create(
          SORTED[index].price.value.dividedBy(SORTED[index - 1].price.value)
        ),
      })
    }

    return calculateReturn({ dailyGrowthFactors: FACTORS })
  }

  private async resolveAllocation(input: {
    categoryId: EntityId | null
    portfolioId: EntityId
    previousAllocation: SignedPercentage | null
  }): Promise<SignedPercentage> {
    if (!input.categoryId) {
      return input.previousAllocation ?? SignedPercentage.create("0")
    }

    const RELATIONS = await this.normsPortfoliosRepository.findAllByPortfolioId(
      input.portfolioId
    )
    if (RELATIONS.length === 0) {
      return input.previousAllocation ?? SignedPercentage.create("0")
    }

    const NORMS = await this.normRepository.findAllByCategoryId(
      input.categoryId
    )
    const NORM_IDS = new Set(NORMS.map((norm) => norm.id))
    const MATCHING = RELATIONS.find((relation) => NORM_IDS.has(relation.normId))

    return MATCHING
      ? MATCHING.targetAllocation
      : (input.previousAllocation ?? SignedPercentage.create("0"))
  }

  private addDays(date: Date, days: number): Date {
    const RESULT = new Date(date)
    RESULT.setDate(RESULT.getDate() + days)
    return RESULT
  }

  private addMonths(date: Date, months: number): Date {
    const RESULT = new Date(date)
    RESULT.setMonth(RESULT.getMonth() + months)
    return RESULT
  }
}
