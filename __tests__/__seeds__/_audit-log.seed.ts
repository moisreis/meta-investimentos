import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { AuditLog } from "@/business/entities";
import { AuditLog as AuditLogEntity } from "@/business/entities/audit/audit-log.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { AuditLogRepository } from "@/infrastructure/repositories";
import { seedUserById } from "./_user.seed";

/**
 * Represents the default audit log fixture for tests.
 *
 * Creates an `AuditLog` that records an `update` action
 * on the `user` entity performed by the default user.
 */
export const AUDIT_LOG = AuditLogEntity.create(
  {
    entity: "user",
    entityId: EntityId.create(ID.USER.DEFAULT),
    action: "update",
    changes: { name: { from: "José", to: "José da Silva Junior" } },
    userId: EntityId.create(ID.USER.DEFAULT),
  },
  ID.AUDIT_LOG.DEFAULT,
);

/**
 * Represents a secondary audit log fixture for tests.
 *
 * Creates an `AuditLog` that records a `create` action
 * on the `portfolio` entity performed by the other user.
 */
export const OTHER_AUDIT_LOG = AuditLogEntity.create(
  {
    entity: "portfolio",
    entityId: EntityId.create(ID.PORTFOLIO.DEFAULT),
    action: "create",
    changes: null,
    userId: EntityId.create(ID.USER.OTHER),
  },
  ID.AUDIT_LOG.OTHER,
);

/**
 * Represents the default audit log ID used in tests.
 */
export const AUDIT_LOG_ID = ID.AUDIT_LOG.DEFAULT;

/**
 * Represents the alternative audit log ID used in tests.
 */
export const OTHER_AUDIT_LOG_ID = ID.AUDIT_LOG.OTHER;

/**
 * Seeds the default and other audit log fixtures into
 * the database.
 *
 * Creates the linked user rows first when they do not
 * exist. Saves both fixtures through the
 * {@link AuditLogRepository}.
 *
 * @returns An array containing the seeded `AUDIT_LOG` and
 *          `OTHER_AUDIT_LOG` instances.
 */
export async function seedAuditLogs(): Promise<AuditLog[]> {
  await seedUserById(ID.USER.DEFAULT);
  await seedUserById(ID.USER.OTHER);

  const REPOSITORY = new AuditLogRepository(db);

  return [
    await REPOSITORY.save(AUDIT_LOG),
    await REPOSITORY.save(OTHER_AUDIT_LOG),
  ];
}
