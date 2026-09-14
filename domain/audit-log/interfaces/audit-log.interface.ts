import type { AuditLog } from "@domain/audit-log/entities/audit-log.entity";
import type { EntityId } from "@/value-objects";

/**
 * @summary
 * Defines the repository contract for `AuditLog` entities.
 *
 * @remarks
 * An `IAuditLog` persists and retrieves audit logs.
 * Supports lookup by id, entity, entity id, and user id.
 * Audit logs are immutable and are never removed.
 *
 * @explanation
 * Use this interface to implement data access for audit logs.
 * Persistence implementations map rows to `AuditLog` entities.
 *
 * @example
 * const LOG = await AUDIT_LOG_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IAuditLog {
  /**
   * @summary
   * Retrieves the log with the provided id.
   *
   * @remarks
   * Returns null when no log matches.
   *
   * @explanation
   * Use this method to look up a single log by its
   * unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the log.
   * @returns The entry or `null`.
   *
   * @example
   * const LOG = await AUDIT_LOG_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<AuditLog | null>;

  /**
   * @summary
   * Retrieves all logs that refer to the provided entity.
   *
   * @remarks
   * Returns an empty array when no logs match.
   *
   * @explanation
   * Use this method to list logs that target a specific
   * entity type. Returns an empty array for no matches.
   *
   * @param entity - The name of the audited entity.
   * @returns The matching entries.
   *
   * @example
   * const LOGS = await AUDIT_LOG_REPO.findAllByEntity(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByEntity(entity: string): Promise<AuditLog[]>;

  /**
   * @summary
   * Retrieves all logs that refer to the entity and id.
   *
   * @remarks
   * Returns an empty array when no logs match.
   *
   * @explanation
   * Use this method to list logs that target a record of
   * an entity. Returns an empty array for no matches.
   *
   * @param entity - The name of the audited entity.
   * @param entityId - The unique identifier of the audited entity.
   * @returns The matching entries.
   *
   * @example
   * const LOGS = await AUDIT_LOG_REPO
   *   .findAllByEntityAndEntityId(ENTITY, ENTITY_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByEntityAndEntityId(
    entity: string,
    entityId: string,
  ): Promise<AuditLog[]>;

  /**
   * @summary
   * Retrieves all logs performed by the provided user.
   *
   * @remarks
   * Returns an empty array when no logs match.
   *
   * @explanation
   * Use this method to list logs created by a user.
   * Returns an empty array for no matches.
   *
   * @param userId - The unique identifier of the user.
   * @returns The matching entries.
   *
   * @example
   * const LOGS = await AUDIT_LOG_REPO.findAllByUserId(USER_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByUserId(userId: string): Promise<AuditLog[]>;

  /**
   * @summary
   * Persists the provided log.
   *
   * @remarks
   * Logs are append-only records and are never updated.
   * A new record is inserted with its generated id.
   *
   * @explanation
   * Use this method to record a new audit log entry.
   * The persisted entity with its id is returned.
   *
   * @param auditLog - The log to persist.
   * @returns The persisted entry.
   *
   * @example
   * const LOG = await AUDIT_LOG_REPO.save(NEW_LOG);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(auditLog: AuditLog): Promise<AuditLog>;
}