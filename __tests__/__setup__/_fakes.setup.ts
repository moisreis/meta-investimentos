import { Buffer } from "buffer"

import type { IAccount } from "@domain/account/interfaces/account.interface"
import type {
  IApplication,
  ApplicationTotals,
} from "@domain/application/interfaces/application.interface"
import type { IAuditLog } from "@domain/audit-log/interfaces/audit-log.interface"
import type { IBank } from "@domain/bank/interfaces/bank.interface"
import type {
  IBankAccount,
  BankRowCount,
  PortfolioRowCount as BankAccountPortfolioRowCount,
} from "@domain/bank-account/interfaces/bank-account.interface"
import type { IBenchmark } from "@domain/benchmark/interfaces/benchmark.interface"
import type { IBenchmarkHistory } from "@domain/benchmark-history/interfaces/benchmark-history.interface"
import type { ICategory } from "@domain/category/interfaces/category.interface"
import type { ICheckingAccount } from "@domain/checking-account/interfaces/checking-account.interface"
import type {
  IFund,
  CategoryRowCount,
} from "@domain/fund/interfaces/fund.interface"
import type { INorm } from "@domain/norm/interfaces/norm.interface"
import type { INormsPortfolios } from "@domain/norms-portfolio/interfaces/norms-portfolios.interface"
import type { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import type { IPortfolioPerformance } from "@domain/portfolio-performance/interfaces/portfolio-performance.interface"
import type {
  IPosition,
  PortfolioRowCount as PositionPortfolioRowCount,
  FundRowCount,
} from "@domain/position/interfaces/position.interface"
import type { IPositionPerformance } from "@domain/position-performance/interfaces/position-performance.interface"
import type {
  IQuota,
  UpsertQuota,
  UpsertQuotaResult,
} from "@domain/quota/interfaces/quota.interface"
import type { ICvmClient } from "@domain/quota/interfaces/cvm-client.interface"
import type { ISession } from "@domain/session/interfaces/session.interface"
import type { IStatement } from "@domain/statement/interfaces/statement.interface"
import type { ITransactionAllocation } from "@domain/transaction-allocation/interfaces/transaction-allocation.interface"
import type { IUser } from "@domain/user/interfaces/user.interface"
import type { IVerification } from "@domain/verification/interfaces/verification.interface"
import type {
  IWithdrawal,
  WithdrawalTotals,
} from "@domain/withdrawal/interfaces/withdrawal.interface"

import { Account } from "@domain/account/entities/account.entity"
import { Application } from "@domain/application/entities/application.entity"
import { AuditLog } from "@domain/audit-log/entities/audit-log.entity"
import { Bank } from "@domain/bank/entities/bank.entity"
import { BankAccount } from "@domain/bank-account/entities/bank-account.entity"
import { Benchmark } from "@domain/benchmark/entities/benchmark.entity"
import { BenchmarkHistory } from "@domain/benchmark-history/entities/benchmark-history.entity"
import { Category } from "@domain/category/entities/category.entity"
import { CheckingAccount } from "@domain/checking-account/entities/checking-account.entity"
import { Fund } from "@domain/fund/entities/fund.entity"
import { Norm } from "@domain/norm/entities/norm.entity"
import { NormsPortfolios } from "@domain/norms-portfolio/entities/norms-portfolios.entity"
import { Portfolio } from "@domain/portfolio/entities/portfolio.entity"
import { PortfolioPerformance } from "@domain/portfolio-performance/entities/portfolio-performance.entity"
import { Position } from "@domain/position/entities/position.entity"
import { PositionPerformance } from "@domain/position-performance/entities/position-performance.entity"
import { Quota } from "@domain/quota/entities/quota.entity"
import { QuotaPrice } from "@/value-objects/quota-price.vo"
import { Session } from "@domain/session/entities/session.entity"
import { Statement } from "@domain/statement/entities/statement.entity"
import { TransactionAllocation } from "@domain/transaction-allocation/entities/transaction-allocation.entity"
import { User } from "@domain/user/entities/user.entity"
import { Verification } from "@domain/verification/entities/verification.entity"
import { Withdrawal } from "@domain/withdrawal/entities/withdrawal.entity"

import type { EntityId } from "@/value-objects"
import type { CNPJ } from "@/value-objects/cnpj.vo"
import type { CPF } from "@/value-objects/cpf.vo"
import { PositiveMoney as PositiveMoneyVo } from "@/value-objects/positive-money.vo"
import { QuotaQuantity as QuotaQuantityVo } from "@/value-objects/quota-quantity.vo"

import type { CvmCsvRow } from "@services/quota/parsers/cvm-csv.parser"

// -------------------------------------------------------------------
// GENERIC IN-MEMORY STORE
// -------------------------------------------------------------------

/**
 * Anything the in-memory repository can key and rehydrate.
 */
interface EntityWithId {
  id?: EntityId
}

/**
 * Entity factory signature shared by every aggregate.
 */
type EntityFactory<T> = (props: unknown, id?: string) => T

/**
 * In-memory store shared by every fake repository.
 *
 * @remarks
 * Service unit tests mock only at the repository boundary. Each fake mirrors
 * the production interface method-for-method, keeping the filter semantics
 * (paging, ordering, reversed-row filtering) aligned with the real
 * repository so a service test cannot pass against a fake that behaves
 * differently from production.
 */
export interface InMemoryStore<T extends EntityWithId> {
  store: Map<string, T>
  list(): T[]
  save(entity: T): Promise<T>
  delete(id: EntityId): Promise<void>
  deleteByIds(ids: EntityId[]): Promise<void>
}

/**
 * Creates the base in-memory storage used by the fake repositories.
 *
 * @param buildKey - Derives the natural key of a not-yet-persisted entity.
 * @param rehydrate - Recreates the entity with an assigned id.
 * @param props - Extracts the constructor props of an entity.
 * @returns The base storage surface.
 */
function createStore<T extends EntityWithId>(
  buildKey: (entity: T) => string,
  rehydrate: EntityFactory<T>,
  props: (entity: T) => unknown
): InMemoryStore<T> {
  const store = new Map<string, T>()

  return {
    store,
    list(): T[] {
      return Array.from(store.values())
    },
    async save(entity: T): Promise<T> {
      const key = entity.id ?? buildKey(entity)
      const TO_SAVE = entity.id
        ? entity
        : (rehydrate(props(entity), key) as T)

      store.set(key, TO_SAVE)

      return TO_SAVE
    },
    async delete(id: EntityId): Promise<void> {
      store.delete(id)
    },
    async deleteByIds(ids: EntityId[]): Promise<void> {
      for (const id of ids) {
        store.delete(id)
      }
    },
  }
}

/**
 * Returns the subset of a store matching a predicate.
 *
 * @param store - Source store.
 * @param predicate - Row filter.
 * @returns Matching rows in insertion order.
 */
function filter<T extends EntityWithId>(
  store: InMemoryStore<T>,
  predicate: (entity: T) => boolean
): T[] {
  return store.list().filter(predicate)
}

/**
 * Returns the subset of a store restricted to the given ids.
 *
 * @param store - Source store.
 * @param ids - Identifiers to keep.
 * @returns Matching rows, ordered like `ids`.
 */
function filterByIds<T extends EntityWithId>(
  store: InMemoryStore<T>,
  ids: EntityId[]
): T[] {
  return ids
    .map((id) => store.store.get(id))
    .filter((entity): entity is T => entity !== undefined)
}

/**
 * Sorts rows by a comparable timestamp ascending.
 *
 * @param rows - Rows to sort.
 * @param select - Extracts the timestamp.
 * @returns A new sorted array.
 */
function byDateAsc<T>(rows: T[], select: (row: T) => Date): T[] {
  return [...rows].sort(
    (a, b) => select(a).getTime() - select(b).getTime()
  )
}

/**
 * Returns true when a date lies inside an inclusive range.
 *
 * @param date - Date under test.
 * @param start - Lower bound.
 * @param end - Upper bound.
 * @returns Whether the date is within the bounds.
 */
function within(date: Date, start: Date, end: Date): boolean {
  const TIME = date.getTime()

  return TIME >= start.getTime() && TIME <= end.getTime()
}

/**
 * Applies `limit`/`offset` paging options to a row list.
 *
 * @param rows - Rows to page.
 * @param options - Optional paging window.
 * @returns The requested page.
 */
function paginate<T>(
  rows: T[],
  options?: { limit?: number; offset?: number }
): T[] {
  if (options?.limit === undefined) {
    return rows
  }

  const OFFSET = options.offset ?? 0

  return rows.slice(OFFSET, OFFSET + options.limit)
}

// -------------------------------------------------------------------
// REPOSITORY FAKES
// -------------------------------------------------------------------

/**
 * Creates an in-memory `IBank`.
 *
 * @returns Fake repository.
 */
export function createFakeBankRepository(): IBank {
  const BASE = createStore<Bank>(
    (bank) => bank.code,
    (raw, id) => Bank.create(raw as never, id),
    (bank) => ({
      code: bank.code,
      name: bank.name,
      createdAt: bank.createdAt,
      updatedAt: bank.updatedAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findByCode(code) {
      return (
        BASE.list().find((bank) => bank.code === code) ?? null
      )
    },
    async findAll(options) {
      return paginate(BASE.list(), options)
    },
    async findAllByIds(ids) {
      return filterByIds(BASE, ids)
    },
    save: (bank) => BASE.save(bank),
    delete: (id) => BASE.delete(id),
    deleteByIds: (ids) => BASE.deleteByIds(ids),
  }
}

/**
 * Creates an in-memory `ICategory`.
 *
 * @returns Fake repository.
 */
export function createFakeCategoryRepository(): ICategory {
  const BASE = createStore<Category>(
    (category) => category.name,
    (raw, id) => Category.create(raw as never, id),
    (category) => ({
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findByName(name) {
      return (
        BASE.list().find((category) => category.name === name) ??
        null
      )
    },
    async findAll(options) {
      return paginate(BASE.list(), options)
    },
    async findAllByIds(ids) {
      return filterByIds(BASE, ids)
    },
    save: (category) => BASE.save(category),
    delete: (id) => BASE.delete(id),
    deleteByIds: (ids) => BASE.deleteByIds(ids),
  }
}

/**
 * Creates an in-memory `IBenchmark`.
 *
 * @returns Fake repository.
 */
export function createFakeBenchmarkRepository(): IBenchmark {
  const BASE = createStore<Benchmark>(
    (benchmark) => benchmark.acronym,
    (raw, id) => Benchmark.create(raw as never, id),
    (benchmark) => ({
      acronym: benchmark.acronym,
      name: benchmark.name,
      createdAt: benchmark.createdAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findByAcronym(acronym) {
      return (
        BASE.list().find(
          (benchmark) => benchmark.acronym === acronym
        ) ?? null
      )
    },
    async findAll(options) {
      return paginate(BASE.list(), options)
    },
    async findAllByIds(ids) {
      return filterByIds(BASE, ids)
    },
    save: (benchmark) => BASE.save(benchmark),
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `IBenchmarkHistory`.
 *
 * @returns Fake repository.
 */
export function createFakeBenchmarkHistoryRepository(): IBenchmarkHistory {
  const BASE = createStore<BenchmarkHistory>(
    (row) => `${row.benchmarkId}-${row.date.getTime()}`,
    (raw, id) => BenchmarkHistory.create(raw as never, id),
    (row) => ({
      benchmarkId: row.benchmarkId,
      date: row.date,
      rate: row.rate,
      createdAt: row.createdAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAllByBenchmarkId(benchmarkId) {
      return byDateAsc(
        filter(BASE, (row) => row.benchmarkId === benchmarkId),
        (row) => row.date
      )
    },
    async findAllByBenchmarkIds(benchmarkIds) {
      return byDateAsc(
        filter(BASE, (row) =>
          benchmarkIds.includes(row.benchmarkId)
        ),
        (row) => row.date
      )
    },
    async findAllByBenchmarkIdsInPeriod(
      benchmarkIds,
      startDate,
      endDate
    ) {
      return byDateAsc(
        filter(
          BASE,
          (row) =>
            benchmarkIds.includes(row.benchmarkId) &&
            within(row.date, startDate, endDate)
        ),
        (row) => row.date
      )
    },
    async findByBenchmarkIdAndDate(benchmarkId, date) {
      return (
        BASE.list().find(
          (row) =>
            row.benchmarkId === benchmarkId &&
            row.date.getTime() === date.getTime()
        ) ?? null
      )
    },
    save: (row) => BASE.save(row),
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `IUser`.
 *
 * @returns Fake repository.
 */
export function createFakeUserRepository(): IUser {
  const BASE = createStore<User>(
    (user) => user.email,
    (raw, id) => User.create(raw as never, id),
    (user) => ({
      name: user.name,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      cpf: user.cpf,
      role: user.role,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAllByIds(ids) {
      return filterByIds(BASE, ids)
    },
    async findByEmail(email) {
      return (
        BASE.list().find((user) => user.email === email) ?? null
      )
    },
    async findByCpf(cpf: CPF) {
      return (
        BASE.list().find(
          (user) => user.cpf.value === cpf.value
        ) ?? null
      )
    },
    async findAll(options) {
      return paginate(
        [...BASE.list()].sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        ),
        options
      )
    },
    save: (user) => BASE.save(user),
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `ISession`.
 *
 * @returns Fake repository.
 */
export function createFakeSessionRepository(): ISession {
  const BASE = createStore<Session>(
    (session) => session.token,
    (raw, id) => Session.create(raw as never, id),
    (session) => ({
      userId: session.userId,
      token: session.token,
      expiresAt: session.expiresAt,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findByToken(token) {
      return (
        BASE.list().find((session) => session.token === token) ??
        null
      )
    },
    async findAllByUserId(userId) {
      return filter(BASE, (session) => session.userId === userId)
    },
    async findAllByUserIds(userIds) {
      return filter(BASE, (session) =>
        userIds.includes(session.userId)
      )
    },
    save: (session) => BASE.save(session),
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `IAccount`.
 *
 * @returns Fake repository.
 */
export function createFakeAccountRepository(): IAccount {
  const BASE = createStore<Account>(
    (account) => `${account.providerId}-${account.accountId}`,
    (raw, id) => Account.create(raw as never, id),
    (account) => ({
      providerId: account.providerId,
      accountId: account.accountId,
      userId: account.userId,
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
      idToken: account.idToken,
      accessTokenExpiresAt: account.accessTokenExpiresAt,
      refreshTokenExpiresAt: account.refreshTokenExpiresAt,
      scope: account.scope,
      password: account.password,
      issuer: account.issuer,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findByProviderAndAccountId(providerId, accountId) {
      return (
        BASE.list().find(
          (account) =>
            account.providerId === providerId &&
            account.accountId === accountId
        ) ?? null
      )
    },
    async findAllByUserId(userId) {
      return filter(BASE, (account) => account.userId === userId)
    },
    async findAllByUserIds(userIds) {
      return filter(BASE, (account) =>
        userIds.includes(account.userId)
      )
    },
    save: (account) => BASE.save(account),
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `IVerification`.
 *
 * @returns Fake repository.
 */
export function createFakeVerificationRepository(): IVerification {
  const BASE = createStore<Verification>(
    (row) => `${row.identifier}-${row.value}`,
    (raw, id) => Verification.create(raw as never, id),
    (row) => ({
      identifier: row.identifier,
      value: row.value,
      expiresAt: row.expiresAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAllByIdentifier(identifier) {
      return filter(BASE, (row) => row.identifier === identifier)
    },
    async findAllByIdentifiers(identifiers) {
      return filter(BASE, (row) =>
        identifiers.includes(row.identifier)
      )
    },
    save: (row) => BASE.save(row),
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `IAuditLog`.
 *
 * @remarks
 * Mirrors production: `save` always inserts and never updates, matching the
 * append-only semantics of the real repository.
 *
 * @returns Fake repository.
 */
export function createFakeAuditLogRepository(): IAuditLog {
  const BASE = createStore<AuditLog>(
    (row) =>
      `${row.userId}-${row.action}-${row.entity}-${row.entityId}`,
    (raw, id) => AuditLog.create(raw as never, id),
    (row) => ({
      entity: row.entity,
      entityId: row.entityId,
      action: row.action,
      changes: row.changes,
      userId: row.userId,
      createdAt: row.createdAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAll() {
      return [...BASE.list()].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )
    },
    async findAllByEntity(entity) {
      return filter(BASE, (row) => row.entity === entity)
    },
    async findAllByEntityAndEntityId(entity, entityId) {
      return filter(
        BASE,
        (row) =>
          row.entity === entity && row.entityId === entityId
      )
    },
    async findAllByEntityAndEntityIds(entity, entityIds) {
      return filter(
        BASE,
        (row) =>
          row.entity === entity &&
          entityIds.includes(row.entityId)
      )
    },
    async findAllByUserId(userId) {
      return filter(BASE, (row) => row.userId === userId)
    },
    async findAllByUserIds(userIds) {
      return filter(
        BASE,
        (row) =>
          row.userId !== null && userIds.includes(row.userId)
      )
    },
    async save(row) {
      return BASE.save(
        AuditLog.create({
          entity: row.entity,
          entityId: row.entityId,
          action: row.action,
          changes: row.changes,
          userId: row.userId,
          createdAt: row.createdAt,
        })
      )
    },
  }
}

/**
 * Creates an in-memory `IFund`.
 *
 * @returns Fake repository.
 */
export function createFakeFundRepository(): IFund {
  const BASE = createStore<Fund>(
    (fund) => fund.cnpj.value,
    (raw, id) => Fund.create(raw as never, id),
    (fund) => ({
      cnpj: fund.cnpj,
      name: fund.name,
      administrationFee: fund.administrationFee,
      performanceFee: fund.performanceFee,
      bankId: fund.bankId,
      benchmarkId: fund.benchmarkId,
      categoryId: fund.categoryId,
      createdAt: fund.createdAt,
      updatedAt: fund.updatedAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findByCnpj(cnpj: CNPJ) {
      return (
        BASE.list().find(
          (fund) => fund.cnpj.value === cnpj.value
        ) ?? null
      )
    },
    async findAll(options) {
      return paginate(
        [...BASE.list()].sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
        options
      )
    },
    async findAllByIds(ids) {
      return filterByIds(BASE, ids)
    },
    async findAllByBankId(bankId) {
      return filter(BASE, (fund) => fund.bankId === bankId)
    },
    async findAllByBenchmarkId(benchmarkId) {
      return filter(
        BASE,
        (fund) => fund.benchmarkId === benchmarkId
      )
    },
    async findAllByCategoryId(categoryId) {
      return filter(
        BASE,
        (fund) => fund.categoryId === categoryId
      )
    },
    async countByCategoryIds(categoryIds) {
      return categoryIds.flatMap((categoryId) => {
        const count = filter(
          BASE,
          (fund) => fund.categoryId === categoryId
        ).length

        return count === 0
          ? []
          : [{ categoryId, count } satisfies CategoryRowCount]
      })
    },
    save: (fund) => BASE.save(fund),
    delete: (id) => BASE.delete(id),
    deleteByIds: (ids) => BASE.deleteByIds(ids),
  }
}

/**
 * Creates an in-memory `INorm`.
 *
 * @returns Fake repository.
 */
export function createFakeNormRepository(): INorm {
  const BASE = createStore<Norm>(
    (norm) => norm.articleNumber,
    (raw, id) => Norm.create(raw as never, id),
    (norm) => ({
      articleNumber: norm.articleNumber,
      name: norm.name,
      categoryId: norm.categoryId,
      minAllocation: norm.minAllocation,
      maxAllocation: norm.maxAllocation,
      targetAllocation: norm.targetAllocation,
      version: norm.version,
      createdAt: norm.createdAt,
      updatedAt: norm.updatedAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAllByCategoryId(categoryId) {
      return filter(
        BASE,
        (norm) => norm.categoryId === categoryId
      )
    },
    async findAllByCategoryIds(categoryIds) {
      return filter(BASE, (norm) =>
        categoryIds.includes(norm.categoryId)
      )
    },
    save: (norm) => BASE.save(norm),
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `IPortfolio`.
 *
 * @returns Fake repository.
 */
export function createFakePortfolioRepository(): IPortfolio {
  const BASE = createStore<Portfolio>(
    (portfolio) => portfolio.acronym,
    (raw, id) => Portfolio.create(raw as never, id),
    (portfolio) => ({
      acronym: portfolio.acronym,
      name: portfolio.name,
      userId: portfolio.userId,
      annualInterestRate: portfolio.annualInterestRate,
      minAllocation: portfolio.minAllocation,
      maxAllocation: portfolio.maxAllocation,
      targetAllocation: portfolio.targetAllocation,
      version: portfolio.version,
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAllByIds(ids) {
      return filterByIds(BASE, ids)
    },
    async findAllByUserId(userId) {
      return filter(
        BASE,
        (portfolio) => portfolio.userId === userId
      )
    },
    async findAll(options) {
      return paginate(
        [...BASE.list()].sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        ),
        options
      )
    },
    save: (portfolio) => BASE.save(portfolio),
    delete: (id) => BASE.delete(id),
    deleteByIds: (ids) => BASE.deleteByIds(ids),
  }
}

/**
 * Creates an in-memory `INormsPortfolios`.
 *
 * @returns Fake repository.
 */
export function createFakeNormsPortfoliosRepository(): INormsPortfolios {
  const BASE = createStore<NormsPortfolios>(
    (link) => `${link.normId}-${link.portfolioId}`,
    (raw, id) => NormsPortfolios.create(raw as never, id),
    (link) => ({
      normId: link.normId,
      portfolioId: link.portfolioId,
      minAllocation: link.minAllocation,
      maxAllocation: link.maxAllocation,
      targetAllocation: link.targetAllocation,
      version: link.version,
      createdAt: link.createdAt,
    })
  )

  return {
    async findByNormIdAndPortfolioId(normId, portfolioId) {
      return BASE.store.get(`${normId}-${portfolioId}`) ?? null
    },
    async findAllByPortfolioId(portfolioId) {
      return filter(
        BASE,
        (link) => link.portfolioId === portfolioId
      )
    },
    async findAllByPortfolioIds(portfolioIds) {
      return filter(BASE, (link) =>
        portfolioIds.includes(link.portfolioId)
      )
    },
    async findAllByNormId(normId) {
      return filter(BASE, (link) => link.normId === normId)
    },
    save: (link) => BASE.save(link),
    async delete(normId, portfolioId) {
      BASE.store.delete(`${normId}-${portfolioId}`)
    },
  }
}

/**
 * Creates an in-memory `IPosition`.
 *
 * @returns Fake repository.
 */
export function createFakePositionRepository(): IPosition {
  const BASE = createStore<Position>(
    (position) => `${position.portfolioId}-${position.fundId}`,
    (raw, id) => Position.create(raw as never, id),
    (position) => ({
      portfolioId: position.portfolioId,
      fundId: position.fundId,
      initialBalance: position.initialBalance,
      initialBalanceDate: position.initialBalanceDate,
      allocation: position.allocation,
      version: position.version,
      createdAt: position.createdAt,
      updatedAt: position.updatedAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAllByPortfolioId(portfolioId) {
      return filter(
        BASE,
        (position) => position.portfolioId === portfolioId
      )
    },
    async findAllByPortfolioIds(portfolioIds) {
      return filter(BASE, (position) =>
        portfolioIds.includes(position.portfolioId)
      )
    },
    async countByPortfolioIds(portfolioIds) {
      return portfolioIds.flatMap((portfolioId) => {
        const count = filter(
          BASE,
          (position) => position.portfolioId === portfolioId
        ).length

        return count === 0
          ? []
          : [
              {
                portfolioId,
                count,
              } satisfies BankAccountPortfolioRowCount as PositionPortfolioRowCount,
            ]
      })
    },
    async countByFundIds(fundIds) {
      return fundIds.flatMap((fundId) => {
        const count = filter(
          BASE,
          (position) => position.fundId === fundId
        ).length

        return count === 0
          ? []
          : [{ fundId, count } satisfies FundRowCount]
      })
    },
    async findAllByFundIds(fundIds) {
      return filter(BASE, (position) =>
        fundIds.includes(position.fundId)
      )
    },
    async findByPortfolioIdAndFundId(portfolioId, fundId) {
      return BASE.store.get(`${portfolioId}-${fundId}`) ?? null
    },
    save: (position) => BASE.save(position),
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `IBankAccount`.
 *
 * @returns Fake repository.
 */
export function createFakeBankAccountRepository(): IBankAccount {
  const BASE = createStore<BankAccount>(
    (account) =>
      `${account.portfolioId}-${account.agency}-${account.accountNumber}`,
    (raw, id) => BankAccount.create(raw as never, id),
    (account) => ({
      portfolioId: account.portfolioId,
      bankId: account.bankId,
      agency: account.agency,
      accountNumber: account.accountNumber,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAll(options) {
      return paginate(
        [...BASE.list()].sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        ),
        options
      )
    },
    async findAllByPortfolioId(portfolioId) {
      return filter(
        BASE,
        (account) => account.portfolioId === portfolioId
      )
    },
    async findAllByPortfolioIds(portfolioIds) {
      return filter(BASE, (account) =>
        portfolioIds.includes(account.portfolioId)
      )
    },
    async countByPortfolioIds(portfolioIds) {
      return portfolioIds.flatMap((portfolioId) => {
        const count = filter(
          BASE,
          (account) => account.portfolioId === portfolioId
        ).length

        return count === 0
          ? []
          : [
              {
                portfolioId,
                count,
              } satisfies BankAccountPortfolioRowCount,
            ]
      })
    },
    async findAllByBankId(bankId) {
      return filter(BASE, (account) => account.bankId === bankId)
    },
    async findAllByBankIds(bankIds) {
      return filter(BASE, (account) =>
        bankIds.includes(account.bankId)
      )
    },
    async countByBankIds(bankIds) {
      return bankIds.flatMap((bankId) => {
        const count = filter(
          BASE,
          (account) => account.bankId === bankId
        ).length

        return count === 0
          ? []
          : [{ bankId, count } satisfies BankRowCount]
      })
    },
    save: (account) => BASE.save(account),
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `ICheckingAccount`.
 *
 * @returns Fake repository.
 */
export function createFakeCheckingAccountRepository(): ICheckingAccount {
  const BASE = createStore<CheckingAccount>(
    (row) => `${row.bankAccountId}-${row.date.getTime()}`,
    (raw, id) => CheckingAccount.create(raw as never, id),
    (row) => ({
      bankAccountId: row.bankAccountId,
      date: row.date,
      value: row.value,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAll(options) {
      return paginate(
        [...BASE.list()].sort(
          (a, b) => b.date.getTime() - a.date.getTime()
        ),
        options
      )
    },
    async findAllByIds(ids) {
      return filterByIds(BASE, ids)
    },
    async findAllByBankAccountId(bankAccountId) {
      return byDateAsc(
        filter(
          BASE,
          (row) => row.bankAccountId === bankAccountId
        ),
        (row) => row.date
      )
    },
    async findByBankAccountIdAndDate(bankAccountId, date) {
      return (
        BASE.list().find(
          (row) =>
            row.bankAccountId === bankAccountId &&
            row.date.getTime() === date.getTime()
        ) ?? null
      )
    },
    async findAllByBankAccountIds(bankAccountIds) {
      return byDateAsc(
        filter(BASE, (row) =>
          bankAccountIds.includes(row.bankAccountId)
        ),
        (row) => row.date
      )
    },
    async findAllByBankAccountIdsInPeriod(
      bankAccountIds,
      startDate,
      endDate
    ) {
      return byDateAsc(
        filter(
          BASE,
          (row) =>
            bankAccountIds.includes(row.bankAccountId) &&
            within(row.date, startDate, endDate)
        ),
        (row) => row.date
      )
    },
    save: (row) => BASE.save(row),
    delete: (id) => BASE.delete(id),
    deleteByIds: (ids) => BASE.deleteByIds(ids),
  }
}

/**
 * Creates an in-memory `IQuota`.
 *
 * @returns Fake repository.
 */
export function createFakeQuotaRepository(): IQuota {
  const BASE = createStore<Quota>(
    (row) => `${row.fundId}-${row.date.getTime()}`,
    (raw, id) => Quota.create(raw as never, id),
    (row) => ({
      fundId: row.fundId,
      date: row.date,
      price: row.price,
      createdAt: row.createdAt,
    })
  )

  const BY_FUND_AND_DATE = (
    fundId: EntityId,
    date: Date
  ): Quota | null =>
    BASE.store.get(`${fundId}-${date.getTime()}`) ?? null

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAllByFundId(fundId) {
      return byDateAsc(
        filter(BASE, (row) => row.fundId === fundId),
        (row) => row.date
      )
    },
    async findByFundIdAndDate(fundId, date) {
      return BY_FUND_AND_DATE(fundId, date)
    },
    async findLatestByFundId(fundId) {
      const ROWS = byDateAsc(
        filter(BASE, (row) => row.fundId === fundId),
        (row) => row.date
      )

      return ROWS[ROWS.length - 1] ?? null
    },
    async findAllByFundIds(fundIds) {
      return byDateAsc(
        filter(BASE, (row) => fundIds.includes(row.fundId)),
        (row) => row.date
      )
    },
    async findLatestByFundIds(fundIds) {
      return fundIds.flatMap((fundId) => {
        const ROWS = byDateAsc(
          filter(BASE, (row) => row.fundId === fundId),
          (row) => row.date
        )
        const LATEST = ROWS[ROWS.length - 1]

        return LATEST ? [LATEST] : []
      })
    },
    async findAllByFundIdsInPeriod(fundIds, startDate, endDate) {
      return byDateAsc(
        filter(
          BASE,
          (row) =>
            fundIds.includes(row.fundId) &&
            within(row.date, startDate, endDate)
        ),
        (row) => row.date
      )
    },
    async findAllDatesByFundId(fundId) {
      return byDateAsc(
        filter(BASE, (row) => row.fundId === fundId),
        (row) => row.date
      ).map((row) => row.date.toISOString().slice(0, 10))
    },
    save: (row) => BASE.save(row),
    async upsertMany(
      records: UpsertQuota[]
    ): Promise<UpsertQuotaResult[]> {
      return records.map((record) => {
        const EXISTING = BY_FUND_AND_DATE(
          record.fundId as EntityId,
          record.date
        )

        if (EXISTING) {
          void BASE.save(
            Quota.create(
              {
                fundId: record.fundId as EntityId,
                date: record.date,
                price: QuotaPrice.create(record.price),
                createdAt: EXISTING.createdAt,
              },
              EXISTING.id
            )
          )

          return { ...record, action: "UPDATE" as const }
        }

        void BASE.save(
          Quota.create({
            fundId: record.fundId as EntityId,
            date: record.date,
            price: QuotaPrice.create(record.price),
          })
        )

        return { ...record, action: "INSERT" as const }
      })
    },
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `IApplication`.
 *
 * @returns Fake repository.
 */
export function createFakeApplicationRepository(): IApplication {
  const BASE = createStore<Application>(
    (row) => `${row.positionId}-${row.date.getTime()}`,
    (raw, id) => Application.create(raw as never, id),
    (row) => ({
      positionId: row.positionId,
      date: row.date,
      amount: row.amount,
      quotas: row.quotas,
      reversedAt: row.reversedAt,
      reversedByUserId: row.reversedByUserId,
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAllByPositionId(positionId) {
      return byDateAsc(
        filter(BASE, (row) => row.positionId === positionId),
        (row) => row.date
      )
    },
    async findAllByPositionIdInPeriod(
      positionId,
      startDate,
      endDate
    ) {
      return byDateAsc(
        filter(
          BASE,
          (row) =>
            row.positionId === positionId &&
            row.reversedAt === null &&
            within(row.date, startDate, endDate)
        ),
        (row) => row.date
      )
    },
    async findAllByPositionIdsInPeriod(
      positionIds,
      startDate,
      endDate
    ) {
      return byDateAsc(
        filter(
          BASE,
          (row) =>
            positionIds.includes(row.positionId) &&
            row.reversedAt === null &&
            within(row.date, startDate, endDate)
        ),
        (row) => row.date
      )
    },
    async findAllByPositionIds(positionIds) {
      return byDateAsc(
        filter(BASE, (row) =>
          positionIds.includes(row.positionId)
        ),
        (row) => row.date
      )
    },
    async sumByPositionIdInPeriod(
      positionId,
      startDate,
      endDate
    ): Promise<ApplicationTotals> {
      const ROWS = filter(
        BASE,
        (row) =>
          row.positionId === positionId &&
          row.reversedAt === null &&
          within(row.date, startDate, endDate)
      )

      if (ROWS.length === 0) {
        return { amount: null, quotas: null }
      }

      return {
        amount: PositiveMoneyVo.create(
          ROWS.reduce(
            (total, row) => total + row.amount.value.toNumber(),
            0
          ).toFixed(2)
        ),
        quotas: QuotaQuantityVo.create(
          ROWS.reduce(
            (total, row) => total + row.quotas.value.toNumber(),
            0
          ).toFixed(6)
        ),
      }
    },
    save: (row) => BASE.save(row),
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `IWithdrawal`.
 *
 * @returns Fake repository.
 */
export function createFakeWithdrawalRepository(): IWithdrawal {
  const BASE = createStore<Withdrawal>(
    (row) => `${row.positionId}-${row.date.getTime()}`,
    (raw, id) => Withdrawal.create(raw as never, id),
    (row) => ({
      positionId: row.positionId,
      date: row.date,
      amount: row.amount,
      quotas: row.quotas,
      reversedAt: row.reversedAt,
      reversedByUserId: row.reversedByUserId,
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAllByPositionId(positionId) {
      return byDateAsc(
        filter(BASE, (row) => row.positionId === positionId),
        (row) => row.date
      )
    },
    async findAllByPositionIdInPeriod(
      positionId,
      startDate,
      endDate
    ) {
      return byDateAsc(
        filter(
          BASE,
          (row) =>
            row.positionId === positionId &&
            row.reversedAt === null &&
            within(row.date, startDate, endDate)
        ),
        (row) => row.date
      )
    },
    async findAllByPositionIdsInPeriod(
      positionIds,
      startDate,
      endDate
    ) {
      return byDateAsc(
        filter(
          BASE,
          (row) =>
            positionIds.includes(row.positionId) &&
            row.reversedAt === null &&
            within(row.date, startDate, endDate)
        ),
        (row) => row.date
      )
    },
    async findAllByPositionIds(positionIds) {
      return byDateAsc(
        filter(BASE, (row) =>
          positionIds.includes(row.positionId)
        ),
        (row) => row.date
      )
    },
    async sumByPositionIdInPeriod(
      positionId,
      startDate,
      endDate
    ): Promise<WithdrawalTotals> {
      const ROWS = filter(
        BASE,
        (row) =>
          row.positionId === positionId &&
          row.reversedAt === null &&
          within(row.date, startDate, endDate)
      )

      if (ROWS.length === 0) {
        return { amount: null, quotas: null }
      }

      return {
        amount: PositiveMoneyVo.create(
          ROWS.reduce(
            (total, row) => total + row.amount.value.toNumber(),
            0
          ).toFixed(2)
        ),
        quotas: QuotaQuantityVo.create(
          ROWS.reduce(
            (total, row) => total + row.quotas.value.toNumber(),
            0
          ).toFixed(6)
        ),
      }
    },
    save: (row) => BASE.save(row),
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `ITransactionAllocation`.
 *
 * @returns Fake repository.
 */
export function createFakeTransactionAllocationRepository(): ITransactionAllocation {
  const BASE = createStore<TransactionAllocation>(
    (row) => `${row.applicationId}-${row.withdrawId}`,
    (raw, id) => TransactionAllocation.create(raw as never, id),
    (row) => ({
      applicationId: row.applicationId,
      withdrawId: row.withdrawId,
      quotasConsumed: row.quotasConsumed,
      version: row.version,
      createdAt: row.createdAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAllByApplicationId(applicationId) {
      return filter(
        BASE,
        (row) => row.applicationId === applicationId
      )
    },
    async findAllByApplicationIds(applicationIds) {
      return filter(BASE, (row) =>
        applicationIds.includes(row.applicationId)
      )
    },
    async findAllByWithdrawalId(withdrawId) {
      return filter(BASE, (row) => row.withdrawId === withdrawId)
    },
    async findAllByWithdrawIds(withdrawIds) {
      return filter(BASE, (row) =>
        withdrawIds.includes(row.withdrawId)
      )
    },
    async sumQuotasConsumedByApplicationId(applicationId) {
      const ROWS = filter(
        BASE,
        (row) => row.applicationId === applicationId
      )

      if (ROWS.length === 0) {
        return null
      }

      return QuotaQuantityVo.create(
        ROWS.reduce(
          (total, row) =>
            total + row.quotasConsumed.value.toNumber(),
          0
        ).toFixed(6)
      )
    },
    save: (row) => BASE.save(row),
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `IPortfolioPerformance`.
 *
 * @returns Fake repository.
 */
export function createFakePortfolioPerformanceRepository(): IPortfolioPerformance {
  const BASE = createStore<PortfolioPerformance>(
    (row) => `${row.portfolioId}-${row.date.getTime()}`,
    (raw, id) => PortfolioPerformance.create(raw as never, id),
    (row) => ({
      portfolioId: row.portfolioId,
      date: row.date,
      quotasHeld: row.quotasHeld,
      patrimony: row.patrimony,
      applicationTotal: row.applicationTotal,
      redemptionTotal: row.redemptionTotal,
      cashFlowNet: row.cashFlowNet,
      earnings: row.earnings,
      returnDaily: row.returnDaily,
      returnMonthly: row.returnMonthly,
      returnYearly: row.returnYearly,
      returnLast12m: row.returnLast12m,
      target: row.target,
      cumulativeTarget: row.cumulativeTarget,
      inflationSpread: row.inflationSpread,
      riskFreeSpread: row.riskFreeSpread,
      marketSpread: row.marketSpread,
      createdAt: row.createdAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAllByPortfolioId(portfolioId) {
      return byDateAsc(
        filter(BASE, (row) => row.portfolioId === portfolioId),
        (row) => row.date
      )
    },
    async findAllByPortfolioIds(portfolioIds) {
      return byDateAsc(
        filter(BASE, (row) =>
          portfolioIds.includes(row.portfolioId)
        ),
        (row) => row.date
      )
    },
    async findByPortfolioIdAndDate(portfolioId, date) {
      return (
        BASE.list().find(
          (row) =>
            row.portfolioId === portfolioId &&
            row.date.getTime() === date.getTime()
        ) ?? null
      )
    },
    async findLatestByPortfolioId(portfolioId, before) {
      const ROWS = byDateAsc(
        filter(
          BASE,
          (row) =>
            row.portfolioId === portfolioId &&
            row.date.getTime() < before.getTime()
        ),
        (row) => row.date
      )

      return ROWS[ROWS.length - 1] ?? null
    },
    async findLatestByPortfolioIds(portfolioIds) {
      return portfolioIds.flatMap((portfolioId) => {
        const ROWS = byDateAsc(
          filter(BASE, (row) => row.portfolioId === portfolioId),
          (row) => row.date
        )

        return ROWS.length === 0 ? [] : [ROWS[ROWS.length - 1]]
      })
    },
    async findLatestByPortfolioIdsInRange(
      portfolioIds,
      from,
      to
    ) {
      return portfolioIds.flatMap((portfolioId) => {
        const ROWS = byDateAsc(
          filter(
            BASE,
            (row) =>
              row.portfolioId === portfolioId &&
              within(row.date, from, to)
          ),
          (row) => row.date
        )

        return ROWS.length === 0 ? [] : [ROWS[ROWS.length - 1]]
      })
    },
    async findDistinctDatesByPortfolioIds(portfolioIds) {
      const DATES = new Set<number>()

      for (const row of filter(BASE, (candidate) =>
        portfolioIds.includes(candidate.portfolioId)
      )) {
        DATES.add(row.date.getTime())
      }

      return Array.from(DATES)
        .sort((a, b) => a - b)
        .map((time) => new Date(time))
    },
    save: (row) => BASE.save(row),
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `IPositionPerformance`.
 *
 * @returns Fake repository.
 */
export function createFakePositionPerformanceRepository(): IPositionPerformance {
  const BASE = createStore<PositionPerformance>(
    (row) => `${row.positionId}-${row.date.getTime()}`,
    (raw, id) => PositionPerformance.create(raw as never, id),
    (row) => ({
      positionId: row.positionId,
      date: row.date,
      quotasHeld: row.quotasHeld,
      patrimony: row.patrimony,
      applicationTotal: row.applicationTotal,
      redemptionTotal: row.redemptionTotal,
      cashFlowNet: row.cashFlowNet,
      earnings: row.earnings,
      returnDaily: row.returnDaily,
      returnMonthly: row.returnMonthly,
      returnYearly: row.returnYearly,
      returnLast12m: row.returnLast12m,
      allocation: row.allocation,
      createdAt: row.createdAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAllByPositionId(positionId) {
      return byDateAsc(
        filter(BASE, (row) => row.positionId === positionId),
        (row) => row.date
      )
    },
    async findAllByPositionIds(positionIds) {
      return byDateAsc(
        filter(BASE, (row) =>
          positionIds.includes(row.positionId)
        ),
        (row) => row.date
      )
    },
    async findByPositionIdAndDate(positionId, date) {
      return (
        BASE.list().find(
          (row) =>
            row.positionId === positionId &&
            row.date.getTime() === date.getTime()
        ) ?? null
      )
    },
    async findLatestByPositionId(positionId, before) {
      const ROWS = byDateAsc(
        filter(
          BASE,
          (row) =>
            row.positionId === positionId &&
            row.date.getTime() < before.getTime()
        ),
        (row) => row.date
      )

      return ROWS[ROWS.length - 1] ?? null
    },
    async findLatestByPositionIds(positionIds, before) {
      return positionIds.flatMap((positionId) => {
        const ROWS = byDateAsc(
          filter(
            BASE,
            (row) =>
              row.positionId === positionId &&
              row.date.getTime() < before.getTime()
          ),
          (row) => row.date
        )

        return ROWS.length === 0 ? [] : [ROWS[ROWS.length - 1]]
      })
    },
    save: (row) => BASE.save(row),
    delete: (id) => BASE.delete(id),
  }
}

/**
 * Creates an in-memory `IStatement`.
 *
 * @returns Fake repository.
 */
export function createFakeStatementRepository(): IStatement {
  const BASE = createStore<Statement>(
    (row) => `${row.portfolioId}-${row.periodStart.getTime()}`,
    (raw, id) => Statement.create(raw as never, id),
    (row) => ({
      portfolioId: row.portfolioId,
      periodStart: row.periodStart,
      periodEnd: row.periodEnd,
      fileUrl: row.fileUrl,
      generatedByUserId: row.generatedByUserId,
      createdAt: row.createdAt,
    })
  )

  return {
    async findById(id) {
      return BASE.store.get(id) ?? null
    },
    async findAllByPortfolioId(portfolioId) {
      return filter(
        BASE,
        (row) => row.portfolioId === portfolioId
      )
    },
    async findAllByPortfolioIds(portfolioIds) {
      return filter(
        BASE,
        (row) =>
          row.portfolioId !== null &&
          portfolioIds.includes(row.portfolioId)
      )
    },
    async findAllByGeneratedByUserId(userId) {
      return filter(
        BASE,
        (row) => row.generatedByUserId === userId
      )
    },
    async findAllByGeneratedByUserIds(userIds) {
      return filter(
        BASE,
        (row) =>
          row.generatedByUserId !== null &&
          userIds.includes(row.generatedByUserId)
      )
    },
    save: (row) => BASE.save(row),
    delete: (id) => BASE.delete(id),
  }
}

// -------------------------------------------------------------------
// CVM CLIENT FAKE
// -------------------------------------------------------------------

/**
 * In-memory `ICvmClient` used by the quota import service tests.
 */
export interface FakeCvmClient extends ICvmClient {
  /** Registers the raw monthly payload returned for a period. */
  __setMonthlyFile(
    year: number,
    month: number,
    buffer: Buffer | null
  ): void
  /** Registers a CSV payload built from typed rows. */
  __setMonthlyCsv(
    year: number,
    month: number,
    rows: CvmCsvRow[]
  ): void
  /** Forgets every registered payload. */
  __clear(): void
}

/**
 * Builds the `"YYYY-MM"` key used to store monthly payloads.
 *
 * @param year - Calendar year.
 * @param month - Calendar month.
 * @returns Zero-padded period key.
 */
function periodKey(year: number, month: number): string {
  return `${year}-${month.toString().padStart(2, "0")}`
}

/**
 * Creates an in-memory `ICvmClient`.
 *
 * @remarks
 * No network access: payloads are registered up front and returned verbatim.
 *
 * @returns Fake client with `__setMonthlyFile` test helpers.
 */
export function createFakeCvmClient(): FakeCvmClient {
  const MONTHLY = new Map<string, Buffer | null>()

  return {
    async fetchMonthlyFile(
      year: number,
      month: number
    ): Promise<Buffer | null> {
      return MONTHLY.get(periodKey(year, month)) ?? null
    },
    __setMonthlyFile(
      year: number,
      month: number,
      buffer: Buffer | null
    ): void {
      MONTHLY.set(periodKey(year, month), buffer)
    },
    __setMonthlyCsv(
      year: number,
      month: number,
      rows: CvmCsvRow[]
    ): void {
      const LINES = [
        "CNPJ_FUNDO;DT_COMPTC;VL_QUOTA",
        ...rows.map(
          (row) =>
            `${row.cnpj};${row.date
              .toISOString()
              .slice(0, 10)};${row.price.replace(".", ",")}`
        ),
      ]

      MONTHLY.set(
        periodKey(year, month),
        Buffer.from(LINES.join("\n"), "latin1")
      )
    },
    __clear(): void {
      MONTHLY.clear()
    },
  }
}

/**
 * Builds one fake repository per aggregate.
 *
 * @remarks
 * Each call returns a fresh, isolated set so no test can observe another
 * test's rows.
 *
 * @returns Fresh fakes for every repository plus the CVM client.
 */
export function createAllFakes() {
  return {
    account: createFakeAccountRepository(),
    application: createFakeApplicationRepository(),
    auditLog: createFakeAuditLogRepository(),
    bank: createFakeBankRepository(),
    bankAccount: createFakeBankAccountRepository(),
    benchmark: createFakeBenchmarkRepository(),
    benchmarkHistory: createFakeBenchmarkHistoryRepository(),
    category: createFakeCategoryRepository(),
    checkingAccount: createFakeCheckingAccountRepository(),
    fund: createFakeFundRepository(),
    norm: createFakeNormRepository(),
    normsPortfolios: createFakeNormsPortfoliosRepository(),
    portfolio: createFakePortfolioRepository(),
    portfolioPerformance:
      createFakePortfolioPerformanceRepository(),
    position: createFakePositionRepository(),
    positionPerformance:
      createFakePositionPerformanceRepository(),
    quota: createFakeQuotaRepository(),
    session: createFakeSessionRepository(),
    statement: createFakeStatementRepository(),
    transactionAllocation:
      createFakeTransactionAllocationRepository(),
    user: createFakeUserRepository(),
    verification: createFakeVerificationRepository(),
    withdrawal: createFakeWithdrawalRepository(),
    cvmClient: createFakeCvmClient(),
  }
}
