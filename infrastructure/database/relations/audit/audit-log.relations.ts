import { defineRelations } from "drizzle-orm";
import { auditLog, user } from "../../schemas";

/**
 * Defines the relations applicable to the `audit_log` table.
 *
 * An audit entry can optionally belong to exactly one {@link user},
 * linked through the `userId` foreign key.
 */
export const auditLogRelations = defineRelations({ user, auditLog }, (r) => ({
  auditLog: {
    user: r.one.user({
      from: r.auditLog.userId,
      to: r.user.id,
    }),
  },
}));
