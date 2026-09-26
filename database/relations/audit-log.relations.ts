import { defineRelations } from "drizzle-orm"
import { auditLog, user } from "@db-schemas"

// Connects an audit entry to its acting user.
export const auditLogRelations = defineRelations(
  { user, auditLog },
  (r) => ({
    auditLog: {
      user: r.one.user({
        from: r.auditLog.userId,
        to: r.user.id,
      }),
    },
  })
)
