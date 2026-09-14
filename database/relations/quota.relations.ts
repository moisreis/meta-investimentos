import { defineRelations } from "drizzle-orm";
import { fund, quota } from "@db-schemas";

// Defines the relations applicable to the `quota` table.
// Links a quota record to its fund.
export const quotaRelations = defineRelations({ fund, quota }, (r) => ({
  quota: {
    fund: r.one.fund({
      from: r.quota.fundId,
      to: r.fund.id,
    }),
  },
}));
