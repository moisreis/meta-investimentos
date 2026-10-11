import Decimal from "decimal.js"

import { calculateApplicationQuotas } from "@domain/application/calculators/application-quotas.calculator"
import type { IApplication } from "@domain/application/interfaces/application.interface"
import type { IPositionPerformance } from "@domain/position-performance/interfaces/position-performance.interface"
import type { PositionPerformance } from "@domain/position-performance/entities/position-performance.entity"
import type { IQuota } from "@domain/quota/interfaces/quota.interface"
import type { IWithdrawal } from "@domain/withdrawal/interfaces/withdrawal.interface"
import {
  type EntityId,
  type PositiveMoney,
  QuotaQuantity,
  SignedMoney,
} from "@/value-objects"

export interface ResolvePositionOpeningInput {
  // The position whose opening is being resolved.
  positionId: EntityId

  // The fund held by the position, used to price its seed.
  fundId: EntityId

  // The position's recorded starting balance, when any.
  initialBalance: PositiveMoney | null

  // The date the starting balance refers to, when any.
  initialBalanceDate: Date | null

  // The day the opening is resolved for.
  targetDate: Date

  // Repository read surface used to find the previous snapshot.
  positionPerformanceRepository: IPositionPerformance

  // Repository read surface used to price the seed.
  quotaRepository: IQuota

  // Repository read surface used to sum the prior applications.
  applicationRepository: IApplication

  // Repository read surface used to sum the prior withdrawals.
  withdrawalRepository: IWithdrawal
}

/**
 * @summary
 * The state a position carries into the target day.
 *
 * @remarks
 * `previous` is the snapshot the day opens from, when one
 * exists. `quotasHeld` and `balance` are the opening quotas
 * and the opening monetary balance of the day, whichever
 * way they were resolved.
 *
 * @explanation
 * Both performance use cases start a day from this state.
 * The daily quotas and balance are the baseline for the
 * held quotas, the earnings and the daily return.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-10
 */
export interface PositionOpening {
  // The previous snapshot, when the day opens from one.
  previous: PositionPerformance | null

  // The quotas held at the start of the target day.
  quotasHeld: QuotaQuantity

  // The monetary balance at the start of the target day.
  balance: SignedMoney
}

/**
 * @summary
 * Resolves the opening state of a position on a target day.
 *
 * @remarks
 * The opening is the previous snapshot when one exists,
 * because it already carries the accumulated quotas and
 * balance. When none exists, the opening is rebuilt from
 * every active application and withdrawal strictly before
 * the target day, seeded by the position's initial balance
 * when one is recorded.
 *
 * @explanation
 * A client may record an opening position as applications
 * dated before the first calculated day, leaving no
 * snapshot behind. Reading only snapshots would then start
 * that first day from zero and misstate its patrimony,
 * earnings and return. Rebuilding the opening from the
 * movements before the day is what keeps the first
 * calculated day honest, and it is shared by the position
 * and portfolio calculations so both agree on the opening.
 *
 * The initial-balance seed is the position's balance as of
 * its date, so only the movements after that date are
 * folded in. A seed whose date has no quota still
 * contributes its monetary balance, but no quotas, since
 * there is no price to convert it with.
 *
 * @param input - The position, the day and the repositories.
 *
 * @returns The opening snapshot, quotas and balance.
 *
 * @example
 * const OPENING = await resolvePositionOpening({
 *   positionId: "position-1",
 *   fundId: "fund-1",
 *   initialBalance: null,
 *   initialBalanceDate: null,
 *   targetDate: new Date("2026-07-31"),
 *   positionPerformanceRepository: POSITION_PERFORMANCE_REPO,
 *   quotaRepository: QUOTA_REPO,
 *   applicationRepository: APPLICATION_REPO,
 *   withdrawalRepository: WITHDRAWAL_REPO,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-10
 */
export async function resolvePositionOpening(
  input: ResolvePositionOpeningInput
): Promise<PositionOpening> {
  const PREVIOUS =
    await input.positionPerformanceRepository.findLatestByPositionId(
      input.positionId,
      input.targetDate
    )

  if (PREVIOUS) {
    return {
      previous: PREVIOUS,
      quotasHeld: PREVIOUS.quotasHeld,
      balance: SignedMoney.create(PREVIOUS.patrimony.value),
    }
  }

  const SEED_DATE =
    input.initialBalance && input.initialBalanceDate
      ? input.initialBalanceDate
      : null

  let seedQuotas = QuotaQuantity.create("0")

  if (SEED_DATE && input.initialBalance) {
    const SEED_QUOTA =
      await input.quotaRepository.findByFundIdAndDate(
        input.fundId,
        SEED_DATE
      )

    if (SEED_QUOTA) {
      seedQuotas = calculateApplicationQuotas({
        application: input.initialBalance,
        quota: SEED_QUOTA.price,
      })
    }
  }

  // The period is inclusive on both ends, so the window
  // starts just after the seed date and ends just before the
  // target day. That leaves the target day's own movements to
  // the daily calculation, which folds them in separately.
  const WINDOW_START = SEED_DATE
    ? new Date(SEED_DATE.getTime() + 1)
    : new Date(0)
  const WINDOW_END = new Date(input.targetDate.getTime() - 1)

  const APPLICATIONS =
    await input.applicationRepository.sumByPositionIdInPeriod(
      input.positionId,
      WINDOW_START,
      WINDOW_END
    )
  const WITHDRAWALS =
    await input.withdrawalRepository.sumByPositionIdInPeriod(
      input.positionId,
      WINDOW_START,
      WINDOW_END
    )

  const seedBalance =
    input.initialBalance?.value ?? new Decimal(0)

  return {
    previous: null,
    quotasHeld: QuotaQuantity.create(
      seedQuotas.value
        .plus(APPLICATIONS.quotas?.value ?? 0)
        .minus(WITHDRAWALS.quotas?.value ?? 0)
    ),
    balance: SignedMoney.create(
      seedBalance
        .plus(APPLICATIONS.amount?.value ?? 0)
        .minus(WITHDRAWALS.amount?.value ?? 0)
    ),
  }
}
