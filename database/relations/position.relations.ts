import { defineRelations } from "drizzle-orm"
import {
  application,
  fund,
  portfolio,
  position,
  positionPerformance,
  withdrawal,
} from "@db-schemas"

// Connects a position to its portfolio and fund.
// Also links its applications, withdrawals, and performance.
export const positionRelations = defineRelations(
  {
    portfolio,
    fund,
    position,
    application,
    withdrawal,
    positionPerformance,
  },
  (r) => ({
    position: {
      portfolio: r.one.portfolio({
        from: r.position.portfolioId,
        to: r.portfolio.id,
      }),
      fund: r.one.fund({
        from: r.position.fundId,
        to: r.fund.id,
      }),
      applications: r.many.application({
        from: r.position.id,
        to: r.application.positionId,
      }),
      withdrawals: r.many.withdrawal({
        from: r.position.id,
        to: r.withdrawal.positionId,
      }),
      positionPerformances: r.many.positionPerformance({
        from: r.position.id,
        to: r.positionPerformance.positionId,
      }),
    },
  })
)
