import { defineRelations } from "drizzle-orm";
import {
  application,
  fund,
  portfolio,
  position,
  positionPerformance,
  withdrawal,
} from "../../schemas";

/**
 * Defines the relations applicable to the `position` table.
 *
 * A position always belongs to exactly one {@link portfolio} and one
 * {@link fund}, and can own multiple {@link application},
 * {@link withdrawal}, and {@link positionPerformance} rows, each
 * linked through their foreign keys.
 */
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
  }),
);
