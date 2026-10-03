import { drizzle } from "drizzle-orm/neon-http"

import { AccountRepository } from "@/infrastructure/account/repositories/account.repository"
import { ApplicationRepository } from "@/infrastructure/application/repositories/application.repository"
import { AuditLogRepository } from "@/infrastructure/audit-log/repositories/audit-log.repository"
import { BankRepository } from "@/infrastructure/bank/repositories/bank.repository"
import { BankAccountRepository } from "@/infrastructure/bank-account/repositories/bank-account.repository"
import { BenchmarkRepository } from "@/infrastructure/benchmark/repositories/benchmark.repository"
import { CategoryRepository } from "@/infrastructure/category/repositories/category.repository"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { NormRepository } from "@/infrastructure/norm/repositories/norm.repository"
import { NormsPortfoliosRepository } from "@/infrastructure/norms-portfolio/repositories/norms-portfolios.repository"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { PositionRepository } from "@/infrastructure/position/repositories/position.repository"
import { QuotaRepository } from "@/infrastructure/quota/repositories/quota.repository"
import { SessionRepository } from "@/infrastructure/session/repositories/session.repository"
import { UserRepository } from "@/infrastructure/user/repositories/user.repository"
import { VerificationRepository } from "@/infrastructure/verification/repositories/verification.repository"
import { WithdrawalRepository } from "@/infrastructure/withdrawal/repositories/withdrawal.repository"

import type { Account } from "@/domain/account/entities/account.entity"
import type { Application } from "@/domain/application/entities/application.entity"
import type { AuditLog } from "@/domain/audit-log/entities/audit-log.entity"
import type { Bank } from "@/domain/bank/entities/bank.entity"
import type { BankAccount } from "@/domain/bank-account/entities/bank-account.entity"
import type { Benchmark } from "@/domain/benchmark/entities/benchmark.entity"
import type { Category } from "@/domain/category/entities/category.entity"
import type { Fund } from "@/domain/fund/entities/fund.entity"
import type { Norm } from "@/domain/norm/entities/norm.entity"
import type { NormsPortfolios } from "@/domain/norms-portfolio/entities/norms-portfolios.entity"
import type { Portfolio } from "@/domain/portfolio/entities/portfolio.entity"
import type { Position } from "@/domain/position/entities/position.entity"
import type { Quota } from "@/domain/quota/entities/quota.entity"
import type { Session } from "@/domain/session/entities/session.entity"
import type { User } from "@/domain/user/entities/user.entity"
import type { Verification } from "@/domain/verification/entities/verification.entity"
import type { Withdrawal } from "@/domain/withdrawal/entities/withdrawal.entity"
import type { EntityId } from "@/value-objects"

import {
  buildAccount,
  buildApplication,
  buildAuditLog,
  buildBank,
  buildBankAccount,
  buildBenchmark,
  buildCategory,
  buildFund,
  buildNorm,
  buildNormsPortfolios,
  buildPortfolio,
  buildPosition,
  buildQuota,
  buildSession,
  buildUniqueCnpj,
  buildUniqueCpf,
  buildUser,
  buildVerification,
  buildWithdrawal,
} from "__tests__/__setup__/_factories.setup"

type TestDb = ReturnType<typeof drizzle>

/**
 * Narrows an entity returned by a repository `save` to one guaranteed to carry
 * an id.
 *
 * @remarks
 * Entities expose `id` as `EntityId | undefined` because a freshly built
 * instance has not been persisted yet. Every seeder writes to the database
 * first, so the id is always present and callers should not have to reach for
 * a non-null assertion.
 */
export type Persisted<T extends { id?: EntityId }> = T & {
  readonly id: EntityId
}

/**
 * Asserts that a persisted entity carries an id.
 *
 * @param entity - Entity returned by a repository `save`.
 * @returns The same entity with a non-optional id.
 * @throws Error when the database did not assign an id.
 */
function asPersisted<T extends { id?: EntityId }>(
  entity: T
): Persisted<T> {
  if (entity.id === undefined) {
    throw new Error("Seeded entity was persisted without an id.")
  }

  return entity as Persisted<T>
}

/**
 * Persists the prerequisite rows required by a repository test.
 *
 * @remarks
 * Foreign keys are enforced by the database, so every repository test that
 * exercises a child table must first persist its parents. Each seeder below
 * resolves its own prerequisites recursively and returns the persisted
 * parent, keeping the test bodies focused on the repository under test.
 *
 * All unique columns (`user.email`, `user.cpf`, `bank.code`, `category.name`,
 * `fund.cnpj`) receive distinct deterministic values per call so repeated
 * calls inside a single test never collide.
 */

let uniqueCounter = 0

/**
 * Returns a monotonically increasing suffix for unique columns.
 *
 * @remarks
 * The counter lives for the duration of a test file, so every value handed
 * out inside a file is distinct. `resetDatabase()` in `beforeEach` empties the
 * tables, which keeps the growing suffix from ever colliding.
 *
 * @returns Zero-padded counter value.
 */
function nextSuffix(): string {
  uniqueCounter += 1

  return String(uniqueCounter).padStart(4, "0")
}

/**
 * Persists a **User**.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted User.
 */
export async function seedUser(
  db: TestDb,
  overrides: Parameters<typeof buildUser>[0] = {}
): Promise<Persisted<User>> {
  const SUFFIX = nextSuffix()

  return asPersisted(
    await new UserRepository(db).save(
      buildUser({
        email: `${SUFFIX}@example.com`,
        cpf: buildUniqueCpf(SUFFIX.padStart(9, "0")),
        ...overrides,
      })
    )
  )
}

/**
 * Persists a **Bank**.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted Bank.
 */
export async function seedBank(
  db: TestDb,
  overrides: Parameters<typeof buildBank>[0] = {}
): Promise<Persisted<Bank>> {
  return asPersisted(
    await new BankRepository(db).save(
      buildBank({ code: `B${nextSuffix()}`, ...overrides })
    )
  )
}

/**
 * Persists a **Category**.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted Category.
 */
export async function seedCategory(
  db: TestDb,
  overrides: Parameters<typeof buildCategory>[0] = {}
): Promise<Persisted<Category>> {
  return asPersisted(
    await new CategoryRepository(db).save(
      buildCategory({
        name: `Categoria ${nextSuffix()}`,
        ...overrides,
      })
    )
  )
}

/**
 * Persists a **Benchmark**.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted Benchmark.
 */
export async function seedBenchmark(
  db: TestDb,
  overrides: Parameters<typeof buildBenchmark>[0] = {}
): Promise<Persisted<Benchmark>> {
  return asPersisted(
    await new BenchmarkRepository(db).save(
      buildBenchmark({
        acronym: `BM${nextSuffix()}`,
        name: `Benchmark ${nextSuffix()}`,
        ...overrides,
      })
    )
  )
}

/**
 * Persists a **Fund** together with its bank, benchmark and category.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted Fund.
 */
export async function seedFund(
  db: TestDb,
  overrides: Parameters<typeof buildFund>[0] = {}
): Promise<Persisted<Fund>> {
  const BANK = await seedBank(db)
  const BENCHMARK = await seedBenchmark(db)
  const CATEGORY = await seedCategory(db)

  return asPersisted(
    await new FundRepository(db).save(
      buildFund({
        cnpj: buildUniqueCnpj(nextSuffix().padStart(12, "0")),
        bankId: BANK.id,
        benchmarkId: BENCHMARK.id,
        categoryId: CATEGORY.id,
        ...overrides,
      })
    )
  )
}

/**
 * Persists a **Portfolio** together with its owner.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted Portfolio.
 */
export async function seedPortfolio(
  db: TestDb,
  overrides: Parameters<typeof buildPortfolio>[0] = {}
): Promise<Persisted<Portfolio>> {
  const OWNER = await seedUser(db)

  return asPersisted(
    await new PortfolioRepository(db).save(
      buildPortfolio({
        acronym: `PF${nextSuffix()}`,
        userId: OWNER.id,
        ...overrides,
      })
    )
  )
}

/**
 * Persists a **Position** together with its portfolio and fund.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted Position.
 */
export async function seedPosition(
  db: TestDb,
  overrides: Parameters<typeof buildPosition>[0] = {}
): Promise<Persisted<Position>> {
  const PORTFOLIO = await seedPortfolio(db)
  const FUND = await seedFund(db)

  return asPersisted(
    await new PositionRepository(db).save(
      buildPosition({
        portfolioId: PORTFOLIO.id,
        fundId: FUND.id,
        ...overrides,
      })
    )
  )
}

/**
 * Persists a **Quota** together with its fund.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted Quota.
 */
export async function seedQuota(
  db: TestDb,
  overrides: Parameters<typeof buildQuota>[0] = {}
): Promise<Persisted<Quota>> {
  const FUND = await seedFund(db)

  return asPersisted(
    await new QuotaRepository(db).save(
      buildQuota({ fundId: FUND.id, ...overrides })
    )
  )
}

/**
 * Persists a **BankAccount** together with its portfolio and bank.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted BankAccount.
 */
export async function seedBankAccount(
  db: TestDb,
  overrides: Parameters<typeof buildBankAccount>[0] = {}
): Promise<Persisted<BankAccount>> {
  const PORTFOLIO = await seedPortfolio(db)
  const BANK = await seedBank(db)

  return asPersisted(
    await new BankAccountRepository(db).save(
      buildBankAccount({
        portfolioId: PORTFOLIO.id,
        bankId: BANK.id,
        agency: `A${nextSuffix()}`,
        accountNumber: `${nextSuffix()}-6`,
        ...overrides,
      })
    )
  )
}

/**
 * Persists a **Norm** together with its category.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted Norm.
 */
export async function seedNorm(
  db: TestDb,
  overrides: Parameters<typeof buildNorm>[0] = {}
): Promise<Persisted<Norm>> {
  const CATEGORY = await seedCategory(db)

  return asPersisted(
    await new NormRepository(db).save(
      buildNorm({
        articleNumber: `Art. ${nextSuffix()}`,
        categoryId: CATEGORY.id,
        ...overrides,
      })
    )
  )
}

/**
 * Persists a **NormsPortfolios** link together with its norm and portfolio.
 *
 * @remarks
 * The `norms_portfolios` table carries no surrogate id: the composite
 * `(normId, portfolioId)` key is the identity, so a saved row always
 * hydrates with an undefined `id`. This seeder therefore returns the
 * plain entity instead of a `Persisted` one, and callers key the row by
 * the pair.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns The persisted NormsPortfolios.
 */
export async function seedNormsPortfolios(
  db: TestDb,
  overrides: Parameters<typeof buildNormsPortfolios>[0] = {}
): Promise<NormsPortfolios> {
  const NORM = await seedNorm(db)
  const PORTFOLIO = await seedPortfolio(db)

  return new NormsPortfoliosRepository(db).save(
    buildNormsPortfolios({
      normId: NORM.id,
      portfolioId: PORTFOLIO.id,
      ...overrides,
    })
  )
}

/**
 * Persists a **Session** together with its owner.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted Session.
 */
export async function seedSession(
  db: TestDb,
  overrides: Parameters<typeof buildSession>[0] = {}
): Promise<Persisted<Session>> {
  const OWNER = await seedUser(db)

  return asPersisted(
    await new SessionRepository(db).save(
      buildSession({
        token: `token-${nextSuffix()}`,
        userId: OWNER.id,
        ...overrides,
      })
    )
  )
}

/**
 * Persists an **Account** together with its owner.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted Account.
 */
export async function seedAccount(
  db: TestDb,
  overrides: Parameters<typeof buildAccount>[0] = {}
): Promise<Persisted<Account>> {
  const OWNER = await seedUser(db)

  return asPersisted(
    await new AccountRepository(db).save(
      buildAccount({
        accountId: `${nextSuffix()}@example.com`,
        userId: OWNER.id,
        ...overrides,
      })
    )
  )
}

/**
 * Persists a **Verification**.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted Verification.
 */
export async function seedVerification(
  db: TestDb,
  overrides: Parameters<typeof buildVerification>[0] = {}
): Promise<Persisted<Verification>> {
  return asPersisted(
    await new VerificationRepository(db).save(
      buildVerification({
        identifier: `${nextSuffix()}@example.com`,
        ...overrides,
      })
    )
  )
}

/**
 * Persists an **AuditLog** together with its acting user.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted AuditLog.
 */
export async function seedAuditLog(
  db: TestDb,
  overrides: Parameters<typeof buildAuditLog>[0] = {}
): Promise<Persisted<AuditLog>> {
  const ACTOR = await seedUser(db)

  return asPersisted(
    await new AuditLogRepository(db).save(
      buildAuditLog({ userId: ACTOR.id, ...overrides })
    )
  )
}

/**
 * Persists an **Application** together with its position.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted Application.
 */
export async function seedApplication(
  db: TestDb,
  overrides: Parameters<typeof buildApplication>[0] = {}
): Promise<Persisted<Application>> {
  const POSITION = await seedPosition(db)

  return asPersisted(
    await new ApplicationRepository(db).save(
      buildApplication({ positionId: POSITION.id, ...overrides })
    )
  )
}

/**
 * Persists a **Withdrawal** together with its position.
 *
 * @param db - Drizzle client.
 * @param overrides - Optional entity overrides.
 * @returns Persisted Withdrawal.
 */
export async function seedWithdrawal(
  db: TestDb,
  overrides: Parameters<typeof buildWithdrawal>[0] = {}
): Promise<Persisted<Withdrawal>> {
  const POSITION = await seedPosition(db)

  return asPersisted(
    await new WithdrawalRepository(db).save(
      buildWithdrawal({ positionId: POSITION.id, ...overrides })
    )
  )
}

/**
 * Type-safe alias used when a test only needs the parent identifier.
 */
export type SeededId = EntityId
