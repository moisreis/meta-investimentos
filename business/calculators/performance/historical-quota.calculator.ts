import type { Quota } from "@/business/entities/fund/quota.entity";
import type { QuotaPrice } from "@/business/value-objects/quota-price.vo";

/**
 * Resolves a historical quota price for a target date by carrying forward
 * the most recent quote at or before the target date.
 *
 * When an exact date lacks a quote, the last known quote is used so the
 * recalculation can still produce a consistent snapshot.
 *
 * @param quotas - The fund's quotes, unordered.
 * @param target - The reference date to resolve a price for.
 * @returns The price of the latest quote with `date <= target`, or `null`
 *   when no quote exists at or before the target.
 */
export function resolveQuoteAtOrBefore(
  quotas: Quota[],
  target: Date,
): QuotaPrice | null {
  const TARGET = target.getTime();

  let best: { date: number; price: QuotaPrice } | null = null;

  for (const QUOTA of quotas) {
    const DATE = QUOTA.date.getTime();
    if (DATE > TARGET) {
      continue;
    }
    if (best === null || DATE > best.date) {
      best = { date: DATE, price: QUOTA.price };
    }
  }

  return best?.price ?? null;
}

/**
 * Returns the distinct quote dates within the inclusive range, in
 * ascending order.
 *
 * These are the dates for which a snapshot can be produced because quota
 * data exists. When a target date lacks an exact quote, use
 * {@link resolveQuoteAtOrBefore} to carry the last known price forward.
 */
export function snapshotDates(quotas: Quota[], start: Date, end: Date): Date[] {
  const START = start.getTime();
  const END = end.getTime();

  const BY_DATE = new Map<number, Quota>();

  for (const QUOTA of quotas) {
    const DATE = QUOTA.date.getTime();
    if (DATE < START || DATE > END) {
      continue;
    }
    BY_DATE.set(DATE, QUOTA);
  }

  return [...BY_DATE.keys()].sort((A, B) => A - B).map((D) => new Date(D));
}
