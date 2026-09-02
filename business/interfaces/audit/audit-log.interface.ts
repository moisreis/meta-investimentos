import type { AuditLog } from "@/business/entities/audit/audit-log.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * `AuditLog` entities.
 *
 * An `IAuditLog`:
 * - persists logs through {@link IAuditLog.save}.
 * - retrieves logs by id, entity, entity and entity id, and user id.
 *
 * Audit logs are immutable records and are never removed.
 *
 * Implementations are responsible for mapping database rows to
 * `AuditLog` entities and back.
 */
export interface IAuditLog {
  /**
   * Retrieves the log with the provided id.
   *
   * @param id - The unique identifier of the log.
   * @returns A promise resolving to the `AuditLog` or `null` when
   * not found.
   */
  findById(id: EntityId): Promise<AuditLog | null>;

  /**
   * Retrieves all logs referring to the provided entity.
   *
   * @param entity - The name of the audited entity.
   * @returns A promise resolving to the `AuditLog` entries or an
   * empty array when there are no matches.
   */
  findAllByEntity(entity: string): Promise<AuditLog[]>;

  /**
   * Retrieves all logs referring to the provided entity and entity id.
   *
   * @param entity - The name of the audited entity.
   * @param entityId - The unique identifier of the audited entity.
   * @returns A promise resolving to the `AuditLog` entries or an
   * empty array when there are no matches.
   */
  findAllByEntityAndEntityId(
    entity: string,
    entityId: string,
  ): Promise<AuditLog[]>;

  /**
   * Retrieves all logs performed by the provided user id.
   *
   * @param userId - The unique identifier of the user.
   * @returns A promise resolving to the `AuditLog` entries or an
   * empty array when there are no matches.
   */
  findAllByUserId(userId: string): Promise<AuditLog[]>;

  /**
   * Persists the provided log.
   *
   * When the log has no id, the implementation inserts a new record
   * and the persisted `AuditLog` (with its generated id) is returned.
   * Audit logs are append-only records and are never updated.
   *
   * @param auditLog - The log to persist.
   * @returns A promise resolving to the persisted `AuditLog`.
   */
  save(auditLog: AuditLog): Promise<AuditLog>;
}
