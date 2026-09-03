import { ID } from "@/__tests__/__fixtures__";
import { AuditLog as AuditLogEntity } from "@/business/entities/audit/audit-log.entity";
import type { IAuditLog } from "@/business/interfaces/audit/audit-log.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the default audit log fixture for tests.
 *
 * The fixture records an `update` action on the `user`
 * entity. The change field records a name transition from
 * "José" to "José da Silva Junior".
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
 * Represents an alternative audit log fixture for tests.
 *
 * The fixture records a `create` action on the `portfolio`
 * entity. The changes field is `null` because the entity
 * was newly created.
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
 * Represents the entity ID of the default audit log fixture.
 */
export const AUDIT_LOG_ID = ID.AUDIT_LOG.DEFAULT;

/**
 * Represents the entity ID of the alternative audit log fixture.
 */
export const OTHER_AUDIT_LOG_ID = ID.AUDIT_LOG.OTHER;

/**
 * Represents the entity ID of the default user fixture.
 */
export const USER_ID = ID.USER.DEFAULT;

/**
 * Represents the entity ID of the alternative user fixture.
 */
export const OTHER_USER_ID = ID.USER.OTHER;

/**
 * Represents the entity ID of the default portfolio fixture.
 */
export const PORTFOLIO_ID = ID.PORTFOLIO.DEFAULT;

/**
 * Represents the entity name of the default audit log fixture.
 */
export const ENTITY = AUDIT_LOG.entity;

/**
 * Represents the entity ID referenced by the default audit log.
 */
export const ENTITY_ID = AUDIT_LOG.entityId;

/**
 * Represents the action of the default audit log fixture.
 */
export const ACTION = AUDIT_LOG.action;

/**
 * Represents the entity ID of the default audit log fixture.
 */
export const LOG_ID = ID.AUDIT_LOG.DEFAULT;

/**
 * Represents the default audit log fixture as a shorthand alias.
 *
 * This constant is identical to {@link AUDIT_LOG}. Use it in
 * tests that prefer a shorter name.
 */
export const LOG = AUDIT_LOG;

/**
 * Creates an in-memory implementation of the
 * {@link IAuditLog} repository interface.
 *
 * The repository stores {@link AuditLogEntity} instances in
 * memory and supports lookup by ID, by entity name, by
 * entity name and entity ID, and by user ID. Use this
 * factory in unit tests that need a persistent but isolated
 * audit log store.
 *
 * @returns A fresh {@link IAuditLog} instance backed by memory.
 */
export function createInMemoryAuditLogRepository(): IAuditLog {
  const ROWS = new Map<string, AuditLogEntity>();

  return {
    async findById(id) {
      return ROWS.get(id) ?? null;
    },

    async findAllByEntity(entity) {
      const RESULT: AuditLogEntity[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.entity === entity) RESULT.push(ROW);
      }

      return RESULT;
    },

    async findAllByEntityAndEntityId(entity, entityId) {
      const RESULT: AuditLogEntity[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.entity === entity && ROW.entityId === entityId) {
          RESULT.push(ROW);
        }
      }

      return RESULT;
    },

    async findAllByUserId(userId) {
      const RESULT: AuditLogEntity[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.userId === userId) RESULT.push(ROW);
      }

      return RESULT;
    },

    async save(auditLog) {
      ROWS.set(auditLog.id ?? "generated-id", auditLog);

      return auditLog;
    },
  };
}
