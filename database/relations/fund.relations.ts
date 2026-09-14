import { defineRelations } from "drizzle-orm";
import {
  bank,
  benchmark,
  category,
  fund,
  position,
  quota,
} from "@db-schemas";

// Defines the relations applicable to the `fund` table.
// Links a fund to its bank, benchmark, category, and positions.
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
