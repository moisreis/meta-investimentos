import type { AuditLog } from "@/business/entities/audit/audit-log.entity";
import type { Bank } from "@/business/entities/bank/bank.entity";
import type { BankAccount } from "@/business/entities/bank/bank-account.entity";
import { BankAccount as BankAccountEntity } from "@/business/entities/bank/bank-account.entity";
import { CheckingAccount as CheckingAccountEntity } from "@/business/entities/bank/checking-account.entity";
import type { Benchmark } from "@/business/entities/benchmark/benchmark.entity";
import type { BenchmarkHistory } from "@/business/entities/benchmark/benchmark-history.entity";
import { BenchmarkHistory as BenchmarkHistoryEntity } from "@/business/entities/benchmark/benchmark-history.entity";
import { CvmImport } from "@/business/entities/cvm/cvm-import.entity";
import type { QuotaImport } from "@/business/entities/cvm/quota-import.entity";
import type { Category } from "@/business/entities/fund/category.entity";
import type { Fund } from "@/business/entities/fund/fund.entity";
import { Quota } from "@/business/entities/fund/quota.entity";
import type { PortfolioPerformance } from "@/business/entities/performance/portfolio-performance.entity";
import { PortfolioPerformance as PortfolioPerformanceEntity } from "@/business/entities/performance/portfolio-performance.entity";
import type { PositionPerformance } from "@/business/entities/performance/position-performance.entity";
import { PositionPerformance as PositionPerformanceEntity } from "@/business/entities/performance/position-performance.entity";
import type { Application } from "@/business/entities/portfolio/application.entity";
import { Application as ApplicationEntity } from "@/business/entities/portfolio/application.entity";
import type { Norm } from "@/business/entities/portfolio/norm.entity";
import type { NormsPortfolios } from "@/business/entities/portfolio/norms-portfolios.entity";
import type { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import { Portfolio as PortfolioEntity } from "@/business/entities/portfolio/portfolio.entity";
import type { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import type { Position } from "@/business/entities/portfolio/position.entity";
import type { TransactionAllocation } from "@/business/entities/portfolio/transaction-allocation.entity";
import { TransactionAllocation as TransactionAllocationEntity } from "@/business/entities/portfolio/transaction-allocation.entity";
import type { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import { Withdrawal as WithdrawalEntity } from "@/business/entities/portfolio/withdrawal.entity";
import type { Statement } from "@/business/entities/report/statement.entity";
import type { User } from "@/business/entities/user/user.entity";
import type { IAuditLog } from "@/business/interfaces/audit/audit-log.interface";
import type { IBank } from "@/business/interfaces/bank/bank.interface";
import type { IBankAccount } from "@/business/interfaces/bank/bank-account.interface";
import type { ICheckingAccount } from "@/business/interfaces/bank/checking-account.interface";
import type { IBenchmark } from "@/business/interfaces/benchmark/benchmark.interface";
import type { IBenchmarkHistory } from "@/business/interfaces/benchmark/benchmark-history.interface";
import type { ICvmImport } from "@/business/interfaces/cvm/cvm-import.interface";
import type { IQuotaImport } from "@/business/interfaces/cvm/quota-import.interface";
import type { ICategory } from "@/business/interfaces/fund/category.interface";
import type { IFund } from "@/business/interfaces/fund/fund.interface";
import type {
  IQuota,
  UpsertQuota,
  UpsertQuotaResult,
} from "@/business/interfaces/fund/quota.interface";
import type { IPortfolioPerformance } from "@/business/interfaces/performance/portfolio-performance.interface";
import type { IPositionPerformance } from "@/business/interfaces/performance/position-performance.interface";
import type { IApplication } from "@/business/interfaces/portfolio/application.interface";
import type { INorm } from "@/business/interfaces/portfolio/norm.interface";
import type { INormsPortfolios } from "@/business/interfaces/portfolio/norms-portfolios.interface";
import type { IPortfolio } from "@/business/interfaces/portfolio/portfolio.interface";
import type { IPortfolioPermission } from "@/business/interfaces/portfolio/portfolio-permission.interface";
import type { IPosition } from "@/business/interfaces/portfolio/position.interface";
import type { ITransactionAllocation } from "@/business/interfaces/portfolio/transaction-allocation.interface";
import type { IWithdrawal } from "@/business/interfaces/portfolio/withdrawal.interface";
import type { IStatement } from "@/business/interfaces/report/statement.interface";
import type { IUser } from "@/business/interfaces/user/user.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import type { UnitOfWorkActor } from "@/infrastructure/unit-of-work";

let sequence = 0;

/**
 * Generates a deterministic UUID-like id for freshly persisted entities.
 */
function generatedId(): EntityId {
  sequence += 1;
  const HEX = sequence.toString(16).padStart(12, "0");
  return EntityId.create(
    `${HEX.slice(0, 8)}-${HEX.slice(8, 12)}-4000-8000-000000000000`,
  );
}

/**
 * A generic in-memory store used by the fake repositories.
 *
 * It keeps entities keyed by id and exposes the underlying map so a
 * {@link FakeUnitOfWork} can snapshot and restore the full state. When a
 * fresh entity (no id) is saved, the store assigns a generated id through
 * the provided `hydrate` callback — mirroring how the real repositories
 * return a persisted entity reconstructed with its database id.
 */
class InMemoryStore<T extends { id?: EntityId }> {
  readonly rows = new Map<EntityId, T>();

  constructor(
    private readonly hydrate: (entity: T, id: EntityId) => T = (entity) =>
      entity,
  ) {}

  async findById(id: EntityId): Promise<T | null> {
    return this.rows.get(id) ?? null;
  }

  async save(entity: T): Promise<T> {
    const ID = (entity.id as EntityId) ?? generatedId();
    const PERSISTED = entity.id ? entity : this.hydrate(entity, ID);
    this.rows.set(ID, PERSISTED);
    return PERSISTED;
  }

  async delete(id: EntityId): Promise<void> {
    this.rows.delete(id);
  }

  match(predicate: (entity: T) => boolean): T[] {
    const MATCHES: T[] = [];
    for (const row of this.rows.values()) {
      if (predicate(row)) MATCHES.push(row);
    }
    return MATCHES;
  }

  findOne(predicate: (entity: T) => boolean): T | null {
    for (const row of this.rows.values()) {
      if (predicate(row)) return row;
    }
    return null;
  }

  async findMany(predicate: (entity: T) => boolean): Promise<T[]> {
    return this.match(predicate);
  }

  async findFirst(predicate: (entity: T) => boolean): Promise<T | null> {
    return this.findOne(predicate);
  }
}

/**
 * The repository surface for `users` required by the access-management
 * use cases. Extends the user contract with a batch lookup so list access
 * can resolve granted user profiles.
 */
type FakeUserRepository = IUser & {
  findAllByIds(ids: EntityId[]): Promise<User[]>;
};
/**
 * A lightweight in-memory replacement for the {@link UnitOfWork} used in
 * use-case tests.
 *
 * The fake keeps the source-of-truth rows in stores. Its {@link run}
 * method snapshots every store before invoking the worker; when the worker
 * throws, the stores are restored so the operation appears to have rolled
 * back atomically; when it resolves, the mutations remain. The actor passed
 * to each run is recorded so tests can assert audit attribution.
 */
export class FakeUnitOfWork {
  private readonly applicationStore = new InMemoryStore<Application>((a, id) =>
    ApplicationEntity.create(
      {
        positionId: a.positionId,
        date: a.date,
        amount: a.amount,
        quotas: a.quotas,
        reversedAt: a.reversedAt,
        reversedByUserId: a.reversedByUserId,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      },
      id,
    ),
  );
  private readonly withdrawalStore = new InMemoryStore<WithdrawalEntity>(
    (w, id) =>
      WithdrawalEntity.create(
        {
          positionId: w.positionId,
          date: w.date,
          amount: w.amount,
          quotas: w.quotas,
          reversedAt: w.reversedAt,
          reversedByUserId: w.reversedByUserId,
          createdAt: w.createdAt,
          updatedAt: w.updatedAt,
        },
        id,
      ),
  );
  private readonly allocationStore = new InMemoryStore<TransactionAllocation>(
    (a, id) =>
      TransactionAllocationEntity.create(
        {
          applicationId: a.applicationId,
          withdrawId: a.withdrawId,
          quotasConsumed: a.quotasConsumed,
          createdAt: a.createdAt,
        },
        id,
      ),
  );
  private readonly positionStore = new InMemoryStore<Position>();
  private readonly portfolioStore = new InMemoryStore<Portfolio>((p, id) =>
    PortfolioEntity.create(
      {
        acronym: p.acronym,
        name: p.name,
        userId: p.userId,
        annualInterestRate: p.annualInterestRate,
        minAllocation: p.minAllocation,
        maxAllocation: p.maxAllocation,
        targetAllocation: p.targetAllocation,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      },
      id,
    ),
  );
  private readonly permissionStore = new InMemoryStore<PortfolioPermission>();
  private readonly userStore = new InMemoryStore<User>();
  private readonly quotaStore = new InMemoryStore<Quota>();
  private readonly categoryStore = new InMemoryStore<Category>();
  private readonly fundStore = new InMemoryStore<Fund>();
  private readonly bankStore = new InMemoryStore<Bank>();
  private readonly bankAccountStore = new InMemoryStore<BankAccount>((ba, id) =>
    BankAccountEntity.create(
      {
        portfolioId: ba.portfolioId,
        bankId: ba.bankId,
        agency: ba.agency,
        accountNumber: ba.accountNumber,
        createdAt: ba.createdAt,
        updatedAt: ba.updatedAt,
      },
      id,
    ),
  );
  private readonly checkingAccountStore =
    new InMemoryStore<CheckingAccountEntity>((ca, id) =>
      CheckingAccountEntity.create(
        {
          bankAccountId: ca.bankAccountId,
          date: ca.date,
          value: ca.value,
        },
        id,
      ),
    );
  private readonly benchmarkStore = new InMemoryStore<Benchmark>();
  private readonly benchmarkHistoryStore = new InMemoryStore<BenchmarkHistory>(
    (bh, id) =>
      BenchmarkHistoryEntity.create(
        {
          benchmarkId: bh.benchmarkId,
          date: bh.date,
          rate: bh.rate,
          createdAt: bh.createdAt,
        },
        id,
      ),
  );
  private readonly positionPerformanceStore =
    new InMemoryStore<PositionPerformance>((pp, id) =>
      PositionPerformanceEntity.create(
        {
          positionId: pp.positionId,
          date: pp.date,
          quotasHeld: pp.quotasHeld,
          patrimony: pp.patrimony,
          applicationTotal: pp.applicationTotal,
          redemptionTotal: pp.redemptionTotal,
          cashFlowNet: pp.cashFlowNet,
          earnings: pp.earnings,
          returnDaily: pp.returnDaily,
          returnMonthly: pp.returnMonthly,
          returnYearly: pp.returnYearly,
          returnLast12m: pp.returnLast12m,
          allocation: pp.allocation,
          createdAt: pp.createdAt,
        },
        id,
      ),
    );
  private readonly portfolioPerformanceStore =
    new InMemoryStore<PortfolioPerformance>((pp, id) =>
      PortfolioPerformanceEntity.create(
        {
          portfolioId: pp.portfolioId,
          date: pp.date,
          quotasHeld: pp.quotasHeld,
          patrimony: pp.patrimony,
          applicationTotal: pp.applicationTotal,
          redemptionTotal: pp.redemptionTotal,
          cashFlowNet: pp.cashFlowNet,
          earnings: pp.earnings,
          returnDaily: pp.returnDaily,
          returnMonthly: pp.returnMonthly,
          returnYearly: pp.returnYearly,
          returnLast12m: pp.returnLast12m,
          target: pp.target,
          cumulativeTarget: pp.cumulativeTarget,
          inflationSpread: pp.inflationSpread,
          riskFreeSpread: pp.riskFreeSpread,
          marketSpread: pp.marketSpread,
          createdAt: pp.createdAt,
        },
        id,
      ),
    );
  private readonly normStore = new InMemoryStore<Norm>();
  private readonly normsPortfoliosStore = new InMemoryStore<NormsPortfolios>();
  private readonly statementStore = new InMemoryStore<Statement>();
  private readonly auditLogStore = new InMemoryStore<AuditLog>();
  private readonly cvmImportStore = new InMemoryStore<CvmImport>((i, id) =>
    CvmImport.create(
      {
        source: i.source,
        status: i.status,
        requestedStart: i.requestedStart,
        requestedEnd: i.requestedEnd,
        requestedFundCnpjs: i.requestedFundCnpjs,
        monthsBack: i.monthsBack,
        filesFound: i.filesFound,
        filesDownloaded: i.filesDownloaded,
        filesUnavailable: i.filesUnavailable,
        recordsMatched: i.recordsMatched,
        recordsImported: i.recordsImported,
        recordsUpserted: i.recordsUpserted,
        recordsSkipped: i.recordsSkipped,
        error: i.error,
        startedAt: i.startedAt,
        finishedAt: i.finishedAt,
        createdAt: i.createdAt,
      },
      id,
    ),
  );
  private readonly quotaImportStore = new InMemoryStore<QuotaImport>();

  private readonly stores = [
    this.applicationStore,
    this.withdrawalStore,
    this.allocationStore,
    this.positionStore,
    this.portfolioStore,
    this.permissionStore,
    this.userStore,
    this.quotaStore,
    this.categoryStore,
    this.fundStore,
    this.bankStore,
    this.bankAccountStore,
    this.checkingAccountStore,
    this.benchmarkStore,
    this.benchmarkHistoryStore,
    this.positionPerformanceStore,
    this.portfolioPerformanceStore,
    this.normStore,
    this.normsPortfoliosStore,
    this.statementStore,
    this.auditLogStore,
    this.cvmImportStore,
    this.quotaImportStore,
  ] as unknown as { rows: Map<EntityId, unknown> }[];

  private readonly lastActors: (UnitOfWorkActor | undefined)[] = [];

  /** The `applications` repository. */
  readonly applications: IApplication = {
    findById: (id) => this.applicationStore.findById(id),
    findAllByPositionId: async (positionId) => {
      const rows = await this.applicationStore.findMany(
        (a) => a.positionId === positionId,
      );
      return rows.sort((a, b) => a.date.getTime() - b.date.getTime());
    },
    findAllByPositionIdInPeriod: async (positionId, startDate, endDate) => {
      const rows = await this.applicationStore.findMany(
        (a) =>
          a.positionId === positionId &&
          a.date.getTime() >= startDate.getTime() &&
          a.date.getTime() <= endDate.getTime(),
      );
      return rows.sort((a, b) => a.date.getTime() - b.date.getTime());
    },
    save: (entity) => this.applicationStore.save(entity),
    delete: (id) => this.applicationStore.delete(id),
  };

  /** The `withdrawals` repository. */
  readonly withdrawals: IWithdrawal = {
    findById: (id) => this.withdrawalStore.findById(id),
    findAllByPositionId: (positionId) =>
      this.withdrawalStore.findMany((w) => w.positionId === positionId),
    findAllByPositionIdInPeriod: (positionId, startDate, endDate) =>
      this.withdrawalStore.findMany(
        (w) =>
          w.positionId === positionId &&
          w.date.getTime() >= startDate.getTime() &&
          w.date.getTime() <= endDate.getTime(),
      ),
    save: (entity) => this.withdrawalStore.save(entity),
    delete: (id) => this.withdrawalStore.delete(id),
  };

  /** The `transactionAllocations` repository. */
  readonly transactionAllocations: ITransactionAllocation = {
    findById: (id) => this.allocationStore.findById(id),
    findAllByApplicationId: (applicationId) =>
      this.allocationStore.findMany((a) => a.applicationId === applicationId),
    findAllByWithdrawalId: (withdrawId) =>
      this.allocationStore.findMany((a) => a.withdrawId === withdrawId),
    save: (entity) => this.allocationStore.save(entity),
    delete: (id) => this.allocationStore.delete(id),
  };

  /** The `positions` repository. */
  readonly positions: IPosition = {
    findById: (id) => this.positionStore.findById(id),
    findAllByPortfolioId: (portfolioId) =>
      this.positionStore.findMany((p) => p.portfolioId === portfolioId),
    findAllByPortfolioIds: (portfolioIds) =>
      this.positionStore.findMany((p) => portfolioIds.includes(p.portfolioId)),
    findAllByFundIds: (fundIds) =>
      this.positionStore.findMany((p) => fundIds.includes(p.fundId)),
    findByPortfolioIdAndFundId: (portfolioId, fundId) =>
      this.positionStore.findFirst(
        (p) => p.portfolioId === portfolioId && p.fundId === fundId,
      ),
    save: (entity) => this.positionStore.save(entity),
    delete: (id) => this.positionStore.delete(id),
  };

  /** The `portfolios` repository. */
  readonly portfolios: IPortfolio & {
    findAllByIds(ids: EntityId[]): Promise<Portfolio[]>;
  } = {
    findById: (id) => this.portfolioStore.findById(id),
    findAllByUserId: (userId) =>
      this.portfolioStore.findMany((p) => p.userId === userId),
    findAllByIds: (ids) =>
      this.portfolioStore.findMany(
        (p) => p.id !== undefined && ids.includes(p.id),
      ),
    save: (entity) => this.portfolioStore.save(entity),
    delete: (id) => this.portfolioStore.delete(id),
  };

  /** The `portfolioPermissions` repository. */
  readonly portfolioPermissions: IPortfolioPermission = {
    findById: (id) => this.permissionStore.findById(id),
    findByUserIdAndPortfolioId: (userId, portfolioId) =>
      this.permissionStore.findFirst(
        (p) => p.userId === userId && p.portfolioId === portfolioId,
      ),
    findAllByUserId: (userId) =>
      this.permissionStore.findMany((p) => p.userId === userId),
    findAllByPortfolioId: (portfolioId) =>
      this.permissionStore.findMany((p) => p.portfolioId === portfolioId),
    save: (entity) => this.permissionStore.save(entity),
    delete: (id) => this.permissionStore.delete(id),
    deleteByUserIdAndPortfolioId: async (userId, portfolioId) => {
      const FOUND = this.permissionStore.findOne(
        (p) => p.userId === userId && p.portfolioId === portfolioId,
      );
      if (FOUND?.id !== undefined) {
        await this.permissionStore.delete(FOUND.id);
      }
    },
  };

  /** The `users` repository. */
  readonly users: FakeUserRepository = {
    findById: (id) => this.userStore.findById(id),
    findByEmail: (email) => this.userStore.findFirst((u) => u.email === email),
    findByCpf: (cpf) => this.userStore.findFirst((u) => u.cpf.value === cpf),
    findAll: () => this.userStore.findMany(() => true),
    findAllByIds: (ids) =>
      this.userStore.findMany((u) => u.id !== undefined && ids.includes(u.id)),
    save: (entity) => this.userStore.save(entity),
    delete: (id) => this.userStore.delete(id),
  };

  /** The `quotas` repository. */
  readonly quotas: IQuota = {
    findById: (id) => this.quotaStore.findById(id),
    findAllByFundId: (fundId) =>
      this.quotaStore.findMany((q) => q.fundId === fundId),
    findByFundIdAndDate: (fundId, date) =>
      this.quotaStore.findFirst(
        (q) => q.fundId === fundId && q.date.getTime() === date.getTime(),
      ),
    findLatestByFundId: async (fundId) => {
      const FOUND = this.quotaStore.match((q) => q.fundId === fundId);
      if (FOUND.length === 0) return null;
      return FOUND.reduce((latest, current) =>
        current.date.getTime() > latest.date.getTime() ? current : latest,
      );
    },
    findAllByFundIds: async (fundIds) => {
      return this.quotaStore.findMany((q) => fundIds.includes(q.fundId));
    },
    findLatestByFundIds: async (fundIds) => {
      const BY_FUND = new Map<string, Quota>();
      for (const Q of this.quotaStore.match((q) =>
        fundIds.includes(q.fundId),
      )) {
        const EXISTING = BY_FUND.get(Q.fundId);
        if (!EXISTING || Q.date.getTime() > EXISTING.date.getTime()) {
          BY_FUND.set(Q.fundId, Q);
        }
      }
      return [...BY_FUND.values()];
    },
    findAllByFundIdsInPeriod: async (fundIds, startDate, endDate) => {
      return this.quotaStore.findMany(
        (q) =>
          fundIds.includes(q.fundId) &&
          q.date.getTime() >= startDate.getTime() &&
          q.date.getTime() <= endDate.getTime(),
      );
    },
    upsertMany: async (
      records: UpsertQuota[],
    ): Promise<UpsertQuotaResult[]> => {
      const RESULTS: UpsertQuotaResult[] = [];
      for (const RECORD of records) {
        const FOUND = this.quotaStore.findOne(
          (q) =>
            q.fundId === EntityId.create(RECORD.fundId) &&
            q.date.getTime() === RECORD.date.getTime(),
        );
        if (FOUND) {
          const UPDATED = FOUND.updatePrice(QuotaPrice.create(RECORD.price));
          await this.quotaStore.save(UPDATED);
          RESULTS.push({ ...RECORD, action: "UPDATE" });
        } else {
          await this.quotaStore.save(
            Quota.create({
              fundId: EntityId.create(RECORD.fundId),
              date: RECORD.date,
              price: QuotaPrice.create(RECORD.price),
            }),
          );
          RESULTS.push({ ...RECORD, action: "INSERT" });
        }
      }
      return RESULTS;
    },
    save: (entity) => this.quotaStore.save(entity),
    delete: (id) => this.quotaStore.delete(id),
  };

  /** The `categories` repository. */
  readonly categories: ICategory = {
    findById: (id) => this.categoryStore.findById(id),
    findByName: (name) => this.categoryStore.findFirst((c) => c.name === name),
    findAll: () => this.categoryStore.findMany(() => true),
    save: (entity) => this.categoryStore.save(entity),
    delete: (id) => this.categoryStore.delete(id),
  };

  /** The `funds` repository. */
  readonly funds: IFund = {
    findById: (id) => this.fundStore.findById(id),
    findByCnpj: (cnpj) =>
      this.fundStore.findFirst((f) => f.cnpj.value === cnpj),
    findAll: () => this.fundStore.findMany(() => true),
    save: (entity) => this.fundStore.save(entity),
    delete: (id) => this.fundStore.delete(id),
  };

  /** The `banks` repository. */
  readonly banks: IBank = {
    findById: (id) => this.bankStore.findById(id),
    findByCode: (code) => this.bankStore.findFirst((b) => b.code === code),
    findAll: () => this.bankStore.findMany(() => true),
    save: (entity) => this.bankStore.save(entity),
    delete: (id) => this.bankStore.delete(id),
  };

  /** The `benchmarks` repository. */
  readonly benchmarks: IBenchmark = {
    findById: (id) => this.benchmarkStore.findById(id),
    findByAcronym: (acronym) =>
      this.benchmarkStore.findFirst((b) => b.acronym === acronym),
    findAll: () => this.benchmarkStore.findMany(() => true),
    save: (entity) => this.benchmarkStore.save(entity),
    delete: (id) => this.benchmarkStore.delete(id),
  };

  /** The `bankAccounts` repository. */
  readonly bankAccounts: IBankAccount = {
    findById: (id) => this.bankAccountStore.findById(id),
    findAllByPortfolioId: (portfolioId) =>
      this.bankAccountStore.findMany((ba) => ba.portfolioId === portfolioId),
    findAllByBankId: (bankId) =>
      this.bankAccountStore.findMany((ba) => ba.bankId === bankId),
    save: (entity) => this.bankAccountStore.save(entity),
    delete: (id) => this.bankAccountStore.delete(id),
  };

  /** The `checkingAccounts` repository. */
  readonly checkingAccounts: ICheckingAccount = {
    findById: (id) => this.checkingAccountStore.findById(id),
    findAllByBankAccountId: (bankAccountId) =>
      this.checkingAccountStore.findMany(
        (ca) => ca.bankAccountId === bankAccountId,
      ),
    findByBankAccountIdAndDate: (bankAccountId, date) =>
      this.checkingAccountStore.findFirst(
        (ca) =>
          ca.bankAccountId === bankAccountId &&
          ca.date.getTime() === date.getTime(),
      ),
    save: (entity) => this.checkingAccountStore.save(entity),
    delete: (id) => this.checkingAccountStore.delete(id),
  };

  /** The `benchmarkHistories` repository. */
  readonly benchmarkHistories: IBenchmarkHistory = {
    findById: (id) => this.benchmarkHistoryStore.findById(id),
    findAllByBenchmarkId: (benchmarkId) =>
      this.benchmarkHistoryStore.findMany(
        (bh) => bh.benchmarkId === benchmarkId,
      ),
    findByBenchmarkIdAndDate: (benchmarkId, date) =>
      this.benchmarkHistoryStore.findFirst(
        (bh) =>
          bh.benchmarkId === benchmarkId &&
          bh.date.getTime() === date.getTime(),
      ),
    save: (entity) => this.benchmarkHistoryStore.save(entity),
    delete: (id) => this.benchmarkHistoryStore.delete(id),
  };

  /** The `positionPerformances` repository. */
  readonly positionPerformances: IPositionPerformance = {
    findById: (id) => this.positionPerformanceStore.findById(id),
    findAllByPositionId: (positionId) =>
      this.positionPerformanceStore.findMany(
        (pp) => pp.positionId === positionId,
      ),
    findByPositionIdAndDate: (positionId, date) =>
      this.positionPerformanceStore.findFirst(
        (pp) =>
          pp.positionId === positionId && pp.date.getTime() === date.getTime(),
      ),
    findLatestByPositionId: async (positionId) => {
      const FOUND = this.positionPerformanceStore.match(
        (pp) => pp.positionId === positionId,
      );
      if (FOUND.length === 0) return null;
      return FOUND.reduce((latest, current) =>
        current.date.getTime() > latest.date.getTime() ? current : latest,
      );
    },
    save: (entity) => this.positionPerformanceStore.save(entity),
    delete: (id) => this.positionPerformanceStore.delete(id),
  };

  /** The `portfolioPerformances` repository. */
  readonly portfolioPerformances: IPortfolioPerformance = {
    findById: (id) => this.portfolioPerformanceStore.findById(id),
    findAllByPortfolioId: (portfolioId) =>
      this.portfolioPerformanceStore.findMany(
        (pp) => pp.portfolioId === portfolioId,
      ),
    findByPortfolioIdAndDate: (portfolioId, date) =>
      this.portfolioPerformanceStore.findFirst(
        (pp) =>
          pp.portfolioId === portfolioId &&
          pp.date.getTime() === date.getTime(),
      ),
    findLatestByPortfolioId: async (portfolioId) => {
      const FOUND = this.portfolioPerformanceStore.match(
        (pp) => pp.portfolioId === portfolioId,
      );
      if (FOUND.length === 0) return null;
      return FOUND.reduce((latest, current) =>
        current.date.getTime() > latest.date.getTime() ? current : latest,
      );
    },
    save: (entity) => this.portfolioPerformanceStore.save(entity),
    delete: (id) => this.portfolioPerformanceStore.delete(id),
  };

  /** The `norms` repository. */
  readonly norms: INorm = {
    findById: (id) => this.normStore.findById(id),
    findAllByCategoryId: (categoryId) =>
      this.normStore.findMany((n) => n.categoryId === categoryId),
    save: (entity) => this.normStore.save(entity),
    delete: (id) => this.normStore.delete(id),
  };

  /** The `normsPortfolios` repository. */
  readonly normsPortfolios: INormsPortfolios = {
    findByNormIdAndPortfolioId: (normId, portfolioId) =>
      this.normsPortfoliosStore.findFirst(
        (r) => r.normId === normId && r.portfolioId === portfolioId,
      ),
    findAllByPortfolioId: (portfolioId) =>
      this.normsPortfoliosStore.findMany((r) => r.portfolioId === portfolioId),
    findAllByNormId: (normId) =>
      this.normsPortfoliosStore.findMany((r) => r.normId === normId),
    save: (entity) => this.normsPortfoliosStore.save(entity),
    delete: async (normId, portfolioId) => {
      const FOUND = this.normsPortfoliosStore.findOne(
        (r) => r.normId === normId && r.portfolioId === portfolioId,
      );
      if (FOUND?.id !== undefined) {
        await this.normsPortfoliosStore.delete(FOUND.id);
      }
    },
  };

  /** The `statements` repository. */
  readonly statements: IStatement = {
    findById: (id) => this.statementStore.findById(id),
    findAllByPortfolioId: (portfolioId) =>
      this.statementStore.findMany((s) => s.portfolioId === portfolioId),
    findAllByGeneratedByUserId: (userId) =>
      this.statementStore.findMany((s) => s.generatedByUserId === userId),
    save: (entity) => this.statementStore.save(entity),
    delete: (id) => this.statementStore.delete(id),
  };

  /** The `cvmImports` repository. */
  readonly cvmImports: ICvmImport = {
    save: (entity) => this.cvmImportStore.save(entity),
    findById: (id) => this.cvmImportStore.findById(id),
    findLatest: async () => {
      const ALL = this.cvmImportStore.match(() => true);
      if (ALL.length === 0) return null;
      return ALL.reduce((latest, current) =>
        (current.startedAt?.getTime() ?? 0) > (latest.startedAt?.getTime() ?? 0)
          ? current
          : latest,
      );
    },
    findFailed: async (limit = 10) => {
      return this.cvmImportStore
        .match((i) => i.status === "FAILED")
        .slice(0, limit);
    },
  };

  /** The `quotaImports` repository. */
  readonly quotaImports: IQuotaImport = {
    saveMany: async (records: QuotaImport[]) => {
      for (const record of records) {
        await this.quotaImportStore.save(record);
      }
    },
    findFundIdsByImportId: async (importId) => {
      const RECORDS = this.quotaImportStore.match(
        (r) => r.importId === importId,
      );
      return [...new Set(RECORDS.map((r) => r.fundId))];
    },
  };

  /** The `auditLogs` repository. */
  readonly auditLogs: IAuditLog & {
    findAll(): Promise<AuditLog[]>;
  } = {
    findById: (id) => this.auditLogStore.findById(id),
    findAllByEntity: (entity) =>
      this.auditLogStore.findMany((l) => l.entity === entity),
    findAllByEntityAndEntityId: (entity, entityId) =>
      this.auditLogStore.findMany(
        (l) => l.entity === entity && l.entityId === entityId,
      ),
    findAllByUserId: (userId) =>
      this.auditLogStore.findMany((l) => l.userId === userId),
    findAll: () => this.auditLogStore.findMany(() => true),
    save: (entity) => this.auditLogStore.save(entity),
  };

  /**
   * The list of actors passed to every {@link run} invocation, in order.
   */
  get ranAsActors(): (UnitOfWorkActor | undefined)[] {
    return this.lastActors;
  }

  /**
   * Returns the actor attributed to the last {@link run} invocation.
   */
  get lastActor(): UnitOfWorkActor | undefined {
    return this.lastActors[this.lastActors.length - 1];
  }

  /**
   * Clears every store and the recorded actors.
   */
  reset(): void {
    for (const store of this.stores) {
      store.rows.clear();
    }
    this.lastActors.length = 0;
  }

  /**
   * Seeds the repositories with the provided entities.
   */
  seed(entities: {
    applications?: Application[];
    withdrawals?: Withdrawal[];
    transactionAllocations?: TransactionAllocation[];
    positions?: Position[];
    portfolios?: Portfolio[];
    portfolioPermissions?: PortfolioPermission[];
    users?: User[];
    quotas?: Quota[];
    categories?: Category[];
    funds?: Fund[];
    banks?: Bank[];
    bankAccounts?: BankAccount[];
    checkingAccounts?: CheckingAccountEntity[];
    benchmarks?: Benchmark[];
    benchmarkHistories?: BenchmarkHistory[];
    positionPerformances?: PositionPerformance[];
    portfolioPerformances?: PortfolioPerformance[];
    norms?: Norm[];
    normsPortfolios?: NormsPortfolios[];
    statements?: Statement[];
    auditLogs?: AuditLog[];
    cvmImports?: CvmImport[];
    quotaImports?: QuotaImport[];
  }): void {
    for (const entity of entities.applications ?? []) {
      void this.applicationStore.save(entity);
    }
    for (const entity of entities.withdrawals ?? []) {
      void this.withdrawalStore.save(entity);
    }
    for (const entity of entities.transactionAllocations ?? []) {
      void this.allocationStore.save(entity);
    }
    for (const entity of entities.positions ?? []) {
      void this.positionStore.save(entity);
    }
    for (const entity of entities.portfolios ?? []) {
      void this.portfolioStore.save(entity);
    }
    for (const entity of entities.portfolioPermissions ?? []) {
      void this.permissionStore.save(entity);
    }
    for (const entity of entities.users ?? []) {
      void this.userStore.save(entity);
    }
    for (const entity of entities.quotas ?? []) {
      void this.quotaStore.save(entity);
    }
    for (const entity of entities.categories ?? []) {
      void this.categoryStore.save(entity);
    }
    for (const entity of entities.funds ?? []) {
      void this.fundStore.save(entity);
    }
    for (const entity of entities.banks ?? []) {
      void this.bankStore.save(entity);
    }
    for (const entity of entities.bankAccounts ?? []) {
      void this.bankAccountStore.save(entity);
    }
    for (const entity of entities.checkingAccounts ?? []) {
      void this.checkingAccountStore.save(entity);
    }
    for (const entity of entities.benchmarks ?? []) {
      void this.benchmarkStore.save(entity);
    }
    for (const entity of entities.benchmarkHistories ?? []) {
      void this.benchmarkHistoryStore.save(entity);
    }
    for (const entity of entities.positionPerformances ?? []) {
      void this.positionPerformanceStore.save(entity);
    }
    for (const entity of entities.portfolioPerformances ?? []) {
      void this.portfolioPerformanceStore.save(entity);
    }
    for (const entity of entities.norms ?? []) {
      void this.normStore.save(entity);
    }
    for (const entity of entities.normsPortfolios ?? []) {
      void this.normsPortfoliosStore.save(entity);
    }
    for (const entity of entities.statements ?? []) {
      void this.statementStore.save(entity);
    }
    for (const entity of entities.auditLogs ?? []) {
      void this.auditLogStore.save(entity);
    }
    for (const entity of entities.cvmImports ?? []) {
      void this.cvmImportStore.save(entity);
    }
    for (const entity of entities.quotaImports ?? []) {
      void this.quotaImportStore.save(entity);
    }
  }

  /**
   * Runs the provided worker against the in-memory repositories.
   *
   * @typeParam T - The type returned by the worker.
   * @param worker - The atomic set of operations to run.
   * @param actor - The user attributed with the audited mutations.
   * @returns A promise resolving to the worker's result.
   */
  async run<T>(
    worker: (tx: FakeUnitOfWork) => Promise<T>,
    actor?: UnitOfWorkActor,
  ): Promise<T> {
    this.lastActors.push(actor);

    const SNAPSHOTS = this.stores.map((store) => new Map(store.rows));

    try {
      return await worker(this);
    } catch (error) {
      for (const store of this.stores) {
        store.rows.clear();
      }
      this.stores.forEach((store, index) => {
        for (const [key, value] of SNAPSHOTS[index]) {
          store.rows.set(key, value);
        }
      });
      throw error;
    }
  }
}
