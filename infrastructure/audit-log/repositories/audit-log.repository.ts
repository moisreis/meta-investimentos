import { and, eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { AuditLog } from "@domain/audit-log/entities/audit-log.entity"
import type { IAuditLog } from "@domain/audit-log/interfaces/audit-log.interface"
import { EntityId } from "@/value-objects"
import { auditLog } from "@db-schemas/audit-log.schema"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the audit log persistence contract.
 *
 * @remarks
 * Maps `audit_log` rows to `AuditLog` entities and back.
 * Lookups rely on the primary key, the `(entity, entity_id)`
 * index, and the user id index.
 *
 * @explanation
 * Use this repository for all audit log data access in the
 * infrastructure layer. It translates rows into domain
 * entities and persists entity changes.
 *
 * @example
 * const REPO = new AuditLogRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class AuditLogRepository implements IAuditLog {
  private readonly db: DbClient

  /**
   * @summary
   * Binds the repository to a database client.
   *
   * @remarks
   * The client runs every query issued by the repository.
   *
   * @explanation
   * Use this constructor to provide the **PostgreSQL**
   * client used by all repository operations.
   *
   * @param db - The **Drizzle** database client.
   *
   * @example
   * const REPO = new AuditLogRepository(DB_CLIENT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  constructor(db: DbClient) {
    this.db = db
  }

  /**
   * @summary
   * Maps a database row to a domain entity.
   *
   * @remarks
   * Hydrates value objects through their `create` method.
   *
   * @explanation
   * Converts persisted columns into the domain shape so
   * services work with entities, not raw rows.
   *
   * @param row - The row returned by the query.
   * @returns The hydrated entity.
   *
   * @example
   * const ENTITY = TO_ENTITY(ROW);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toEntity(row: typeof auditLog.$inferSelect): AuditLog {
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
   * Maps an entity to its insert values.
   *
   * @remarks
   * Returns the columns required by the `audit_log` insert
   * statement.
   *
   * @explanation
   * Translates domain properties into the column shape
   * expected by the **Drizzle** insert call.
   *
   * @param entity - The log to persist.
   * @returns The insert values.
   *
   * @example
   * const VALUES = TO_INSERT(LOG);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(entity: AuditLog): typeof auditLog.$inferInsert {
    return {
      entity: entity.entity,
      entityId: entity.entityId,
      action: entity.action,
      changes: entity.changes,
      userId: entity.userId,
      createdAt: entity.createdAt,
    }
  }

  /**
   * @summary
   * Retrieves the audit log with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load an audit log by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the audit log.
   * @returns The entity or `null`.
   *
   * @example
   * const LOG = await AUDIT_LOG_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<AuditLog | null> {
    const [row] = await this.db
      .select()
      .from(auditLog)
      .where(eq(auditLog.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves all logs for the provided entity.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to trace the full history of a given
   * audited entity type.
   *
   * @param entity - The name of the audited entity.
   * @returns The matching entities.
   *
   * @example
   * const LOGS = await AUDIT_LOG_REPO
   *   .findAllByEntity("Bank");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByEntity(entity: string): Promise<AuditLog[]> {
    const rows = await this.db
      .select()
      .from(auditLog)
      .where(eq(auditLog.entity, entity))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all logs for an entity and entity id pair.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load the history of one specific
   * entity instance identified by its type and id.
   *
   * @param entity - The name of the audited entity.
   * @param entityId - The id of the audited instance.
   * @returns The matching entities.
   *
   * @example
   * const LOGS = await AUDIT_LOG_REPO
   *   .findAllByEntityAndEntityId("Bank", "1");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByEntityAndEntityId(
    entity: string,
    entityId: string
  ): Promise<AuditLog[]> {
    const rows = await this.db
      .select()
      .from(auditLog)
      .where(and(eq(auditLog.entity, entity), eq(auditLog.entityId, entityId)))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all logs for the provided entity ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when no rows match.
   *
   * @explanation
   * Use this method to trace the history of many audited
   * entities of the same type in one query.
   *
   * @param entity - The name of the audited entity.
   * @param entityIds - The ids of the audited entities.
   * @returns The matching entities.
   *
   * @example
   * const LOGS = await AUDIT_LOG_REPO
   *   .findAllByEntityAndEntityIds("Bank", IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByEntityAndEntityIds(
    entity: string,
    entityIds: string[]
  ): Promise<AuditLog[]> {
    if (entityIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(auditLog)
      .where(
        and(eq(auditLog.entity, entity), inArray(auditLog.entityId, entityIds))
      )

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all logs performed by the provided user id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to trace all actions performed by one
   * acting user across all audited entity types.
   *
   * @param userId - The id of the acting user.
   * @returns The matching entities.
   *
   * @example
   * const LOGS = await AUDIT_LOG_REPO
   *   .findAllByUserId("user-1");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByUserId(userId: string): Promise<AuditLog[]> {
    const rows = await this.db
      .select()
      .from(auditLog)
      .where(eq(auditLog.userId, userId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all logs performed by the provided user ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when no rows match.
   *
   * @explanation
   * Use this method to trace the actions of many acting
   * users in one query instead of one query per id.
   *
   * @param userIds - The ids of the acting users.
   * @returns The matching entities.
   *
   * @example
   * const LOGS = await AUDIT_LOG_REPO
   *   .findAllByUserIds(USER_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByUserIds(userIds: string[]): Promise<AuditLog[]> {
    if (userIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(auditLog)
      .where(inArray(auditLog.userId, userIds))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Persists the provided audit log.
   *
   * @remarks
   * Audit logs are append-only: the record is always
   * inserted, regardless of whether the entity carries an id.
   *
   * @explanation
   * Use this method to record a new audit log entry. The
   * returned entity includes the database-generated id.
   *
   * @param persisted - The audit log to persist.
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await AUDIT_LOG_REPO.save(LOG);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: AuditLog): Promise<AuditLog> {
    const [row] = await this.db
      .insert(auditLog)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
  }
}
