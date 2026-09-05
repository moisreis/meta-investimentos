import type { DomainEventDispatcher } from "@/business/domain-events";
import { AuditLog } from "@/business/entities/audit/audit-log.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";
import { AuditLogRepository } from "@/infrastructure/repositories/audit/audit-log.repository";
import { BankRepository } from "@/infrastructure/repositories/bank/bank.repository";
import { BankAccountRepository } from "@/infrastructure/repositories/bank/bank-account.repository";
import { CheckingAccountRepository } from "@/infrastructure/repositories/bank/checking-account.repository";
import { BenchmarkRepository } from "@/infrastructure/repositories/benchmark/benchmark.repository";
import { BenchmarkHistoryRepository } from "@/infrastructure/repositories/benchmark/benchmark-history.repository";
import { CategoryRepository } from "@/infrastructure/repositories/fund/category.repository";
import { CvmImportRepository } from "@/infrastructure/repositories/fund/cvm-import.repository";
import { FundRepository } from "@/infrastructure/repositories/fund/fund.repository";
import { QuotaRepository } from "@/infrastructure/repositories/fund/quota.repository";
import { QuotaImportRepository } from "@/infrastructure/repositories/fund/quota-import.repository";
import { JobRunRepository } from "@/infrastructure/repositories/inngest/job-run.repository";
import { PortfolioPerformanceRepository } from "@/infrastructure/repositories/performance/portfolio-performance.repository";
import { PositionPerformanceRepository } from "@/infrastructure/repositories/performance/position-performance.repository";
import { ApplicationRepository } from "@/infrastructure/repositories/portfolio/application.repository";
import { NormRepository } from "@/infrastructure/repositories/portfolio/norm.repository";
import { NormsPortfoliosRepository } from "@/infrastructure/repositories/portfolio/norms-portfolios.repository";
import { PortfolioRepository } from "@/infrastructure/repositories/portfolio/portfolio.repository";
import { PortfolioPermissionRepository } from "@/infrastructure/repositories/portfolio/portfolio-permission.repository";
import { PositionRepository } from "@/infrastructure/repositories/portfolio/position.repository";
import { TransactionAllocationRepository } from "@/infrastructure/repositories/portfolio/transaction-allocation.repository";
import { WithdrawalRepository } from "@/infrastructure/repositories/portfolio/withdrawal.repository";
import { StatementRepository } from "@/infrastructure/repositories/report/statement.repository";
import { AccountRepository } from "@/infrastructure/repositories/user/account.repository";
import { SessionRepository } from "@/infrastructure/repositories/user/session.repository";
import { UserRepository } from "@/infrastructure/repositories/user/user.repository";
import { VerificationRepository } from "@/infrastructure/repositories/user/verification.repository";

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
   * Repository bound to the transaction for `withdrawal` rows.
   */
  withdrawals: WithdrawalRepository;

  /**
   * Repository bound to the transaction for `transaction_allocation`
   * rows.
   */
  transactionAllocations: TransactionAllocationRepository;

  /**
   * Repository bound to the transaction for `position` rows.
   */
  positions: PositionRepository;

  /**
   * Repository bound to the transaction for `portfolio` rows.
   */
  portfolios: PortfolioRepository;

  /**
   * Repository bound to the transaction for `portfolio_permission`
   * rows.
   */
  portfolioPermissions: PortfolioPermissionRepository;

  /**
   * Repository bound to the transaction for `norm` rows.
   */
  norms: NormRepository;

  /**
   * Repository bound to the transaction for `norms_portfolios` rows.
   */
  normsPortfolios: NormsPortfoliosRepository;

  /**
   * Repository bound to the transaction for `bank` rows.
   */
  banks: BankRepository;

  /**
   * Repository bound to the transaction for `bank_account` rows.
   */
  bankAccounts: BankAccountRepository;

  /**
   * Repository bound to the transaction for `checking_account` rows.
   */
  checkingAccounts: CheckingAccountRepository;

  /**
   * Repository bound to the transaction for `fund` rows.
   */
  funds: FundRepository;

  /**
   * Repository bound to the transaction for `quota` rows.
   */
  quotas: QuotaRepository;

  /**
   * Repository bound to the transaction for `cvm_import` rows.
   */
  cvmImports: CvmImportRepository;

  /**
   * Repository bound to the transaction for `quota_import` rows.
   */
  quotaImports: QuotaImportRepository;

  /**
   * Repository bound to the transaction for `job_run` ledger rows.
   */
  jobRuns: JobRunRepository;

  /**
   * Repository bound to the transaction for `category` rows.
   */
  categories: CategoryRepository;

  /**
   * Repository bound to the transaction for `benchmark` rows.
   */
  benchmarks: BenchmarkRepository;

  /**
   * Repository bound to the transaction for `benchmark_history` rows.
   */
  benchmarkHistories: BenchmarkHistoryRepository;

  /**
   * Repository bound to the transaction for `portfolio_performance`
   * rows.
   */
  portfolioPerformances: PortfolioPerformanceRepository;

  /**
   * Repository bound to the transaction for `position_performance`
   * rows.
   */
  positionPerformances: PositionPerformanceRepository;

  /**
   * Repository bound to the transaction for `statement` rows.
   */
  statements: StatementRepository;

  /**
   * Repository bound to the transaction for `user` rows.
   */
  users: UserRepository;

  /**
   * Repository bound to the transaction for `account` rows.
   */
  accounts: AccountRepository;

  /**
   * Repository bound to the transaction for `session` rows.
   */
  sessions: SessionRepository;

  /**
   * Repository bound to the transaction for `verification` rows.
   */
  verifications: VerificationRepository;

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
 *
 * A unit of work may publish the domain events that entities record
 * during state transitions. When constructed with a
 * {@link DomainEventDispatcher}, it dispatches each saved entity's
 * recorded events inside the transaction, after the entity is audited.
 */
export class UnitOfWork {
  private readonly db: DbClient;
  private readonly domainEventDispatcher?: DomainEventDispatcher;

  /**
   * Creates a `UnitOfWork` bound to the provided database client.
   *
   * When a `domainEventDispatcher` is provided, the unit of work
   * publishes the domain events that a saved entity recorded during a
   * state transition.
   *
   * @param db - The database client that owns the transactions.
   * @param domainEventDispatcher - The dispatcher that publishes
   * domain events, or `undefined` to disable event publishing.
   */
  constructor(db: DbClient, domainEventDispatcher?: DomainEventDispatcher) {
    this.db = db;
    this.domainEventDispatcher = domainEventDispatcher;
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
        withdrawals: this.audited(
          new WithdrawalRepository(tx),
          "Withdrawal",
          USER_ID,
          AUDIT_LOGS,
        ),
        transactionAllocations: this.audited(
          new TransactionAllocationRepository(tx),
          "TransactionAllocation",
          USER_ID,
          AUDIT_LOGS,
        ),
        positions: this.audited(
          new PositionRepository(tx),
          "Position",
          USER_ID,
          AUDIT_LOGS,
        ),
        portfolios: this.audited(
          new PortfolioRepository(tx),
          "Portfolio",
          USER_ID,
          AUDIT_LOGS,
        ),
        portfolioPermissions: this.audited(
          new PortfolioPermissionRepository(tx),
          "PortfolioPermission",
          USER_ID,
          AUDIT_LOGS,
        ),
        norms: this.audited(
          new NormRepository(tx),
          "Norm",
          USER_ID,
          AUDIT_LOGS,
        ),
        normsPortfolios: this.audited(
          new NormsPortfoliosRepository(tx),
          "NormsPortfolios",
          USER_ID,
          AUDIT_LOGS,
        ),
        banks: this.audited(
          new BankRepository(tx),
          "Bank",
          USER_ID,
          AUDIT_LOGS,
        ),
        bankAccounts: this.audited(
          new BankAccountRepository(tx),
          "BankAccount",
          USER_ID,
          AUDIT_LOGS,
        ),
        checkingAccounts: this.audited(
          new CheckingAccountRepository(tx),
          "CheckingAccount",
          USER_ID,
          AUDIT_LOGS,
        ),
        funds: this.audited(
          new FundRepository(tx),
          "Fund",
          USER_ID,
          AUDIT_LOGS,
        ),
        quotas: this.audited(
          new QuotaRepository(tx),
          "Quota",
          USER_ID,
          AUDIT_LOGS,
        ),
        cvmImports: new CvmImportRepository(tx),
        quotaImports: new QuotaImportRepository(tx),
        jobRuns: new JobRunRepository(tx),
        categories: this.audited(
          new CategoryRepository(tx),
          "Category",
          USER_ID,
          AUDIT_LOGS,
        ),
        benchmarks: this.audited(
          new BenchmarkRepository(tx),
          "Benchmark",
          USER_ID,
          AUDIT_LOGS,
        ),
        benchmarkHistories: this.audited(
          new BenchmarkHistoryRepository(tx),
          "BenchmarkHistory",
          USER_ID,
          AUDIT_LOGS,
        ),
        portfolioPerformances: this.audited(
          new PortfolioPerformanceRepository(tx),
          "PortfolioPerformance",
          USER_ID,
          AUDIT_LOGS,
        ),
        positionPerformances: this.audited(
          new PositionPerformanceRepository(tx),
          "PositionPerformance",
          USER_ID,
          AUDIT_LOGS,
        ),
        statements: this.audited(
          new StatementRepository(tx),
          "Statement",
          USER_ID,
          AUDIT_LOGS,
        ),
        users: this.audited(
          new UserRepository(tx),
          "User",
          USER_ID,
          AUDIT_LOGS,
        ),
        accounts: this.audited(
          new AccountRepository(tx),
          "Account",
          USER_ID,
          AUDIT_LOGS,
        ),
        sessions: this.audited(
          new SessionRepository(tx),
          "Session",
          USER_ID,
          AUDIT_LOGS,
        ),
        verifications: this.audited(
          new VerificationRepository(tx),
          "Verification",
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

          if (prop === "save") {
            this.dispatchDomainEvents(args[0], RESULT);
          }

          return RESULT;
        };
      },
    });
  }

  /**
   * Publishes the domain events that a saved entity recorded.
   *
   * A state transition records domain events on the entity it returns.
   * The code pulls those events from the entity provided to `save` and,
   * when a repository reconstructs the entity from the database, from
   * the saved result, and dispatches them through
   * {@link UnitOfWork.domainEventDispatcher}.
   *
   * @param entity - The entity provided to `save`.
   * @param saved - The entity returned by the repository after saving.
   */
  private dispatchDomainEvents(entity: unknown, saved: unknown): void {
    if (!this.domainEventDispatcher) {
      return;
    }

    const SOURCES = [saved, entity];

    for (const source of SOURCES) {
      const COLLECTOR = (source as { pullDomainEvents?: () => object[] })
        .pullDomainEvents;

      if (!COLLECTOR) {
        continue;
      }

      for (const event of COLLECTOR.call(source)) {
        this.domainEventDispatcher.dispatch(
          event as Parameters<typeof this.domainEventDispatcher.dispatch>[0],
        );
      }
    }
  }
}
