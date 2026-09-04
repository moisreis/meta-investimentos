import Decimal from "decimal.js";

import type { Application } from "@/business/entities/portfolio/application.entity";
import type { TransactionAllocation } from "@/business/entities/portfolio/transaction-allocation.entity";
import type { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";

/**
 * A single remaining quota lot, reconstructed from the FIFO allocations.
 */
export interface RemainingLot {
  applicationId: string;
  /** The quotas of the application still held after withdrawals. */
  remainingQuotas: Decimal;
}

/**
 * The result of reconstructing a position's holdings at a point in time.
 */
export interface ReconstructedHoldings {
  /**
   * The total quotas still held by the position.
   */
  quotasHeld: Decimal;
  /**
   * The remaining quota per application (FIFO lots).
   */
  lots: RemainingLot[];
  /**
   * The non-reversed application total (money) as of the snapshot date.
   */
  applicationAmount: Decimal;
  /**
   * The non-reversed withdrawal total (money) as of the snapshot date.
   */
  withdrawalAmount: Decimal;
}

/**
 * Reconstructs a position's holdings at a snapshot date from its
 * applications, withdrawals and FIFO transaction allocations.
 *
 * - Reversed applications and withdrawals are excluded.
 * - Only applications and withdrawals with `date <= snapshotDate` count.
 * - Each application's remaining quotas equal its own quotas minus the
 *   quotas consumed by active (non-reversed, in-window) allocations
 *   against it. Because reversals delete the linked allocations, the
 *   stored allocations already reflect the truly consumed quantities.
 *
 * @param snapshotDate - The date the holdings are reconstructed for.
 * @param applications - All the position's applications.
 * @param withdrawals - All the position's withdrawals.
 * @param allocations - All the position's transaction allocations.
 */
export function reconstructPositionHoldings(
  snapshotDate: Date,
  applications: Application[],
  withdrawals: Withdrawal[],
  allocations: TransactionAllocation[],
): ReconstructedHoldings {
  const TARGET = snapshotDate.getTime();

  const ACTIVE_APPS = applications.filter(
    (APP) => APP.reversedAt === null && APP.date.getTime() <= TARGET,
  );
  const ACTIVE_WITHDRAWALS = withdrawals.filter(
    (W) => W.reversedAt === null && W.date.getTime() <= TARGET,
  );

  const APP_IDS = new Set(ACTIVE_APPS.map((APP) => APP.id?.toString()));
  const WITHDRAWAL_IDS = new Set(
    ACTIVE_WITHDRAWALS.map((W) => W.id?.toString()),
  );

  const CONSUMED = new Map<string, Decimal>();
  let applicationAmount = new Decimal(0);
  let withdrawalAmount = new Decimal(0);

  for (const APP of ACTIVE_APPS) {
    CONSUMED.set(APP.id?.toString() ?? "", new Decimal(0));
    applicationAmount = applicationAmount.plus(APP.amount.value);
  }
  for (const W of ACTIVE_WITHDRAWALS) {
    withdrawalAmount = withdrawalAmount.plus(W.amount.value);
  }

  for (const ALLOCATION of allocations) {
    const APP_ID = ALLOCATION.applicationId.toString();
    const WITHDRAWAL_ID = ALLOCATION.withdrawId.toString();

    if (!APP_IDS.has(APP_ID) || !WITHDRAWAL_IDS.has(WITHDRAWAL_ID)) {
      continue;
    }

    const CURRENT = CONSUMED.get(APP_ID) ?? new Decimal(0);
    CONSUMED.set(APP_ID, CURRENT.plus(ALLOCATION.quotasConsumed.value));
  }

  const LOTS: RemainingLot[] = [];
  let quotasHeld = new Decimal(0);

  for (const APP of ACTIVE_APPS) {
    const APP_ID = APP.id?.toString() ?? "";
    const CONSUMED_VALUE = CONSUMED.get(APP_ID) ?? new Decimal(0);
    const REMAINING = Decimal.max(APP.quotas.value.minus(CONSUMED_VALUE), 0);
    quotasHeld = quotasHeld.plus(REMAINING);
    LOTS.push({ applicationId: APP_ID, remainingQuotas: REMAINING });
  }

  return {
    quotasHeld,
    lots: LOTS,
    applicationAmount,
    withdrawalAmount,
  };
}
