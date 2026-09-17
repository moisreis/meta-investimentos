import { AuditLog } from "@domain/audit-log/entities/audit-log.entity"
import { EntityId } from "@/value-objects"
import { auditLog } from "@db-schemas/audit-log.schema"

/**
 * @summary
 * Maps an audit log persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `AuditLog` domain entity.
 */
export function toDomain(row: typeof auditLog.$inferSelect): AuditLog {
  return AuditLog.create(
    {
      entity: row.entity,
      entityId: EntityId.create(row.entityId),
      action: row.action,
      changes: row.changes as Record<string, unknown> | null,
      userId: row.userId ? EntityId.create(row.userId) : null,
      createdAt: row.createdAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps an audit log domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - Audit log domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(entity: AuditLog): typeof auditLog.$inferInsert {
  return {
    entity: entity.entity,
    entityId: entity.entityId,
    action: entity.action,
    changes: entity.changes,
    userId: entity.userId ?? null,
    createdAt: entity.createdAt,
  }
}
