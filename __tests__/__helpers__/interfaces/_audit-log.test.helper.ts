import { AuditLog } from "@/business/entities/audit/audit-log.entity";
import type { IAuditLog } from "@/business/interfaces/audit/audit-log.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";

export const LOG_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const ENTITY = "Portfolio";
export const ENTITY_ID = "c47d54e2-4a03-4f71-9c0d-3a58d2c33e90";
export const ACTION = "UPDATED";
export const USER_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

export const LOG = AuditLog.create(
  {
    entity: ENTITY,
    entityId: EntityId.create(ENTITY_ID),
    action: ACTION,
    userId: EntityId.create(USER_ID),
  },
  LOG_ID,
);

export function createInMemoryAuditLogRepository(): IAuditLog {
  const ROWS = new Map<string, AuditLog>();

  return {
    async findById(id: string): Promise<AuditLog | null> {
      return ROWS.get(id) ?? null;
    },

    async findAllByEntity(entity: string): Promise<AuditLog[]> {
      const RESULT: AuditLog[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.entity === entity) RESULT.push(ROW);
      }

      return RESULT;
    },

    async findAllByEntityAndEntityId(
      entity: string,
      entityId: string,
    ): Promise<AuditLog[]> {
      const RESULT: AuditLog[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.entity === entity && ROW.entityId === entityId) {
          RESULT.push(ROW);
        }
      }

      return RESULT;
    },

    async findAllByUserId(userId: string): Promise<AuditLog[]> {
      const RESULT: AuditLog[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.userId === userId) RESULT.push(ROW);
      }

      return RESULT;
    },

    async save(auditLog: AuditLog): Promise<AuditLog> {
      ROWS.set(auditLog.id ?? "generated-id", auditLog);

      return auditLog;
    },
  };
}
