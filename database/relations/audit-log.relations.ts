import { defineRelations } from "drizzle-orm";
import { auditLog, user } from "@db-schemas";

// Defines the relations applicable to the `audit_log` table.
// Links an audit entry to its user.
export const auditLogRelations = defineRelations({ user, auditLog }, (r) => ({
  auditLog: {
    user: r.one.user({
      from: r.auditLog.userId,
      to: r.user.id,
    }),
  },
}));
