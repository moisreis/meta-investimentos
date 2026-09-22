import {
  index,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { user } from "@db-schemas/user.schema"

// Stores the audit trail of entity changes.
// Records the acting user, the action, and the change payload.
export const auditLog = pgSchema("audit").table(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entity: text("entity").notNull(),
    entityId: text("entity_id").notNull(),
    action: text("action").notNull(),
    changes: jsonb("changes"),
    userId: text("user_id").references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Speeds up lookups of audit entries by entity and id.
    index("audit_log_entity_entity_id_idx").on(table.entity, table.entityId),

    // Speeds up lookups of audit entries by their acting user.
    index("audit_log_user_id_idx").on(table.userId),

    // Serves user activity history ordered by most recent first.
    index("audit_log_user_id_created_at_idx").on(
      table.userId,
      table.createdAt.desc()
    ),

    // Serves time-range queries over the audit trail.
    index("audit_log_created_at_idx").on(table.createdAt),

    // Serves entity-scoped queries ordered by most recent first.
    index("audit_log_entity_entity_id_created_at_idx").on(
      table.entity,
      table.entityId,
      table.createdAt.desc()
    ),
  ]
)
