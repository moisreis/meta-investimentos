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
    createdAt: timestamp("created_at").defaultNow().notNull(),
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
  ],
);
