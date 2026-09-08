import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { listNotifications } from "@/business/use-cases/audit/list-notifications.uc";

/**
 * Lists the recent audit-registered notifications of the authenticated
 * user.
 *
 * The feed derives from the `audit_log` rows recorded with the acting
 * user: every mutation they performed on a domain entity becomes a
 * candidate notification. Entries are ordered most recent first.
 */
export const GET = apiHandler({
  handler: async ({ actor, runtime }) => {
    const notifications = await listNotifications(runtime.unitOfWork, {
      actorId: actor.actorId,
    });

    return ok({ notifications });
  },
});
