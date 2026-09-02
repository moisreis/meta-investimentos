import { AuditLog } from "@/business/entities/audit/audit-log.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";
import { AuditLogRepository } from "@/infrastructure/repositories/audit/audit-log.repository";
import { PositionPerformanceRepository } from "@/infrastructure/repositories/performance/position-performance.repository";
import { ApplicationRepository } from "@/infrastructure/repositories/portfolio/application.repository";
import { PositionRepository } from "@/infrastructure/repositories/portfolio/position.repository";

import type { DbClient } from "./repositories/types";

/**
 * Identifies the actor whose mutations are audited by a
 * {@link UnitOfWork}.
 */
export interface UnitOfWorkActor {
  /**
   * The id of the acting user, recorded on every audit log row.
   */
  userId: EntityId;
}

/**
 * The transaction-scoped repositories handed to the callback of a
 * {@link UnitOfWork}.
 *
 * Each repository binds to the same database transaction, so every
 * mutation performed through these repositories commits together or
 * rolls back together.
 *
 * The domain repositories are wrapped so that every successful
 * `save()` and `delete()` also appends an audit log row through
 * {@link UnitOfWorkContext.auditLogs} within the same transaction.
 */
export interface UnitOfWorkContext {
  /**
   * Repository bound to the transaction for `application` rows.
   */
  applications: ApplicationRepository;

  /**
   * Repository bound to the transaction for `position` rows.
   */
  positions: PositionRepository;

  /**
   * Repository bound to the transaction for `position_performance`
   * rows.
   */
  positionPerformances: PositionPerformanceRepository;

  /**
   * Repository bound to the transaction for `audit_log` rows.
   *
   * Writes through this repository share the transaction, so audit
   * entries commit or roll back together with the mutations they
   * describe.
   */
  auditLogs: AuditLogRepository;
}

/**
 * Coordinates an atomic set of persistence operations.
 *
 * A `UnitOfWork` wraps a single database transaction. The callback
 * receives a {@link UnitOfWorkContext} whose repositories are bound to
 * that transaction. When the callback resolves, the transaction
 * commits; when it throws, the transaction rolls back and no mutation
 * performed in the callback is persisted.
 *
 * The application layer builds each unit of work from the environment
 * database client and scopes one business operation inside its
 * callback, so many writes happen atomically.
 */
export class UnitOfWork {
  private readonly db: DbClient;

  /**
   * Creates a `UnitOfWork` bound to the provided database client.
   *
   * @param db - The database client that owns the transactions.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * Runs the provided worker inside a single database transaction.
   *
   * The worker receives a set of repositories bound to the same
   * transaction. When it resolves, the transaction commits. When it
   * throws, the transaction rolls back and all of its writes are
   * discarded.
   *
   * Every successful `save()` or `delete()` performed through the
   * worker is audited in the same transaction: an `audit_log` row is
   * appended with the mutated entity id, the `CREATED`, `UPDATED` or
   * `DELETED` action and, when provided, the acting user.
   *
   * @typeParam T - The type returned by the worker.
   * @param worker - The atomic set of operations to run.
   * @param actor - The user attributed with the audited mutations.
   * @returns A promise resolving to the worker's result.
   */
  async run<T>(
    worker: (tx: UnitOfWorkContext) => Promise<T>,
    actor?: UnitOfWorkActor,
  ): Promise<T> {
    const USER_ID = actor?.userId ?? null;

    return this.db.transaction(async (tx) => {
      const AUDIT_LOGS = new AuditLogRepository(tx);
      const CONTEXT: UnitOfWorkContext = {
        applications: this.audited(
          new ApplicationRepository(tx),
          "Application",
          USER_ID,
          AUDIT_LOGS,
        ),
        positions: this.audited(
          new PositionRepository(tx),
          "Position",
          USER_ID,
          AUDIT_LOGS,
        ),
        positionPerformances: this.audited(
          new PositionPerformanceRepository(tx),
          "PositionPerformance",
          USER_ID,
          AUDIT_LOGS,
        ),
        auditLogs: AUDIT_LOGS,
      };

      return worker(CONTEXT);
    });
  }

  /**
   * Wraps a repository so that successful `save()` and `delete()` calls
   * also append an audit log row through the provided audit repository.
   *
   * A save is audited as `CREATED` when the entity carries no id yet
   * and as `UPDATED` otherwise. A delete is always audited as
   * `DELETED`. Only successful mutations produce a log, and the log is
   * written in the same transaction as the mutation.
   *
   * @typeParam T - The repository type to wrap.
   * @param repository - The repository to wrap.
   * @param entityName - The domain name recorded on the audit rows.
   * @param userId - The id of the acting user, or `null` when unknown.
   * @param auditLogs - The audit repository to append rows through.
   * @returns A wrapper of the repository with audit logging.
   */
  private audited<T extends object>(
    repository: T,
    entityName: string,
    userId: EntityId | null,
    auditLogs: AuditLogRepository,
  ): T {
    return new Proxy(repository, {
      get: (target, prop, receiver) => {
        const VALUE = Reflect.get(target, prop, receiver);

        if (typeof VALUE !== "function") {
          return VALUE;
        }

        if (prop !== "save" && prop !== "delete") {
          return VALUE.bind(target);
        }

        return async (...args: unknown[]) => {
          const RESULT = await VALUE.apply(target, args);

          const ENTITY_ID =
            prop === "save"
              ? ((RESULT as { id?: EntityId }).id ??
                (args[0] as { id?: EntityId }).id)
              : (args[0] as EntityId);
          const ACTION =
            prop === "delete"
              ? "DELETED"
              : (args[0] as { id?: EntityId }).id
                ? "UPDATED"
                : "CREATED";

          if (ENTITY_ID) {
            await auditLogs.save(
              AuditLog.create({
                entity: entityName,
                entityId: ENTITY_ID,
                action: ACTION,
                userId,
              }),
            );
          }

          return RESULT;
        };
      },
    });
  }
}
