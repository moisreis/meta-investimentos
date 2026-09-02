import {
  AUDIT_LOG,
  AUDIT_LOG_ID,
  OTHER_AUDIT_LOG,
  OTHER_AUDIT_LOG_ID,
  OTHER_USER_ID,
  PORTFOLIO_ID,
  USER_ID,
} from "@/__tests__/__fixtures__";
import type { IAuditLog } from "@/business/interfaces/audit/audit-log.interface";

export {
  AUDIT_LOG_ID,
  OTHER_AUDIT_LOG_ID,
  USER_ID,
  OTHER_USER_ID,
  PORTFOLIO_ID,
  AUDIT_LOG,
  OTHER_AUDIT_LOG,
};

export const ENTITY = AUDIT_LOG.entity;
export const ENTITY_ID = AUDIT_LOG.entityId;
export const ACTION = AUDIT_LOG.action;
export const LOG_ID = AUDIT_LOG_ID;
export const LOG = AUDIT_LOG;

export function createInMemoryAuditLogRepository(): IAuditLog {
  const ROWS = new Map<
    string,
    import("@/business/entities/audit/audit-log.entity").AuditLog
  >();

  return {
    async findById(id) {
      return ROWS.get(id) ?? null;
    },

    async findAllByEntity(entity) {
      const RESULT: import("@/business/entities/audit/audit-log.entity").AuditLog[] =
        [];

      for (const ROW of ROWS.values()) {
        if (ROW.entity === entity) RESULT.push(ROW);
      }

      return RESULT;
    },

    async findAllByEntityAndEntityId(entity, entityId) {
      const RESULT: import("@/business/entities/audit/audit-log.entity").AuditLog[] =
        [];

      for (const ROW of ROWS.values()) {
        if (ROW.entity === entity && ROW.entityId === entityId) {
          RESULT.push(ROW);
        }
      }

      return RESULT;
    },

    async findAllByUserId(userId) {
      const RESULT: import("@/business/entities/audit/audit-log.entity").AuditLog[] =
        [];

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
