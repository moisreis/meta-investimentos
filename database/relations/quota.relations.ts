import { defineRelations } from "drizzle-orm"
import { fund, quota } from "@db-schemas"

// Connects a quota record to its fund.
export const quotaRelations = defineRelations({ fund, quota }, (r) => ({
  quota: {
    fund: r.one.fund({
      from: r.quota.fundId,
      to: r.fund.id,
    }),
  },
}))
