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
 * @explanation
 * Use this function in the repository layer to build the
 * `AuditLog` entity from a row of the `audit_log` table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const LOG = toDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
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
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `audit_log` table.
 *
 * @param entity - Audit log domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const LOG = toInsert(LOG);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
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
