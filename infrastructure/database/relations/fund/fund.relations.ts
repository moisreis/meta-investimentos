import { defineRelations } from "drizzle-orm";
import {
  bank,
  benchmark,
  category,
  fund,
  position,
  quota,
} from "../../schemas";

/**
 * Defines the relations applicable to the `fund` table.
 *
 * A fund always belongs to exactly one {@link bank} and can belong to
 * an optional {@link benchmark} and {@link category}. It can own
 * multiple {@link quota} and {@link position} rows, each linked
 * through their foreign keys.
 */
export const fundRelations = defineRelations(
  { fund, bank, benchmark, category, quota, position },
  (r) => ({
    fund: {
      bank: r.one.bank({
        from: r.fund.bankId,
        to: r.bank.id,
      }),
      benchmark: r.one.benchmark({
        from: r.fund.benchmarkId,
        to: r.benchmark.id,
      }),
      category: r.one.category({
        from: r.fund.categoryId,
        to: r.category.id,
      }),
      quotas: r.many.quota({
        from: r.fund.id,
        to: r.quota.fundId,
      }),
      positions: r.many.position({
        from: r.fund.id,
        to: r.position.fundId,
      }),
    },
  }),
);
