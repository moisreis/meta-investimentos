import { EntityId } from "@/value-objects"
import { CNPJ } from "@/value-objects/cnpj.vo"
import { CPF } from "@/value-objects/cpf.vo"
import { PositiveMoney } from "@/value-objects/positive-money.vo"
import { QuotaPrice } from "@/value-objects/quota-price.vo"
import { QuotaQuantity } from "@/value-objects/quota-quantity.vo"
import { SignedMoney } from "@/value-objects/signed-money.vo"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"

import { Account } from "@/domain/account/entities/account.entity"
import { Application } from "@/domain/application/entities/application.entity"
import { AuditLog } from "@/domain/audit-log/entities/audit-log.entity"
import { Bank } from "@/domain/bank/entities/bank.entity"
import { BankAccount } from "@/domain/bank-account/entities/bank-account.entity"
import { Benchmark } from "@/domain/benchmark/entities/benchmark.entity"
import { BenchmarkHistory } from "@/domain/benchmark-history/entities/benchmark-history.entity"
import { Category } from "@/domain/category/entities/category.entity"
import { CheckingAccount } from "@/domain/checking-account/entities/checking-account.entity"
import { Fund } from "@/domain/fund/entities/fund.entity"
import { Norm } from "@/domain/norm/entities/norm.entity"
import { NormsPortfolios } from "@/domain/norms-portfolio/entities/norms-portfolios.entity"
import { Portfolio } from "@/domain/portfolio/entities/portfolio.entity"
import { PortfolioPerformance } from "@/domain/portfolio-performance/entities/portfolio-performance.entity"
import { Position } from "@/domain/position/entities/position.entity"
import { PositionPerformance } from "@/domain/position-performance/entities/position-performance.entity"
import { Quota } from "@/domain/quota/entities/quota.entity"
import { Session } from "@/domain/session/entities/session.entity"
import { Statement } from "@/domain/statement/entities/statement.entity"
import { TransactionAllocation } from "@/domain/transaction-allocation/entities/transaction-allocation.entity"
import { User } from "@/domain/user/entities/user.entity"
import { Verification } from "@/domain/verification/entities/verification.entity"
import { Withdrawal } from "@/domain/withdrawal/entities/withdrawal.entity"

import type { UserRole } from "@/lib/auth/user-role"

// -------------------------------------------------------------------
// VALUE OBJECT FACTORIES
// -------------------------------------------------------------------

/**
 * Creates a nominal **EntityId** from a raw string.
 *
 * @param value - Raw identifier, defaults to a stable test id.
 * @returns Branded EntityId.
 */
export function buildEntityId(
  value: string = "test-entity-id"
): EntityId {
  return EntityId.create(value)
}

/**
 * Creates a valid CNPJ value object.
 *
 * @param value - Raw CNPJ digits.
 * @returns Validated CNPJ.
 */
export function buildCnpj(
  value: string = "11222333000181"
): CNPJ {
  return CNPJ.create(value)
}

/**
 * Creates a **unique** valid CNPJ value object.
 *
 * @remarks
 * The `fund` table enforces a unique constraint on `cnpj`, so tests that
 * persist several funds need distinct values. Pass a distinct 12-digit base
 * per call and the check digits are derived deterministically.
 *
 * @param base - First twelve digits of the CNPJ.
 * @returns Validated CNPJ whose digits are unique to `base`.
 */
export function buildUniqueCnpj(base: string): CNPJ {
  if (base.length !== 12) {
    throw new Error("`base` must contain exactly 12 digits.")
  }

  const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  const DIGIT = (partial: string, weights: number[]): string => {
    let SUM = 0

    for (let INDEX = 0; INDEX < partial.length; INDEX++) {
      SUM += Number(partial[INDEX]) * weights[INDEX]
    }

    const REMAINDER = SUM % 11

    return REMAINDER < 2 ? "0" : String(11 - REMAINDER)
  }

  const FIRST = DIGIT(base, FIRST_WEIGHTS)

  return CNPJ.create(
    base + FIRST + DIGIT(base + FIRST, SECOND_WEIGHTS)
  )
}

/**
 * Creates a valid CPF value object.
 *
 * @param value - Raw CPF digits.
 * @returns Validated CPF.
 */
export function buildCpf(value: string = "52998224725"): CPF {
  return CPF.create(value)
}

/**
 * Creates a **unique** valid CPF value object.
 *
 * @remarks
 * The `user` table enforces a unique constraint on `cpf`, so tests that
 * persist several users need distinct values. Pass a distinct 9-digit base
 * per call and the check digits are derived deterministically.
 *
 * @param base - First nine digits of the CPF.
 * @returns Validated CPF whose digits are unique to `base`.
 */
export function buildUniqueCpf(base: string): CPF {
  if (base.length !== 9) {
    throw new Error("`base` must contain exactly 9 digits.")
  }

  const DIGIT = (partial: string, weight: number): string => {
    let SUM = 0

    for (let INDEX = 0; INDEX < partial.length; INDEX++) {
      SUM += Number(partial[INDEX]) * (weight - INDEX)
    }

    const REMAINDER = SUM % 11

    return REMAINDER < 2 ? "0" : String(11 - REMAINDER)
  }

  const FIRST = DIGIT(base, 10)

  return CPF.create(base + FIRST + DIGIT(base + FIRST, 11))
}

/**
 * Creates a **PositiveMoney** value object.
 *
 * @param value - Raw decimal string.
 * @returns Validated PositiveMoney.
 */
export function buildPositiveMoney(
  value: string = "1000.00"
): PositiveMoney {
  return PositiveMoney.create(value)
}

/**
 * Creates a **QuotaPrice** value object.
 *
 * @param value - Raw decimal string.
 * @returns Validated QuotaPrice.
 */
export function buildQuotaPrice(
  value: string = "10.50"
): QuotaPrice {
  return QuotaPrice.create(value)
}

/**
 * Creates a **QuotaQuantity** value object.
 *
 * @param value - Raw decimal string.
 * @returns Validated QuotaQuantity.
 */
export function buildQuotaQuantity(
  value: string = "100.00"
): QuotaQuantity {
  return QuotaQuantity.create(value)
}

/**
 * Creates a **SignedMoney** value object.
 *
 * @param value - Raw decimal string, may be negative.
 * @returns Validated SignedMoney.
 */
export function buildSignedMoney(
  value: string = "1000.00"
): SignedMoney {
  return SignedMoney.create(value)
}

/**
 * Creates a **SignedPercentage** value object.
 *
 * @param value - Raw decimal string, may be negative.
 * @returns Validated SignedPercentage.
 */
export function buildSignedPercentage(
  value: string = "50.00"
): SignedPercentage {
  return SignedPercentage.create(value)
}

// -------------------------------------------------------------------
// ENTITY FACTORIES
// -------------------------------------------------------------------

/**
 * Builds a **Bank** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready Bank instance.
 */
export function buildBank(
  overrides: {
    code?: string
    name?: string
    createdAt?: Date
    updatedAt?: Date
    id?: EntityId
  } = {}
): Bank {
  return Bank.create(
    {
      code: overrides.code ?? "001",
      name: overrides.name ?? "Banco do Brasil",
      createdAt: overrides.createdAt,
      updatedAt: overrides.updatedAt,
    },
    overrides.id
  )
}

/**
 * Builds a **BankAccount** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready BankAccount instance.
 */
export function buildBankAccount(
  overrides: {
    portfolioId?: EntityId
    bankId?: EntityId
    agency?: string
    accountNumber?: string
    createdAt?: Date
    updatedAt?: Date
    id?: EntityId
  } = {}
): BankAccount {
  return BankAccount.create(
    {
      portfolioId:
        overrides.portfolioId ?? buildEntityId("portfolio-1"),
      bankId: overrides.bankId ?? buildEntityId("bank-1"),
      agency: overrides.agency ?? "0001",
      accountNumber: overrides.accountNumber ?? "12345-6",
      createdAt: overrides.createdAt,
      updatedAt: overrides.updatedAt,
    },
    overrides.id
  )
}

/**
 * Builds a **Category** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready Category instance.
 */
export function buildCategory(
  overrides: {
    name?: string
    createdAt?: Date
    updatedAt?: Date
    id?: EntityId
  } = {}
): Category {
  return Category.create(
    {
      name: overrides.name ?? "Renda Fixa",
      createdAt: overrides.createdAt,
      updatedAt: overrides.updatedAt,
    },
    overrides.id
  )
}

/**
 * Builds a **Benchmark** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready Benchmark instance.
 */
export function buildBenchmark(
  overrides: {
    acronym?: string
    name?: string
    createdAt?: Date
    id?: EntityId
  } = {}
): Benchmark {
  return Benchmark.create(
    {
      acronym: overrides.acronym ?? "IBOV",
      name: overrides.name ?? "Ibovespa",
      createdAt: overrides.createdAt,
    },
    overrides.id
  )
}

/**
 * Builds a **BenchmarkHistory** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready BenchmarkHistory instance.
 */
export function buildBenchmarkHistory(
  overrides: {
    benchmarkId?: EntityId
    date?: Date
    rate?: SignedPercentage
    createdAt?: Date
    id?: EntityId
  } = {}
): BenchmarkHistory {
  return BenchmarkHistory.create(
    {
      benchmarkId:
        overrides.benchmarkId ?? buildEntityId("benchmark-1"),
      date: overrides.date ?? new Date("2026-01-15"),
      rate: overrides.rate ?? buildSignedPercentage("10.75"),
      createdAt: overrides.createdAt,
    },
    overrides.id
  )
}

/**
 * Builds a **CheckingAccount** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready CheckingAccount instance.
 */
export function buildCheckingAccount(
  overrides: {
    bankAccountId?: EntityId
    date?: Date
    value?: SignedMoney
    id?: EntityId
  } = {}
): CheckingAccount {
  return CheckingAccount.create(
    {
      bankAccountId:
        overrides.bankAccountId ??
        buildEntityId("bank-account-1"),
      date: overrides.date ?? new Date("2026-01-15"),
      value: overrides.value ?? buildSignedMoney("1000.00"),
    },
    overrides.id
  )
}

/**
 * Builds a **Fund** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready Fund instance.
 */
export function buildFund(
  overrides: {
    cnpj?: CNPJ
    name?: string
    administrationFee?: SignedPercentage | null
    performanceFee?: SignedPercentage | null
    bankId?: EntityId
    benchmarkId?: EntityId | null
    categoryId?: EntityId | null
    createdAt?: Date
    updatedAt?: Date
    id?: EntityId
  } = {}
): Fund {
  return Fund.create(
    {
      cnpj: overrides.cnpj ?? buildCnpj(),
      name: overrides.name ?? "Fundo Teste",
      administrationFee:
        overrides.administrationFee === undefined
          ? buildSignedPercentage("1.00")
          : overrides.administrationFee,
      performanceFee:
        overrides.performanceFee === undefined
          ? buildSignedPercentage("2.00")
          : overrides.performanceFee,
      bankId: overrides.bankId ?? buildEntityId("bank-1"),
      benchmarkId:
        overrides.benchmarkId === undefined
          ? buildEntityId("benchmark-1")
          : overrides.benchmarkId,
      categoryId:
        overrides.categoryId === undefined
          ? buildEntityId("category-1")
          : overrides.categoryId,
      createdAt: overrides.createdAt,
      updatedAt: overrides.updatedAt,
    },
    overrides.id
  )
}

/**
 * Builds a **Norm** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready Norm instance.
 */
export function buildNorm(
  overrides: {
    articleNumber?: string
    name?: string
    categoryId?: EntityId
    minAllocation?: SignedPercentage
    maxAllocation?: SignedPercentage
    targetAllocation?: SignedPercentage
    version?: number
    createdAt?: Date
    updatedAt?: Date
    id?: EntityId
  } = {}
): Norm {
  return Norm.create(
    {
      articleNumber: overrides.articleNumber ?? "Art. 12",
      name: overrides.name ?? "Limite de Concentração",
      categoryId:
        overrides.categoryId ?? buildEntityId("category-1"),
      minAllocation:
        overrides.minAllocation ?? buildSignedPercentage("5"),
      maxAllocation:
        overrides.maxAllocation ?? buildSignedPercentage("20"),
      targetAllocation:
        overrides.targetAllocation ??
        buildSignedPercentage("12"),
      version: overrides.version ?? 0,
      createdAt: overrides.createdAt,
      updatedAt: overrides.updatedAt,
    },
    overrides.id
  )
}

/**
 * Builds a **NormsPortfolios** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready NormsPortfolios instance.
 */
export function buildNormsPortfolios(
  overrides: {
    normId?: EntityId
    portfolioId?: EntityId
    minAllocation?: SignedPercentage
    maxAllocation?: SignedPercentage
    targetAllocation?: SignedPercentage
    version?: number
    createdAt?: Date
    id?: EntityId
  } = {}
): NormsPortfolios {
  return NormsPortfolios.create(
    {
      normId: overrides.normId ?? buildEntityId("norm-1"),
      portfolioId:
        overrides.portfolioId ?? buildEntityId("portfolio-1"),
      minAllocation:
        overrides.minAllocation ?? buildSignedPercentage("5"),
      maxAllocation:
        overrides.maxAllocation ?? buildSignedPercentage("20"),
      targetAllocation:
        overrides.targetAllocation ??
        buildSignedPercentage("12"),
      version: overrides.version ?? 0,
      createdAt: overrides.createdAt,
    },
    overrides.id
  )
}

/**
 * Builds a **Portfolio** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready Portfolio instance.
 */
export function buildPortfolio(
  overrides: {
    acronym?: string
    name?: string
    userId?: EntityId
    annualInterestRate?: SignedPercentage
    minAllocation?: SignedPercentage
    maxAllocation?: SignedPercentage
    targetAllocation?: SignedPercentage
    version?: number
    createdAt?: Date
    updatedAt?: Date
    id?: EntityId
  } = {}
): Portfolio {
  return Portfolio.create(
    {
      acronym: overrides.acronym ?? "FIA",
      name: overrides.name ?? "Fundo de Investimento em Ações",
      userId: overrides.userId ?? buildEntityId("user-1"),
      annualInterestRate:
        overrides.annualInterestRate ??
        buildSignedPercentage("10.5"),
      minAllocation:
        overrides.minAllocation ?? buildSignedPercentage("5"),
      maxAllocation:
        overrides.maxAllocation ?? buildSignedPercentage("20"),
      targetAllocation:
        overrides.targetAllocation ??
        buildSignedPercentage("12"),
      version: overrides.version ?? 0,
      createdAt: overrides.createdAt,
      updatedAt: overrides.updatedAt,
    },
    overrides.id
  )
}

/**
 * Builds a **Position** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready Position instance.
 */
export function buildPosition(
  overrides: {
    portfolioId?: EntityId
    fundId?: EntityId
    initialBalance?: PositiveMoney | null
    initialBalanceDate?: Date | null
    allocation?: SignedPercentage
    version?: number
    createdAt?: Date
    updatedAt?: Date
    id?: EntityId
  } = {}
): Position {
  return Position.create(
    {
      portfolioId:
        overrides.portfolioId ?? buildEntityId("portfolio-1"),
      fundId: overrides.fundId ?? buildEntityId("fund-1"),
      initialBalance:
        overrides.initialBalance === undefined
          ? buildPositiveMoney("10000.00")
          : overrides.initialBalance,
      initialBalanceDate:
        overrides.initialBalanceDate === undefined
          ? new Date("2026-01-01")
          : overrides.initialBalanceDate,
      allocation:
        overrides.allocation ?? buildSignedPercentage("100"),
      version: overrides.version ?? 0,
      createdAt: overrides.createdAt,
      updatedAt: overrides.updatedAt,
    },
    overrides.id
  )
}

/**
 * Builds a **Quota** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready Quota instance.
 */
export function buildQuota(
  overrides: {
    fundId?: EntityId
    date?: Date
    price?: QuotaPrice
    createdAt?: Date
    id?: EntityId
  } = {}
): Quota {
  return Quota.create(
    {
      fundId: overrides.fundId ?? buildEntityId("fund-1"),
      date: overrides.date ?? new Date("2026-01-15"),
      price: overrides.price ?? buildQuotaPrice("10.50"),
      createdAt: overrides.createdAt,
    },
    overrides.id
  )
}

/**
 * Builds a **Statement** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready Statement instance.
 */
export function buildStatement(
  overrides: {
    portfolioId?: EntityId | null
    periodStart?: Date
    periodEnd?: Date
    fileUrl?: string
    generatedByUserId?: EntityId | null
    createdAt?: Date
    id?: EntityId
  } = {}
): Statement {
  return Statement.create(
    {
      portfolioId:
        overrides.portfolioId === undefined
          ? buildEntityId("portfolio-1")
          : overrides.portfolioId,
      periodStart:
        overrides.periodStart ?? new Date("2026-01-01"),
      periodEnd: overrides.periodEnd ?? new Date("2026-01-31"),
      fileUrl:
        overrides.fileUrl ?? "https://cdn.test/statement.pdf",
      generatedByUserId:
        overrides.generatedByUserId === undefined
          ? buildEntityId("user-1")
          : overrides.generatedByUserId,
      createdAt: overrides.createdAt,
    },
    overrides.id
  )
}

/**
 * Builds a **TransactionAllocation** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready TransactionAllocation instance.
 */
export function buildTransactionAllocation(
  overrides: {
    applicationId?: EntityId
    withdrawId?: EntityId
    quotasConsumed?: QuotaQuantity
    version?: number
    createdAt?: Date
    id?: EntityId
  } = {}
): TransactionAllocation {
  return TransactionAllocation.create(
    {
      applicationId:
        overrides.applicationId ??
        buildEntityId("application-1"),
      withdrawId:
        overrides.withdrawId ?? buildEntityId("withdrawal-1"),
      quotasConsumed:
        overrides.quotasConsumed ?? buildQuotaQuantity("100.00"),
      version: overrides.version ?? 0,
      createdAt: overrides.createdAt,
    },
    overrides.id
  )
}

/**
 * Builds a **User** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready User instance.
 */
export function buildUser(
  overrides: {
    name?: string
    email?: string
    firstName?: string
    lastName?: string
    cpf?: CPF
    role?: UserRole
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date
    updatedAt?: Date
    id?: EntityId
  } = {}
): User {
  return User.create(
    {
      name: overrides.name ?? "Test User",
      email: overrides.email ?? "test@example.com",
      firstName: overrides.firstName ?? "Test",
      lastName: overrides.lastName ?? "User",
      cpf: overrides.cpf ?? buildCpf(),
      role: overrides.role ?? "USER",
      emailVerified: overrides.emailVerified ?? true,
      image: overrides.image ?? null,
      createdAt: overrides.createdAt,
      updatedAt: overrides.updatedAt,
    },
    overrides.id
  )
}

/**
 * Builds an **Account** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready Account instance.
 */
export function buildAccount(
  overrides: {
    providerId?: string
    accountId?: string
    userId?: EntityId
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | null
    refreshTokenExpiresAt?: Date | null
    scope?: string | null
    password?: string | null
    issuer?: string
    createdAt?: Date
    updatedAt?: Date
    id?: EntityId
  } = {}
): Account {
  return Account.create(
    {
      providerId: overrides.providerId ?? "credential",
      accountId: overrides.accountId ?? "test@example.com",
      userId: overrides.userId ?? buildEntityId("user-1"),
      accessToken: overrides.accessToken ?? null,
      refreshToken: overrides.refreshToken ?? null,
      idToken: overrides.idToken ?? null,
      accessTokenExpiresAt:
        overrides.accessTokenExpiresAt ?? null,
      refreshTokenExpiresAt:
        overrides.refreshTokenExpiresAt ?? null,
      scope: overrides.scope ?? null,
      password: overrides.password ?? null,
      issuer: overrides.issuer,
      createdAt: overrides.createdAt,
      updatedAt: overrides.updatedAt,
    },
    overrides.id
  )
}

/**
 * Builds a **Session** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready Session instance.
 */
export function buildSession(
  overrides: {
    userId?: EntityId
    token?: string
    expiresAt?: Date
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date
    updatedAt?: Date
    id?: EntityId
  } = {}
): Session {
  return Session.create(
    {
      userId: overrides.userId ?? buildEntityId("user-1"),
      token: overrides.token ?? "session-token",
      expiresAt:
        overrides.expiresAt ??
        new Date("2026-12-31T23:59:59.000Z"),
      ipAddress:
        overrides.ipAddress === undefined
          ? "127.0.0.1"
          : overrides.ipAddress,
      userAgent:
        overrides.userAgent === undefined
          ? "vitest"
          : overrides.userAgent,
      createdAt: overrides.createdAt,
      updatedAt: overrides.updatedAt,
    },
    overrides.id
  )
}

/**
 * Builds a **Verification** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready Verification instance.
 */
export function buildVerification(
  overrides: {
    identifier?: string
    value?: string
    expiresAt?: Date
    createdAt?: Date
    updatedAt?: Date
    id?: EntityId
  } = {}
): Verification {
  return Verification.create(
    {
      identifier: overrides.identifier ?? "test@example.com",
      value: overrides.value ?? "123456",
      expiresAt:
        overrides.expiresAt ??
        new Date("2026-12-31T23:59:59.000Z"),
      createdAt: overrides.createdAt,
      updatedAt: overrides.updatedAt,
    },
    overrides.id
  )
}

/**
 * Builds an **Application** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready Application instance.
 */
export function buildApplication(
  overrides: {
    positionId?: EntityId
    date?: Date
    amount?: PositiveMoney
    quotas?: QuotaQuantity
    reversedAt?: Date | null
    reversedByUserId?: EntityId | null
    version?: number
    createdAt?: Date
    updatedAt?: Date
    id?: EntityId
  } = {}
): Application {
  return Application.create(
    {
      positionId:
        overrides.positionId ?? buildEntityId("position-1"),
      date: overrides.date ?? new Date("2026-01-15"),
      amount: overrides.amount ?? buildPositiveMoney("1000.00"),
      quotas: overrides.quotas ?? buildQuotaQuantity("100.00"),
      reversedAt:
        overrides.reversedAt === undefined
          ? null
          : overrides.reversedAt,
      reversedByUserId:
        overrides.reversedByUserId === undefined
          ? null
          : overrides.reversedByUserId,
      version: overrides.version ?? 0,
      createdAt: overrides.createdAt,
      updatedAt: overrides.updatedAt,
    },
    overrides.id
  )
}

/**
 * Builds a **Withdrawal** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready Withdrawal instance.
 */
export function buildWithdrawal(
  overrides: {
    positionId?: EntityId
    date?: Date
    amount?: PositiveMoney
    quotas?: QuotaQuantity
    reversedAt?: Date | null
    reversedByUserId?: EntityId | null
    version?: number
    createdAt?: Date
    updatedAt?: Date
    id?: EntityId
  } = {}
): Withdrawal {
  return Withdrawal.create(
    {
      positionId:
        overrides.positionId ?? buildEntityId("position-1"),
      date: overrides.date ?? new Date("2026-02-15"),
      amount: overrides.amount ?? buildPositiveMoney("500.00"),
      quotas: overrides.quotas ?? buildQuotaQuantity("50.00"),
      reversedAt:
        overrides.reversedAt === undefined
          ? null
          : overrides.reversedAt,
      reversedByUserId:
        overrides.reversedByUserId === undefined
          ? null
          : overrides.reversedByUserId,
      version: overrides.version ?? 0,
      createdAt: overrides.createdAt,
      updatedAt: overrides.updatedAt,
    },
    overrides.id
  )
}

/**
 * Builds an **AuditLog** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready AuditLog instance.
 */
export function buildAuditLog(
  overrides: {
    entity?: string
    entityId?: EntityId
    action?: string
    changes?: Record<string, unknown> | null
    userId?: EntityId | null
    createdAt?: Date
    id?: EntityId
  } = {}
): AuditLog {
  return AuditLog.create(
    {
      entity: overrides.entity ?? "Portfolio",
      entityId:
        overrides.entityId ?? buildEntityId("portfolio-1"),
      action: overrides.action ?? "UPDATE",
      changes: overrides.changes ?? null,
      userId:
        overrides.userId === undefined ? null : overrides.userId,
      createdAt: overrides.createdAt,
    },
    overrides.id
  )
}

/**
 * Builds a **PortfolioPerformance** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready PortfolioPerformance instance.
 */
export function buildPortfolioPerformance(
  overrides: {
    portfolioId?: EntityId
    date?: Date
    quotasHeld?: QuotaQuantity
    patrimony?: PositiveMoney
    applicationTotal?: PositiveMoney
    redemptionTotal?: PositiveMoney
    cashFlowNet?: SignedMoney
    earnings?: SignedMoney
    returnDaily?: SignedPercentage
    returnMonthly?: SignedPercentage | null
    returnYearly?: SignedPercentage | null
    returnLast12m?: SignedPercentage | null
    target?: SignedPercentage | null
    cumulativeTarget?: SignedPercentage | null
    inflationSpread?: SignedPercentage | null
    riskFreeSpread?: SignedPercentage | null
    marketSpread?: SignedPercentage | null
    createdAt?: Date
    id?: EntityId
  } = {}
): PortfolioPerformance {
  return PortfolioPerformance.create(
    {
      portfolioId:
        overrides.portfolioId ?? buildEntityId("portfolio-1"),
      date: overrides.date ?? new Date("2026-01-31"),
      quotasHeld:
        overrides.quotasHeld ?? buildQuotaQuantity("1000.00"),
      patrimony:
        overrides.patrimony ?? buildPositiveMoney("50000.00"),
      applicationTotal:
        overrides.applicationTotal ??
        buildPositiveMoney("10000.00"),
      redemptionTotal:
        overrides.redemptionTotal ??
        buildPositiveMoney("5000.00"),
      cashFlowNet:
        overrides.cashFlowNet ?? buildSignedMoney("5000.00"),
      earnings:
        overrides.earnings ?? buildSignedMoney("1000.00"),
      returnDaily:
        overrides.returnDaily ?? buildSignedPercentage("0.50"),
      returnMonthly:
        overrides.returnMonthly === undefined
          ? null
          : overrides.returnMonthly,
      returnYearly:
        overrides.returnYearly === undefined
          ? null
          : overrides.returnYearly,
      returnLast12m:
        overrides.returnLast12m === undefined
          ? null
          : overrides.returnLast12m,
      target:
        overrides.target === undefined ? null : overrides.target,
      cumulativeTarget:
        overrides.cumulativeTarget === undefined
          ? null
          : overrides.cumulativeTarget,
      inflationSpread:
        overrides.inflationSpread === undefined
          ? null
          : overrides.inflationSpread,
      riskFreeSpread:
        overrides.riskFreeSpread === undefined
          ? null
          : overrides.riskFreeSpread,
      marketSpread:
        overrides.marketSpread === undefined
          ? null
          : overrides.marketSpread,
      createdAt: overrides.createdAt,
    },
    overrides.id
  )
}

/**
 * Builds a **PositionPerformance** entity.
 *
 * @param overrides - Optional property overrides.
 * @returns Persisted-ready PositionPerformance instance.
 */
export function buildPositionPerformance(
  overrides: {
    positionId?: EntityId
    date?: Date
    quotasHeld?: QuotaQuantity
    patrimony?: PositiveMoney
    applicationTotal?: PositiveMoney
    redemptionTotal?: PositiveMoney
    cashFlowNet?: SignedMoney
    earnings?: SignedMoney
    returnDaily?: SignedPercentage
    returnMonthly?: SignedPercentage | null
    returnYearly?: SignedPercentage | null
    returnLast12m?: SignedPercentage | null
    allocation?: SignedPercentage
    createdAt?: Date
    id?: EntityId
  } = {}
): PositionPerformance {
  return PositionPerformance.create(
    {
      positionId:
        overrides.positionId ?? buildEntityId("position-1"),
      date: overrides.date ?? new Date("2026-01-31"),
      quotasHeld:
        overrides.quotasHeld ?? buildQuotaQuantity("1000.00"),
      patrimony:
        overrides.patrimony ?? buildPositiveMoney("50000.00"),
      applicationTotal:
        overrides.applicationTotal ??
        buildPositiveMoney("10000.00"),
      redemptionTotal:
        overrides.redemptionTotal ??
        buildPositiveMoney("5000.00"),
      cashFlowNet:
        overrides.cashFlowNet ?? buildSignedMoney("5000.00"),
      earnings:
        overrides.earnings ?? buildSignedMoney("1000.00"),
      returnDaily:
        overrides.returnDaily ?? buildSignedPercentage("0.50"),
      returnMonthly:
        overrides.returnMonthly === undefined
          ? null
          : overrides.returnMonthly,
      returnYearly:
        overrides.returnYearly === undefined
          ? null
          : overrides.returnYearly,
      returnLast12m:
        overrides.returnLast12m === undefined
          ? null
          : overrides.returnLast12m,
      allocation:
        overrides.allocation ?? buildSignedPercentage("50"),
      createdAt: overrides.createdAt,
    },
    overrides.id
  )
}
