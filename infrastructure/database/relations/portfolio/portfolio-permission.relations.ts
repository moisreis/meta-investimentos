import { defineRelations } from "drizzle-orm";
import { portfolio, portfolioPermission, user } from "../../schemas";

/**
 * Defines the relations applicable to the
 * `portfolio_permission` table.
 *
 * A portfolio permission always references exactly one
 * {@link user} (the grantee), one {@link portfolio}, and one
 * {@link user} (the granter).
 */
export const portfolioPermissionRelations = defineRelations(
  {
    user,
    portfolio,
    portfolioPermission,
  },
  (r) => ({
    portfolioPermission: {
      user: r.one.user({
        from: r.portfolioPermission.userId,
        to: r.user.id,
      }),
      portfolio: r.one.portfolio({
        from: r.portfolioPermission.portfolioId,
        to: r.portfolio.id,
      }),
      granter: r.one.user({
        from: r.portfolioPermission.grantedByUserId,
        to: r.user.id,
      }),
    },
  }),
);
