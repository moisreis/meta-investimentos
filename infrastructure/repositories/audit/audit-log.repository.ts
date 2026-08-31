import { and, eq, inArray } from "drizzle-orm";

import { AuditLog } from "@/business/entities/audit/audit-log.entity";
import type { IAuditLog } from "@/business/interfaces/audit/audit-log.interface";
import { auditLog } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link IAuditLog} contract.
 *
 * Maps `audit_log` rows to `AuditLog` entities and back. Lookups rely
 * on the primary key, the `(entity, entity_id)` index and the user id
 * index.
 *
 * Audit logs are append-only records: {@link AuditLogRepository.save}
 * always inserts, and no deletion is exposed.
 *
 * Batch lookups exist so a trail across many audited entities or many
 * acting users is resolved with one query instead of one query per
 * id.
 */
export class AuditLogRepository implements IAuditLog {
  // --------------------------------------
  // FIELDS
  // --------------------------------------

  private readonly db: DbClient;

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates an `AuditLogRepository` bound to the provided database
   * client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  // --------------------------------------
  // MAPPING METHODS
  // --------------------------------------

  /**
   * Maps the provided `audit_log` row to an {@link AuditLog} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `AuditLog` entity.
   */
  private toEntity(row: typeof auditLog.$inferSelect): AuditLog {
    return AuditLog.create(
      {
        entity: row.entity,
        entityId: row.entityId,
        action: row.action,
        changes: row.changes as Record<string, unknown> | null,
        userId: row.userId,
        createdAt: row.createdAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the `audit_log`
   * table.
   *
   * @param entity - The log to persist.
   * @returns The insert values.
   */
  private toInsert(entity: AuditLog): typeof auditLog.$inferInsert {
    return {
      entity: entity.entity,
      entityId: entity.entityId,
      action: entity.action,
      changes: entity.changes,
      userId: entity.userId,
      createdAt: entity.createdAt,
    };
  }

  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the log with the provided id.
   *
   * @see {@link IAuditLog.findById}
   */
  async findById(id: string): Promise<AuditLog | null> {
    const [row] = await this.db
      .select()
      .from(auditLog)
      .where(eq(auditLog.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all logs referring to the provided entity.
   *
   * @see {@link IAuditLog.findAllByEntity}
   */
  async findAllByEntity(entity: string): Promise<AuditLog[]> {
    const rows = await this.db
      .select()
      .from(auditLog)
      .where(eq(auditLog.entity, entity));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all logs referring to the provided entity and entity id.
   *
   * @see {@link IAuditLog.findAllByEntityAndEntityId}
   */
  async findAllByEntityAndEntityId(
    entity: string,
    entityId: string,
  ): Promise<AuditLog[]> {
    const rows = await this.db
      .select()
      .from(auditLog)
      .where(and(eq(auditLog.entity, entity), eq(auditLog.entityId, entityId)));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all logs referring to any of the provided entity ids of
   * the provided entity.
   *
   * Batched lookup for tracing the history of many entities of the
   * same type without falling into an N+1 query pattern.
   *
   * @param entity - The name of the audited entity.
   * @param entityIds - The unique identifiers of the audited entities.
   * @returns A promise resolving to the matching `AuditLog` entities.
   */
  async findAllByEntityAndEntityIds(
    entity: string,
    entityIds: string[],
  ): Promise<AuditLog[]> {
    if (entityIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(auditLog)
      .where(
        and(eq(auditLog.entity, entity), inArray(auditLog.entityId, entityIds)),
      );

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all logs performed by the provided user id.
   *
   * @see {@link IAuditLog.findAllByUserId}
   */
  async findAllByUserId(userId: string): Promise<AuditLog[]> {
    const rows = await this.db
      .select()
      .from(auditLog)
      .where(eq(auditLog.userId, userId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all logs performed by any of the provided user ids.
   *
   * Batched lookup for tracing the actions of many users without
   * falling into an N+1 query pattern.
   *
   * @param userIds - The ids of the acting users.
   * @returns A promise resolving to the matching `AuditLog` entities.
   */
  async findAllByUserIds(userIds: string[]): Promise<AuditLog[]> {
    if (userIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(auditLog)
      .where(inArray(auditLog.userId, userIds));

    return rows.map((row) => this.toEntity(row));
  }

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided log.
   *
   * Audit logs are append-only: the record is always inserted,
   * regardless of whether the entity already carries an id.
   *
   * @see {@link IAuditLog.save}
   */
  async save(persisted: AuditLog): Promise<AuditLog> {
    const [row] = await this.db
      .insert(auditLog)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }
}
