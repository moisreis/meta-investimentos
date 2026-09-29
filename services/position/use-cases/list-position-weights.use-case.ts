import Decimal from "decimal.js"

import type { IApplication } from "@domain/application/interfaces/application.interface"
import { calculateApplicationSum } from "@domain/position/calculators/application-sum.calculator"
import { calculateCashFlowNet } from "@domain/position/calculators/cash-flow-net.calculator"
import { calculatePositionWeight } from "@domain/position/calculators/position-weight.calculator"
import { calculateWithdrawalSum } from "@domain/position/calculators/withdrawal-sum.calculator"
import type { Position } from "@domain/position/entities/position.entity"
import type { IPosition } from "@domain/position/interfaces/position.interface"
import type { IWithdrawal } from "@domain/withdrawal/interfaces/withdrawal.interface"
import {
  EntityId,
  type PositiveMoney,
  SignedMoney,
} from "@/value-objects"

import type { PositionWeightResponseDTO } from "../dto/position-weight-response.dto"

// The share reported for a position of a portfolio that
// holds no money to divide.
const NO_WEIGHT = "0"

// The neutral starting point of a money sum.
const NO_BALANCE = new Decimal(0)

// A movement of money, either an application or a
// withdrawal, reduced to what this use case reads.
interface Movement {
  readonly positionId: EntityId
  readonly amount: PositiveMoney
  readonly reversedAt: Date | null
}

// A persisted position paired with the money it holds.
interface InvestedPosition {
  positionId: EntityId
  portfolioId: EntityId
  fundId: EntityId
  balance: SignedMoney
}

export interface ListPositionWeightsInput {
  portfolioIds: string[]
}

/**
 * @summary
 * Groups the amounts of the movements that still count.
 *
 * @remarks
 * Reversed movements never happened, so they are skipped.
 * Every position id maps to the list of amounts that must
 * be summed for it.
 *
 * @param movements - The applications or withdrawals to
 * group.
 *
 * @returns The active amounts, keyed by position id.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function GroupActiveAmounts(
  movements: Movement[]
): Map<string, PositiveMoney[]> {
  const AMOUNTS = new Map<string, PositiveMoney[]>()

  for (const movement of movements) {
    if (movement.reversedAt) continue

    const CURRENT = AMOUNTS.get(movement.positionId) ?? []

    AMOUNTS.set(movement.positionId, [...CURRENT, movement.amount])
  }

  return AMOUNTS
}

/**
 * @summary
 * Calculates the money currently invested in a position.
 *
 * @remarks
 * The initial balance of the position is the money it was
 * opened with, and every active movement moves that money
 * in or out of it. The result is signed, because redeeming
 * a position that gained can leave it holding less than
 * what was put into it.
 *
 * @param position - The position being measured.
 * @param applications - Active application amounts.
 * @param withdrawals - Active withdrawal amounts.
 *
 * @returns The money invested in the position.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function CalculateInvestedValue(
  position: Position,
  applications: PositiveMoney[],
  withdrawals: PositiveMoney[]
): SignedMoney {
  const CASH_FLOW = calculateCashFlowNet({
    applications: calculateApplicationSum({
      application: applications.map((amount) => ({ value: amount })),
    }),
    withdrawals: calculateWithdrawalSum({
      withdrawal: withdrawals.map((amount) => ({ value: amount })),
    }),
  })

  return SignedMoney.create(
    (position.initialBalance?.value ?? NO_BALANCE).plus(
      CASH_FLOW.value
    )
  )
}

/**
 * @summary
 * Sums the invested value of the positions of each
 * portfolio.
 *
 * @remarks
 * Every position of a portfolio is summed with the same
 * rule, so the reported shares add up to 100% of the
 * portfolio.
 *
 * @param invested - The invested value of each position.
 *
 * @returns The invested value of each portfolio.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function SumByPortfolio(
  invested: InvestedPosition[]
): Map<string, SignedMoney> {
  const TOTALS = new Map<string, SignedMoney>()

  for (const entry of invested) {
    const CURRENT = TOTALS.get(entry.portfolioId)?.value ?? NO_BALANCE

    TOTALS.set(
      entry.portfolioId,
      SignedMoney.create(CURRENT.plus(entry.balance.value))
    )
  }

  return TOTALS
}

/**
 * @summary
 * Derives the share a position holds of its portfolio.
 *
 * @remarks
 * A portfolio that holds no money has no share to report,
 * so every position of it weighs nothing instead of
 * dividing by zero. The balance is compared rather than
 * tested for sign, because **Decimal.js** considers zero
 * positive.
 *
 * @param positionBalance - Money invested in the position.
 * @param portfolioBalance - Money invested in the portfolio.
 *
 * @returns The share, in percent units.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function CalculateWeight(
  positionBalance: SignedMoney,
  portfolioBalance: SignedMoney | undefined
): string {
  if (
    !portfolioBalance ||
    portfolioBalance.value.lessThanOrEqualTo(NO_BALANCE)
  ) {
    return NO_WEIGHT
  }

  return calculatePositionWeight({
    positionBalance,
    portfolioBalance,
  }).value.toString()
}

/**
 * @summary
 * Lists the share every position holds of its portfolio,
 * and the money behind each share.
 *
 * @remarks
 * The share is driven by the money invested in each
 * position, not by the nominal even split persisted on it,
 * so a position holding R$ 90.000 of a R$ 100.000
 * portfolio weighs 90% while its R$ 10.000 sibling weighs
 * 10%. The whole portfolio is loaded, because the share of
 * a position is a ratio against every sibling position.
 *
 * The invested value travels with the share because both
 * come from the same single pass over the movements, and a
 * caller that has to re-derive the money to size a holding
 * would risk reporting a slice that does not add up to the
 * portfolio. The fund id travels too, so a caller can group
 * the holdings by the bank that custodies their fund without
 * loading the positions a second time.
 *
 * @explanation
 * Use this use case to report how much of a portfolio each
 * position represents, such as the share rendered under the
 * fund name of a position picker or the slice a position
 * takes of a distribution chart.
 *
 * @example
 * const WEIGHTS = await USE_CASE.execute({
 *   portfolioIds: ["portfolio-1"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export class ListPositionWeightsUseCase {
  constructor(
    private positionRepository: IPosition,
    private applicationRepository: IApplication,
    private withdrawalRepository: IWithdrawal
  ) {}

  /**
   * @summary
   * Fetches the share and the invested value of every
   * position of the provided portfolios.
   *
   * @remarks
   * Returns an empty array when no portfolio is provided
   * or none of them holds a position.
   *
   * @explanation
   * Use this method to list how much of a portfolio each
   * position holds through the service layer.
   *
   * @param input - Payload with the target portfolio ids.
   *
   * @returns The share and invested value of every matching
   *   position.
   *
   * @example
   * const WEIGHTS = await LIST_WEIGHTS_USE_CASE.execute({
   *   portfolioIds: ["portfolio-1"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-28
   */
  async execute(
    input: ListPositionWeightsInput
  ): Promise<PositionWeightResponseDTO[]> {
    if (input.portfolioIds.length === 0) return []

    const PORTFOLIO_IDS = input.portfolioIds.map((portfolioId) =>
      EntityId.create(portfolioId)
    )

    const POSITIONS =
      await this.positionRepository.findAllByPortfolioIds(PORTFOLIO_IDS)

    if (POSITIONS.length === 0) return []

    const INVESTED = await this.loadInvestedValues(POSITIONS)
    const PORTFOLIO_BALANCES = SumByPortfolio(INVESTED)

    return INVESTED.map((entry) => ({
      positionId: entry.positionId,
      portfolioId: entry.portfolioId,
      fundId: entry.fundId,
      weight: CalculateWeight(
        entry.balance,
        PORTFOLIO_BALANCES.get(entry.portfolioId)
      ),
      investedValue: entry.balance.value.toString(),
    }))
  }

  /**
   * @summary
   * Loads the money invested in each persisted position.
   *
   * @remarks
   * Positions are read without an id when they were never
   * persisted, so they are skipped instead of reported.
   * The applications and the withdrawals of the remaining
   * positions are read in a single bulk query each, in
   * parallel.
   *
   * @explanation
   * Use this method to resolve how much money each
   * position holds before its share is derived.
   *
   * @param positions - The positions of the portfolios.
   *
   * @returns The invested value of each persisted position.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-28
   */
  private async loadInvestedValues(
    positions: Position[]
  ): Promise<InvestedPosition[]> {
    const PERSISTED = positions.flatMap((position) =>
      position.id ? [{ position, positionId: position.id }] : []
    )

    const POSITION_IDS = PERSISTED.map((entry) => entry.positionId)

    const [APPLICATIONS, WITHDRAWALS] = await Promise.all([
      this.applicationRepository.findAllByPositionIds(POSITION_IDS),
      this.withdrawalRepository.findAllByPositionIds(POSITION_IDS),
    ])

    const APPLICATION_AMOUNTS = GroupActiveAmounts(APPLICATIONS)
    const WITHDRAWAL_AMOUNTS = GroupActiveAmounts(WITHDRAWALS)

    return PERSISTED.map((entry) => ({
      positionId: entry.positionId,
      portfolioId: entry.position.portfolioId,
      fundId: entry.position.fundId,
      balance: CalculateInvestedValue(
        entry.position,
        APPLICATION_AMOUNTS.get(entry.positionId) ?? [],
        WITHDRAWAL_AMOUNTS.get(entry.positionId) ?? []
      ),
    }))
  }
}
