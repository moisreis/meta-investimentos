import {
  index,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "../user/user.schema";

/**
 * Defines the `audit_log` table within the `audit` database schema.
 *
 * The table stores the audit trail of mutations performed on domain
 * entities, optionally attributed to the acting user.
 */
export const auditLog = pgSchema("audit").table(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entity: text("entity").notNull(),
    entityId: text("entity_id").notNull(),
    action: text("action").notNull(),
    changes: jsonb("changes"),
    userId: uuid("user_id").references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    /**
     * Speeds up lookups of audit entries by entity and entity id.
     */
    index("audit_log_entity_entity_id_idx").on(table.entity, table.entityId),

    /**
     * Speeds up lookups of audit entries by their acting user.
     */
    index("audit_log_user_id_idx").on(table.userId),

    /**
     * Serves user activity history queries that filter by user and
     * order the results by the most recent entry first.
     */
    index("audit_log_user_id_created_at_idx").on(
      table.userId,
      table.createdAt.desc(),
    ),

    /**
     * Serves time-range queries over the audit trail, for example
     * `WHERE created_at BETWEEN ? AND ?`.
     */
    index("audit_log_created_at_idx").on(table.createdAt),

    /**
     * Serves entity-scoped queries that order the results by the most
     * recent entry first.
     */
    index("audit_log_entity_entity_id_created_at_idx").on(
      table.entity,
      table.entityId,
      table.createdAt.desc(),
    ),
  ],
);
