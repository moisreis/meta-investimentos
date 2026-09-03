import { AuditLog } from "@/business/entities/audit/audit-log.entity";
import { Bank } from "@/business/entities/bank/bank.entity";
import { BankAccount } from "@/business/entities/bank/bank-account.entity";
import { CheckingAccount } from "@/business/entities/bank/checking-account.entity";
import { Benchmark } from "@/business/entities/benchmark/benchmark.entity";
import { BenchmarkHistory } from "@/business/entities/benchmark/benchmark-history.entity";
import { Category } from "@/business/entities/fund/category.entity";
import { Fund } from "@/business/entities/fund/fund.entity";
import { Quota } from "@/business/entities/fund/quota.entity";
import { PortfolioPerformance } from "@/business/entities/performance/portfolio-performance.entity";
import { PositionPerformance } from "@/business/entities/performance/position-performance.entity";
import { Application } from "@/business/entities/portfolio/application.entity";
import { Norm } from "@/business/entities/portfolio/norm.entity";
import { NormsPortfolios } from "@/business/entities/portfolio/norms-portfolios.entity";
import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import { Position } from "@/business/entities/portfolio/position.entity";
import { TransactionAllocation } from "@/business/entities/portfolio/transaction-allocation.entity";
import { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import { Statement } from "@/business/entities/report/statement.entity";
import { Account } from "@/business/entities/user/account.entity";
import { Session } from "@/business/entities/user/session.entity";
import { User } from "@/business/entities/user/user.entity";
import { Verification } from "@/business/entities/user/verification.entity";
import { CNPJ } from "@/business/value-objects/cnpj.vo";
import { CPF } from "@/business/value-objects/cpf.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

import {
  ACCOUNT_ID,
  APPLICATION_ID,
  AUDIT_LOG_ID,
  BANK_ACCOUNT_ID,
  BANK_ID,
  BENCHMARK_HISTORY_ID,
  BENCHMARK_ID,
  CATEGORY_ID,
  CHECKING_ACCOUNT_ID,
  EXTERNAL_APPLICATION_ID,
  EXTERNAL_BENCHMARK_HISTORY_ID,
  EXTERNAL_CHECKING_ACCOUNT_ID,
  EXTERNAL_PORTFOLIO_PERFORMANCE_ID,
  EXTERNAL_POSITION_PERFORMANCE_ID,
  EXTERNAL_QUOTA_ID,
  EXTERNAL_WITHDRAWAL_ID,
  FUND_ID,
  NORM_ID,
  OTHER_ACCOUNT_ID,
  OTHER_APPLICATION_ID,
  OTHER_AUDIT_LOG_ID,
  OTHER_BANK_ACCOUNT_ID,
  OTHER_BANK_ID,
  OTHER_BENCHMARK_HISTORY_ID,
  OTHER_BENCHMARK_ID,
  OTHER_CATEGORY_ID,
  OTHER_CHECKING_ACCOUNT_ID,
  OTHER_FUND_ID,
  OTHER_NORM_ID,
  OTHER_PORTFOLIO_ID,
  OTHER_PORTFOLIO_PERFORMANCE_ID,
  OTHER_POSITION_ID,
  OTHER_POSITION_PERFORMANCE_ID,
  OTHER_QUOTA_ID,
  OTHER_SESSION_ID,
  OTHER_STATEMENT_ID,
  OTHER_TRANSACTION_ALLOCATION_ID,
  OTHER_USER_ID,
  OTHER_VERIFICATION_ID,
  OTHER_WITHDRAWAL_ID,
  PERIOD_OUTSIDE_APPLICATION_ID,
  PERIOD_OUTSIDE_BENCHMARK_HISTORY_ID,
  PERIOD_OUTSIDE_CHECKING_ACCOUNT_ID,
  PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE_ID,
  PERIOD_OUTSIDE_POSITION_PERFORMANCE_ID,
  PERIOD_OUTSIDE_QUOTA_ID,
  PERIOD_OUTSIDE_WITHDRAWAL_ID,
  PORTFOLIO_ID,
  PORTFOLIO_PERFORMANCE_ID,
  POSITION_ID,
  POSITION_PERFORMANCE_ID,
  QUOTA_ID,
  SECOND_ALLOCATION_ID,
  SECOND_VERIFICATION_ID,
  SESSION_ID,
  STATEMENT_ID,
  THIRD_ACCOUNT_ID,
  THIRD_BANK_ACCOUNT_ID,
  THIRD_PORTFOLIO_ID,
  THIRD_POSITION_ID,
  THIRD_SESSION_ID,
  THIRD_STATEMENT_ID,
  TRANSACTION_ALLOCATION_ID,
  USER_ID,
  VERIFICATION_ID,
  WITHDRAWAL_ID,
} from "./_ids";

export const EXPIRES_AT = new Date("2026-02-01T00:00:00.000Z");

export const APPLICATION_DATE = new Date("2026-01-15T00:00:00.000Z");
export const OTHER_APPLICATION_DATE = new Date("2026-02-15T00:00:00.000Z");

export const WITHDRAWAL_DATE = new Date("2026-01-20T00:00:00.000Z");
export const OTHER_WITHDRAWAL_DATE = new Date("2026-02-20T00:00:00.000Z");

export const QUOTA_DATE = new Date("2026-01-05T00:00:00.000Z");
export const QUOTA_DUPLICATE_DATE = new Date("2026-01-15T00:00:00.000Z");
export const FEBRUARY_QUOTA_DATE = new Date("2026-02-05T00:00:00.000Z");

export const HISTORY_DATE = new Date("2026-01-05T00:00:00.000Z");
export const HISTORY_DUPLICATE_DATE = new Date("2026-01-15T00:00:00.000Z");
export const FEBRUARY_HISTORY_DATE = new Date("2026-02-05T00:00:00.000Z");

export const JANUARY_DATE = new Date("2026-01-05T00:00:00.000Z");
export const JANUARY_DUPLICATE_DATE = new Date("2026-01-15T00:00:00.000Z");
export const FEBRUARY_DATE = new Date("2026-02-10T00:00:00.000Z");

export const PERFORMANCE_DATE = new Date("2026-01-05T00:00:00.000Z");
export const PERFORMANCE_DUPLICATE_DATE = new Date("2026-01-15T00:00:00.000Z");
export const FEBRUARY_PERFORMANCE_DATE = new Date("2026-02-05T00:00:00.000Z");

export const JANUARY_WINDOW = {
  start: new Date("2026-01-01T00:00:00.000Z"),
  end: new Date("2026-01-31T00:00:00.000Z"),
};

export const USER = User.create(
  {
    name: "José da Silva",
    email: "jose@example.com",
    firstName: "José",
    lastName: "da Silva",
    cpf: CPF.create("52998224725"),
  },
  USER_ID,
);

export const OTHER_USER = User.create(
  {
    name: "Maria Souza",
    email: "maria@example.com",
    firstName: "Maria",
    lastName: "Souza",
    cpf: CPF.create("12345678909"),
  },
  OTHER_USER_ID,
);

export const FRESH_USER = User.create({
  name: "Felipe Rocha",
  email: "felipe@example.com",
  firstName: "Felipe",
  lastName: "Rocha",
  cpf: CPF.create("11144477735"),
});

export const UPDATED_USER = User.create(
  {
    name: "José da Silva Junior",
    email: USER.email,
    firstName: USER.firstName,
    lastName: "da Silva Junior",
    cpf: USER.cpf,
  },
  USER_ID,
);

export const USERS = [USER, OTHER_USER];
export const USER_IDS = [USER_ID, OTHER_USER_ID];

export const ACCOUNT = Account.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octocat",
    userId: EntityId.create(USER_ID),
  },
  ACCOUNT_ID,
);

export const OTHER_ACCOUNT = Account.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octodog",
    userId: EntityId.create(OTHER_USER_ID),
  },
  OTHER_ACCOUNT_ID,
);

export const THIRD_ACCOUNT = Account.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octopus",
    userId: EntityId.create(USER_ID),
  },
  THIRD_ACCOUNT_ID,
);

export const UPDATED_ACCOUNT = Account.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octocat-updated",
    userId: EntityId.create(USER_ID),
  },
  ACCOUNT_ID,
);

export const FRESH_ACCOUNT = Account.create({
  issuer: "github",
  providerId: "github",
  accountId: "fresh-bot",
  userId: EntityId.create(USER_ID),
});

export const ACCOUNTS = [ACCOUNT, OTHER_ACCOUNT];

export const SESSION = Session.create(
  {
    userId: EntityId.create(USER_ID),
    token: "session-token",
    expiresAt: EXPIRES_AT,
  },
  SESSION_ID,
);

export const OTHER_SESSION = Session.create(
  {
    userId: EntityId.create(OTHER_USER_ID),
    token: "other-session-token",
    expiresAt: EXPIRES_AT,
  },
  OTHER_SESSION_ID,
);

export const THIRD_SESSION = Session.create(
  {
    userId: EntityId.create(USER_ID),
    token: "third-session-token",
    expiresAt: EXPIRES_AT,
  },
  THIRD_SESSION_ID,
);

export const UPDATED_SESSION = Session.create(
  {
    userId: EntityId.create(USER_ID),
    token: "updated-session-token",
    expiresAt: EXPIRES_AT,
  },
  SESSION_ID,
);

export const FRESH_SESSION = Session.create({
  userId: EntityId.create(USER_ID),
  token: "fresh-session-token",
  expiresAt: EXPIRES_AT,
});

export const SESSIONS = [SESSION, OTHER_SESSION];

export const VERIFICATION = Verification.create(
  {
    identifier: "reset-password:jose@example.com",
    value: "reset-token",
    expiresAt: EXPIRES_AT,
  },
  VERIFICATION_ID,
);

export const OTHER_VERIFICATION = Verification.create(
  {
    identifier: "reset-password:maria@example.com",
    value: "other-reset-token",
    expiresAt: EXPIRES_AT,
  },
  OTHER_VERIFICATION_ID,
);

export const SECOND_VERIFICATION = Verification.create(
  {
    identifier: "reset-password:jose@example.com",
    value: "second-reset-token",
    expiresAt: EXPIRES_AT,
  },
  SECOND_VERIFICATION_ID,
);

export const UPDATED_VERIFICATION = Verification.create(
  {
    identifier: VERIFICATION.identifier,
    value: "updated-reset-token",
    expiresAt: EXPIRES_AT,
  },
  VERIFICATION_ID,
);

export const FRESH_VERIFICATION = Verification.create({
  identifier: "reset-password:fresh@example.com",
  value: "fresh-token",
  expiresAt: EXPIRES_AT,
});

export const VERIFICATIONS = [VERIFICATION, OTHER_VERIFICATION];

export const BANK = Bank.create(
  { code: "001", name: "Banco do Brasil" },
  BANK_ID,
);

export const OTHER_BANK = Bank.create(
  { code: "002", name: "Itaú Unibanco" },
  OTHER_BANK_ID,
);

export const FRESH_BANK = Bank.create({ code: "003", name: "Bradesco" });

export const UPDATED_BANK = Bank.create(
  { code: BANK.code, name: "Banco do Brasil S.A." },
  BANK_ID,
);

export const BANK_ACCOUNT = BankAccount.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    bankId: EntityId.create(BANK_ID),
    agency: "0001",
    accountNumber: "12345-6",
  },
  BANK_ACCOUNT_ID,
);

export const OTHER_BANK_ACCOUNT = BankAccount.create(
  {
    portfolioId: EntityId.create(OTHER_PORTFOLIO_ID),
    bankId: EntityId.create(OTHER_BANK_ID),
    agency: "0002",
    accountNumber: "67890-1",
  },
  OTHER_BANK_ACCOUNT_ID,
);

export const THIRD_BANK_ACCOUNT = BankAccount.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    bankId: EntityId.create(OTHER_BANK_ID),
    agency: "0003",
    accountNumber: "11111-2",
  },
  THIRD_BANK_ACCOUNT_ID,
);

export const UPDATED_BANK_ACCOUNT = BankAccount.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    bankId: EntityId.create(BANK_ID),
    agency: "0001",
    accountNumber: "54321-0",
  },
  BANK_ACCOUNT_ID,
);

export const FRESH_BANK_ACCOUNT = BankAccount.create({
  portfolioId: EntityId.create(PORTFOLIO_ID),
  bankId: EntityId.create(BANK_ID),
  agency: "0004",
  accountNumber: "99999-9",
});

export const CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(BANK_ACCOUNT_ID),
    date: JANUARY_DATE,
    value: SignedMoney.create("1234.56"),
  },
  CHECKING_ACCOUNT_ID,
);

export const OTHER_CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(OTHER_BANK_ACCOUNT_ID),
    date: FEBRUARY_DATE,
    value: SignedMoney.create("-50.00"),
  },
  OTHER_CHECKING_ACCOUNT_ID,
);

export const EXTERNAL_CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(BANK_ACCOUNT_ID),
    date: JANUARY_DUPLICATE_DATE,
    value: SignedMoney.create("2000.00"),
  },
  EXTERNAL_CHECKING_ACCOUNT_ID,
);

export const PERIOD_OUTSIDE_CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(BANK_ACCOUNT_ID),
    date: new Date("2026-03-01T00:00:00.000Z"),
    value: SignedMoney.create("500.00"),
  },
  PERIOD_OUTSIDE_CHECKING_ACCOUNT_ID,
);

export const UPDATED_CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(BANK_ACCOUNT_ID),
    date: JANUARY_DATE,
    value: SignedMoney.create("4321.10"),
  },
  CHECKING_ACCOUNT_ID,
);

export const FRESH_CHECKING_ACCOUNT = CheckingAccount.create({
  bankAccountId: EntityId.create(BANK_ACCOUNT_ID),
  date: new Date("2026-04-05T00:00:00.000Z"),
  value: SignedMoney.create("3000.00"),
});

export const BENCHMARK = Benchmark.create(
  { acronym: "IBOV", name: "Ibovespa" },
  BENCHMARK_ID,
);

export const OTHER_BENCHMARK = Benchmark.create(
  { acronym: "CDI", name: "CDI" },
  OTHER_BENCHMARK_ID,
);

export const FRESH_BENCHMARK = Benchmark.create({
  acronym: "IPCA",
  name: "IPCA+",
});

export const UPDATED_BENCHMARK = Benchmark.create(
  { acronym: BENCHMARK.acronym, name: "Ibovespa B3" },
  BENCHMARK_ID,
);

export const BENCHMARK_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: EntityId.create(BENCHMARK_ID),
    date: HISTORY_DATE,
    rate: SignedPercentage.create("1.25"),
  },
  BENCHMARK_HISTORY_ID,
);

export const OTHER_BENCHMARK_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: EntityId.create(OTHER_BENCHMARK_ID),
    date: FEBRUARY_HISTORY_DATE,
    rate: SignedPercentage.create("-0.5"),
  },
  OTHER_BENCHMARK_HISTORY_ID,
);

export const EXTERNAL_BENCHMARK_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: EntityId.create(BENCHMARK_ID),
    date: HISTORY_DUPLICATE_DATE,
    rate: SignedPercentage.create("0.75"),
  },
  EXTERNAL_BENCHMARK_HISTORY_ID,
);

export const PERIOD_OUTSIDE_BENCHMARK_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: EntityId.create(BENCHMARK_ID),
    date: new Date("2026-03-01T00:00:00.000Z"),
    rate: SignedPercentage.create("2.0"),
  },
  PERIOD_OUTSIDE_BENCHMARK_HISTORY_ID,
);

export const UPDATED_BENCHMARK_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: EntityId.create(BENCHMARK_ID),
    date: HISTORY_DATE,
    rate: SignedPercentage.create("1.5"),
  },
  BENCHMARK_HISTORY_ID,
);

export const FRESH_BENCHMARK_HISTORY = BenchmarkHistory.create({
  benchmarkId: EntityId.create(BENCHMARK_ID),
  date: new Date("2026-04-05T00:00:00.000Z"),
  rate: SignedPercentage.create("1.1"),
});

export const CATEGORY = Category.create({ name: "Ações" }, CATEGORY_ID);

export const OTHER_CATEGORY = Category.create(
  { name: "Renda Fixa" },
  OTHER_CATEGORY_ID,
);

export const FRESH_CATEGORY = Category.create({ name: "Multimercado" });

export const UPDATED_CATEGORY = Category.create(
  { name: "Ações Brasileiras" },
  CATEGORY_ID,
);

export const FUND = Fund.create(
  {
    cnpj: CNPJ.create("12345678000195"),
    name: "Fundo Ações",
    bankId: EntityId.create(BANK_ID),
    benchmarkId: EntityId.create(BENCHMARK_ID),
    categoryId: EntityId.create(CATEGORY_ID),
    administrationFee: SignedPercentage.create("1.5"),
    performanceFee: SignedPercentage.create("20"),
  },
  FUND_ID,
);

export const OTHER_FUND = Fund.create(
  {
    cnpj: CNPJ.create("11222333000181"),
    name: "Fundo Renda Fixa",
    bankId: EntityId.create(OTHER_BANK_ID),
  },
  OTHER_FUND_ID,
);

export const FRESH_FUND = Fund.create({
  cnpj: CNPJ.create("41142260000189"),
  name: "Fundo Multimercado",
  bankId: EntityId.create(BANK_ID),
  benchmarkId: EntityId.create(BENCHMARK_ID),
  categoryId: EntityId.create(CATEGORY_ID),
  administrationFee: SignedPercentage.create("1.2"),
  performanceFee: SignedPercentage.create("15"),
});

export const UPDATED_FUND = Fund.create(
  {
    cnpj: FUND.cnpj,
    name: "Fundo Ações Rebrandeado",
    bankId: FUND.bankId,
    benchmarkId: FUND.benchmarkId,
    categoryId: FUND.categoryId,
    administrationFee: SignedPercentage.create("2.0"),
    performanceFee: FUND.performanceFee,
  },
  FUND_ID,
);

export const QUOTA = Quota.create(
  {
    fundId: EntityId.create(FUND_ID),
    date: QUOTA_DATE,
    price: QuotaPrice.create("1000.00"),
  },
  QUOTA_ID,
);

export const OTHER_QUOTA = Quota.create(
  {
    fundId: EntityId.create(OTHER_FUND_ID),
    date: FEBRUARY_QUOTA_DATE,
    price: QuotaPrice.create("500.00"),
  },
  OTHER_QUOTA_ID,
);

export const EXTERNAL_QUOTA = Quota.create(
  {
    fundId: EntityId.create(FUND_ID),
    date: QUOTA_DUPLICATE_DATE,
    price: QuotaPrice.create("1010.50"),
  },
  EXTERNAL_QUOTA_ID,
);

export const PERIOD_OUTSIDE_QUOTA = Quota.create(
  {
    fundId: EntityId.create(FUND_ID),
    date: new Date("2026-03-01T00:00:00.000Z"),
    price: QuotaPrice.create("1020.00"),
  },
  PERIOD_OUTSIDE_QUOTA_ID,
);

export const UPDATED_QUOTA = Quota.create(
  {
    fundId: EntityId.create(FUND_ID),
    date: QUOTA_DATE,
    price: QuotaPrice.create("1050.00"),
  },
  QUOTA_ID,
);

export const FRESH_QUOTA = Quota.create({
  fundId: EntityId.create(FUND_ID),
  date: new Date("2026-04-05T00:00:00.000Z"),
  price: QuotaPrice.create("1030.00"),
});

export const PORTFOLIO = Portfolio.create(
  {
    acronym: "FIA",
    name: "Fundo de Investimento em Ações",
    userId: EntityId.create(USER_ID),
    annualInterestRate: SignedPercentage.create("10"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  },
  PORTFOLIO_ID,
);

export const OTHER_PORTFOLIO = Portfolio.create(
  {
    acronym: "RF",
    name: "Renda Fixa",
    userId: EntityId.create(OTHER_USER_ID),
    annualInterestRate: SignedPercentage.create("8"),
    minAllocation: SignedPercentage.create("10"),
    maxAllocation: SignedPercentage.create("30"),
    targetAllocation: SignedPercentage.create("18"),
  },
  OTHER_PORTFOLIO_ID,
);

export const THIRD_PORTFOLIO = Portfolio.create(
  {
    acronym: "CMB",
    name: "Carteira Multimercado",
    userId: EntityId.create(USER_ID),
    annualInterestRate: SignedPercentage.create("12"),
    minAllocation: SignedPercentage.create("0"),
    maxAllocation: SignedPercentage.create("40"),
    targetAllocation: SignedPercentage.create("20"),
  },
  THIRD_PORTFOLIO_ID,
);

export const FRESH_PORTFOLIO = Portfolio.create({
  acronym: "MM",
  name: "Fundo Multimercado",
  userId: EntityId.create(USER_ID),
  annualInterestRate: SignedPercentage.create("9"),
  minAllocation: SignedPercentage.create("0"),
  maxAllocation: SignedPercentage.create("30"),
  targetAllocation: SignedPercentage.create("15"),
});

export const UPDATED_PORTFOLIO = Portfolio.create(
  {
    acronym: PORTFOLIO.acronym,
    name: PORTFOLIO.name,
    userId: PORTFOLIO.userId,
    annualInterestRate: SignedPercentage.create("10"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("15"),
  },
  PORTFOLIO_ID,
);

export const NORM = Norm.create(
  {
    articleNumber: "Art. 1",
    name: "Política de Investimento",
    categoryId: EntityId.create(CATEGORY_ID),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  },
  NORM_ID,
);

export const OTHER_NORM = Norm.create(
  {
    articleNumber: "Art. 2",
    name: "Norma Renda Fixa",
    categoryId: EntityId.create(OTHER_CATEGORY_ID),
    minAllocation: SignedPercentage.create("10"),
    maxAllocation: SignedPercentage.create("30"),
    targetAllocation: SignedPercentage.create("18"),
  },
  OTHER_NORM_ID,
);

export const UPDATED_NORM = Norm.create(
  {
    articleNumber: NORM.articleNumber,
    name: NORM.name,
    categoryId: NORM.categoryId,
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("14"),
  },
  NORM_ID,
);

export const FRESH_NORM = Norm.create({
  articleNumber: "Art. 3",
  name: "Norma Multimercado",
  categoryId: EntityId.create(CATEGORY_ID),
  minAllocation: SignedPercentage.create("0"),
  maxAllocation: SignedPercentage.create("25"),
  targetAllocation: SignedPercentage.create("12"),
});

export const NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(NORM_ID),
  portfolioId: EntityId.create(PORTFOLIO_ID),
  minAllocation: SignedPercentage.create("5"),
  maxAllocation: SignedPercentage.create("20"),
  targetAllocation: SignedPercentage.create("12"),
});

export const OTHER_NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(OTHER_NORM_ID),
  portfolioId: EntityId.create(OTHER_PORTFOLIO_ID),
  minAllocation: SignedPercentage.create("10"),
  maxAllocation: SignedPercentage.create("30"),
  targetAllocation: SignedPercentage.create("18"),
});

export const ADDITIONAL_NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(OTHER_NORM_ID),
  portfolioId: EntityId.create(PORTFOLIO_ID),
  minAllocation: SignedPercentage.create("5"),
  maxAllocation: SignedPercentage.create("15"),
  targetAllocation: SignedPercentage.create("10"),
});

export const UPDATED_NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(NORM_ID),
  portfolioId: EntityId.create(PORTFOLIO_ID),
  minAllocation: SignedPercentage.create("5"),
  maxAllocation: SignedPercentage.create("25"),
  targetAllocation: SignedPercentage.create("14"),
});

export const POSITION = Position.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    fundId: EntityId.create(FUND_ID),
  },
  POSITION_ID,
);

export const OTHER_POSITION = Position.create(
  {
    portfolioId: EntityId.create(OTHER_PORTFOLIO_ID),
    fundId: EntityId.create(OTHER_FUND_ID),
  },
  OTHER_POSITION_ID,
);

export const THIRD_POSITION = Position.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    fundId: EntityId.create(OTHER_FUND_ID),
  },
  THIRD_POSITION_ID,
);

export const FRESH_POSITION = Position.create({
  portfolioId: EntityId.create(PORTFOLIO_ID),
  fundId: EntityId.create(FUND_ID),
});

export const UPDATED_POSITION = Position.create(
  {
    portfolioId: POSITION.portfolioId,
    fundId: POSITION.fundId,
    initialBalance: PositiveMoney.create("5000.00"),
    initialBalanceDate: new Date("2026-01-10T00:00:00.000Z"),
  },
  POSITION_ID,
);

export const APPLICATION = Application.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: APPLICATION_DATE,
    amount: PositiveMoney.create("1000.00"),
    quotas: QuotaQuantity.create("12.345"),
  },
  APPLICATION_ID,
);

export const OTHER_APPLICATION = Application.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: OTHER_APPLICATION_DATE,
    amount: PositiveMoney.create("500.00"),
    quotas: QuotaQuantity.create("6.123"),
  },
  OTHER_APPLICATION_ID,
);

export const EXTERNAL_APPLICATION = Application.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: new Date("2026-01-18T00:00:00.000Z"),
    amount: PositiveMoney.create("200.00"),
    quotas: QuotaQuantity.create("2.4"),
  },
  EXTERNAL_APPLICATION_ID,
);

export const PERIOD_OUTSIDE_APPLICATION = Application.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: new Date("2026-03-05T00:00:00.000Z"),
    amount: PositiveMoney.create("400.00"),
    quotas: QuotaQuantity.create("4.8"),
  },
  PERIOD_OUTSIDE_APPLICATION_ID,
);

export const UPDATED_APPLICATION = Application.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: APPLICATION_DATE,
    amount: PositiveMoney.create("1000.00"),
    quotas: QuotaQuantity.create("12.345"),
    reversedAt: new Date("2026-01-30T00:00:00.000Z"),
    reversedByUserId: EntityId.create(USER_ID),
  },
  APPLICATION_ID,
);

export const FRESH_APPLICATION = Application.create({
  positionId: EntityId.create(POSITION_ID),
  date: new Date("2026-04-15T00:00:00.000Z"),
  amount: PositiveMoney.create("750.00"),
  quotas: QuotaQuantity.create("8.5"),
});

export const APPLICATIONS = [
  APPLICATION,
  OTHER_APPLICATION,
  EXTERNAL_APPLICATION,
  PERIOD_OUTSIDE_APPLICATION,
];

export const APPLICATION_SUM_AMOUNT = PositiveMoney.create("1200.00");
export const APPLICATION_SUM_QUOTAS = QuotaQuantity.create("14.745");

export const WITHDRAWAL = Withdrawal.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: WITHDRAWAL_DATE,
    amount: PositiveMoney.create("500.00"),
    quotas: QuotaQuantity.create("6.123"),
  },
  WITHDRAWAL_ID,
);

export const OTHER_WITHDRAWAL = Withdrawal.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: OTHER_WITHDRAWAL_DATE,
    amount: PositiveMoney.create("250.00"),
    quotas: QuotaQuantity.create("3.0615"),
  },
  OTHER_WITHDRAWAL_ID,
);

export const EXTERNAL_WITHDRAWAL = Withdrawal.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: new Date("2026-01-22T00:00:00.000Z"),
    amount: PositiveMoney.create("100.00"),
    quotas: QuotaQuantity.create("1.2"),
  },
  EXTERNAL_WITHDRAWAL_ID,
);

export const PERIOD_OUTSIDE_WITHDRAWAL = Withdrawal.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: new Date("2026-03-10T00:00:00.000Z"),
    amount: PositiveMoney.create("150.00"),
    quotas: QuotaQuantity.create("1.8"),
  },
  PERIOD_OUTSIDE_WITHDRAWAL_ID,
);

export const UPDATED_WITHDRAWAL = Withdrawal.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: WITHDRAWAL_DATE,
    amount: PositiveMoney.create("500.00"),
    quotas: QuotaQuantity.create("6.123"),
    reversedAt: new Date("2026-02-01T00:00:00.000Z"),
    reversedByUserId: EntityId.create(USER_ID),
  },
  WITHDRAWAL_ID,
);

export const FRESH_WITHDRAWAL = Withdrawal.create({
  positionId: EntityId.create(POSITION_ID),
  date: new Date("2026-04-20T00:00:00.000Z"),
  amount: PositiveMoney.create("300.00"),
  quotas: QuotaQuantity.create("3.4"),
});

export const WITHDRAWALS = [
  WITHDRAWAL,
  OTHER_WITHDRAWAL,
  EXTERNAL_WITHDRAWAL,
  PERIOD_OUTSIDE_WITHDRAWAL,
];

export const WITHDRAWAL_SUM_AMOUNT = PositiveMoney.create("600.00");
export const WITHDRAWAL_SUM_QUOTAS = QuotaQuantity.create("7.323");

export const TRANSACTION_ALLOCATION = TransactionAllocation.create(
  {
    applicationId: EntityId.create(APPLICATION_ID),
    withdrawId: EntityId.create(WITHDRAWAL_ID),
    quotasConsumed: QuotaQuantity.create("3.0"),
  },
  TRANSACTION_ALLOCATION_ID,
);

export const OTHER_TRANSACTION_ALLOCATION = TransactionAllocation.create(
  {
    applicationId: EntityId.create(OTHER_APPLICATION_ID),
    withdrawId: EntityId.create(OTHER_WITHDRAWAL_ID),
    quotasConsumed: QuotaQuantity.create("2.0"),
  },
  OTHER_TRANSACTION_ALLOCATION_ID,
);

export const SECOND_ALLOCATION = TransactionAllocation.create(
  {
    applicationId: EntityId.create(APPLICATION_ID),
    withdrawId: EntityId.create(OTHER_WITHDRAWAL_ID),
    quotasConsumed: QuotaQuantity.create("1.5"),
  },
  SECOND_ALLOCATION_ID,
);

export const FRESH_ALLOCATION = TransactionAllocation.create({
  applicationId: EntityId.create(OTHER_APPLICATION_ID),
  withdrawId: EntityId.create(WITHDRAWAL_ID),
  quotasConsumed: QuotaQuantity.create("2.5"),
});

export const UPDATED_TRANSACTION_ALLOCATION = TransactionAllocation.create(
  {
    applicationId: EntityId.create(APPLICATION_ID),
    withdrawId: EntityId.create(WITHDRAWAL_ID),
    quotasConsumed: QuotaQuantity.create("3.5"),
  },
  TRANSACTION_ALLOCATION_ID,
);

export const CONSUMED_QUOTAS_SUM = QuotaQuantity.create("4.5");

export const POSITION_PERFORMANCE = PositionPerformance.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: PERFORMANCE_DATE,
    quotasHeld: QuotaQuantity.create("1000"),
    patrimony: PositiveMoney.create("100000.00"),
    applicationTotal: PositiveMoney.create("50000.00"),
    redemptionTotal: PositiveMoney.create("20000.00"),
    cashFlowNet: SignedMoney.create("30000.00"),
    earnings: SignedMoney.create("5000.00"),
    returnDaily: SignedPercentage.create("0.5"),
    returnMonthly: SignedPercentage.create("2.0"),
    returnYearly: SignedPercentage.create("10.0"),
    returnLast12m: SignedPercentage.create("8.0"),
    allocation: SignedPercentage.create("40.0"),
  },
  POSITION_PERFORMANCE_ID,
);

export const OTHER_POSITION_PERFORMANCE = PositionPerformance.create(
  {
    positionId: EntityId.create(OTHER_POSITION_ID),
    date: FEBRUARY_PERFORMANCE_DATE,
    quotasHeld: QuotaQuantity.create("500"),
    patrimony: PositiveMoney.create("50000.00"),
    applicationTotal: PositiveMoney.create("30000.00"),
    redemptionTotal: PositiveMoney.create("10000.00"),
    cashFlowNet: SignedMoney.create("20000.00"),
    earnings: SignedMoney.create("2000.00"),
    returnDaily: SignedPercentage.create("0.3"),
    returnMonthly: SignedPercentage.create("1.5"),
    returnYearly: SignedPercentage.create("6.0"),
    returnLast12m: SignedPercentage.create("5.0"),
    allocation: SignedPercentage.create("60.0"),
  },
  OTHER_POSITION_PERFORMANCE_ID,
);

export const EXTERNAL_POSITION_PERFORMANCE = PositionPerformance.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: PERFORMANCE_DUPLICATE_DATE,
    quotasHeld: QuotaQuantity.create("1100"),
    patrimony: PositiveMoney.create("110000.00"),
    applicationTotal: PositiveMoney.create("55000.00"),
    redemptionTotal: PositiveMoney.create("20000.00"),
    cashFlowNet: SignedMoney.create("35000.00"),
    earnings: SignedMoney.create("6000.00"),
    returnDaily: SignedPercentage.create("1.0"),
    returnMonthly: SignedPercentage.create("3.0"),
    returnYearly: SignedPercentage.create("11.0"),
    returnLast12m: SignedPercentage.create("9.0"),
    allocation: SignedPercentage.create("45.0"),
  },
  EXTERNAL_POSITION_PERFORMANCE_ID,
);

export const PERIOD_OUTSIDE_POSITION_PERFORMANCE = PositionPerformance.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: new Date("2026-03-01T00:00:00.000Z"),
    quotasHeld: QuotaQuantity.create("1200"),
    patrimony: PositiveMoney.create("120000.00"),
    applicationTotal: PositiveMoney.create("60000.00"),
    redemptionTotal: PositiveMoney.create("25000.00"),
    cashFlowNet: SignedMoney.create("35000.00"),
    earnings: SignedMoney.create("7000.00"),
    returnDaily: SignedPercentage.create("0.8"),
    returnMonthly: SignedPercentage.create("4.0"),
    returnYearly: SignedPercentage.create("12.0"),
    returnLast12m: SignedPercentage.create("10.0"),
    allocation: SignedPercentage.create("50.0"),
  },
  PERIOD_OUTSIDE_POSITION_PERFORMANCE_ID,
);

export const UPDATED_POSITION_PERFORMANCE = PositionPerformance.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: PERFORMANCE_DATE,
    quotasHeld: QuotaQuantity.create("1000"),
    patrimony: PositiveMoney.create("125000.00"),
    applicationTotal: PositiveMoney.create("50000.00"),
    redemptionTotal: PositiveMoney.create("20000.00"),
    cashFlowNet: SignedMoney.create("30000.00"),
    earnings: SignedMoney.create("7500.00"),
    returnDaily: SignedPercentage.create("0.5"),
    returnMonthly: SignedPercentage.create("2.0"),
    returnYearly: SignedPercentage.create("10.0"),
    returnLast12m: SignedPercentage.create("8.0"),
    allocation: SignedPercentage.create("45.0"),
  },
  POSITION_PERFORMANCE_ID,
);

export const FRESH_POSITION_PERFORMANCE = PositionPerformance.create({
  positionId: EntityId.create(POSITION_ID),
  date: new Date("2026-04-05T00:00:00.000Z"),
  quotasHeld: QuotaQuantity.create("1300"),
  patrimony: PositiveMoney.create("130000.00"),
  applicationTotal: PositiveMoney.create("65000.00"),
  redemptionTotal: PositiveMoney.create("25000.00"),
  cashFlowNet: SignedMoney.create("40000.00"),
  earnings: SignedMoney.create("8000.00"),
  returnDaily: SignedPercentage.create("0.9"),
  returnMonthly: SignedPercentage.create("4.5"),
  returnYearly: SignedPercentage.create("13.0"),
  returnLast12m: SignedPercentage.create("11.0"),
  allocation: SignedPercentage.create("55.0"),
});

export const PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    date: PERFORMANCE_DATE,
    quotasHeld: QuotaQuantity.create("1000"),
    patrimony: PositiveMoney.create("100000.00"),
    applicationTotal: PositiveMoney.create("50000.00"),
    redemptionTotal: PositiveMoney.create("20000.00"),
    cashFlowNet: SignedMoney.create("30000.00"),
    earnings: SignedMoney.create("5000.00"),
    returnDaily: SignedPercentage.create("0.5"),
    returnMonthly: SignedPercentage.create("2.0"),
    returnYearly: SignedPercentage.create("10.0"),
    returnLast12m: SignedPercentage.create("8.0"),
    target: SignedPercentage.create("12.0"),
    cumulativeTarget: SignedPercentage.create("15.0"),
    inflationSpread: SignedPercentage.create("3.0"),
    riskFreeSpread: SignedPercentage.create("1.0"),
    marketSpread: SignedPercentage.create("2.0"),
  },
  PORTFOLIO_PERFORMANCE_ID,
);

export const OTHER_PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(
  {
    portfolioId: EntityId.create(OTHER_PORTFOLIO_ID),
    date: FEBRUARY_PERFORMANCE_DATE,
    quotasHeld: QuotaQuantity.create("500"),
    patrimony: PositiveMoney.create("50000.00"),
    applicationTotal: PositiveMoney.create("30000.00"),
    redemptionTotal: PositiveMoney.create("10000.00"),
    cashFlowNet: SignedMoney.create("20000.00"),
    earnings: SignedMoney.create("2000.00"),
    returnDaily: SignedPercentage.create("0.3"),
    returnMonthly: SignedPercentage.create("1.5"),
    returnYearly: SignedPercentage.create("6.0"),
    returnLast12m: SignedPercentage.create("5.0"),
    target: SignedPercentage.create("10.0"),
    cumulativeTarget: SignedPercentage.create("12.0"),
    inflationSpread: SignedPercentage.create("2.0"),
    riskFreeSpread: SignedPercentage.create("0.5"),
    marketSpread: SignedPercentage.create("1.5"),
  },
  OTHER_PORTFOLIO_PERFORMANCE_ID,
);

export const EXTERNAL_PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    date: PERFORMANCE_DUPLICATE_DATE,
    quotasHeld: QuotaQuantity.create("1100"),
    patrimony: PositiveMoney.create("110000.00"),
    applicationTotal: PositiveMoney.create("55000.00"),
    redemptionTotal: PositiveMoney.create("20000.00"),
    cashFlowNet: SignedMoney.create("35000.00"),
    earnings: SignedMoney.create("6000.00"),
    returnDaily: SignedPercentage.create("1.0"),
    returnMonthly: SignedPercentage.create("3.0"),
    returnYearly: SignedPercentage.create("11.0"),
    returnLast12m: SignedPercentage.create("9.0"),
    target: SignedPercentage.create("12.0"),
    cumulativeTarget: SignedPercentage.create("16.0"),
    inflationSpread: SignedPercentage.create("3.5"),
    riskFreeSpread: SignedPercentage.create("1.0"),
    marketSpread: SignedPercentage.create("2.5"),
  },
  EXTERNAL_PORTFOLIO_PERFORMANCE_ID,
);

export const PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    date: new Date("2026-03-01T00:00:00.000Z"),
    quotasHeld: QuotaQuantity.create("1200"),
    patrimony: PositiveMoney.create("120000.00"),
    applicationTotal: PositiveMoney.create("60000.00"),
    redemptionTotal: PositiveMoney.create("25000.00"),
    cashFlowNet: SignedMoney.create("35000.00"),
    earnings: SignedMoney.create("7000.00"),
    returnDaily: SignedPercentage.create("0.8"),
    returnMonthly: SignedPercentage.create("4.0"),
    returnYearly: SignedPercentage.create("12.0"),
    returnLast12m: SignedPercentage.create("10.0"),
    target: SignedPercentage.create("12.0"),
    cumulativeTarget: SignedPercentage.create("18.0"),
    inflationSpread: SignedPercentage.create("4.0"),
    riskFreeSpread: SignedPercentage.create("1.2"),
    marketSpread: SignedPercentage.create("2.8"),
  },
  PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE_ID,
);

export const UPDATED_PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    date: PERFORMANCE_DATE,
    quotasHeld: QuotaQuantity.create("1000"),
    patrimony: PositiveMoney.create("120000.00"),
    applicationTotal: PositiveMoney.create("50000.00"),
    redemptionTotal: PositiveMoney.create("20000.00"),
    cashFlowNet: SignedMoney.create("30000.00"),
    earnings: SignedMoney.create("7000.00"),
    returnDaily: SignedPercentage.create("0.5"),
    returnMonthly: SignedPercentage.create("2.0"),
    returnYearly: SignedPercentage.create("10.0"),
    returnLast12m: SignedPercentage.create("8.0"),
    target: SignedPercentage.create("12.0"),
    cumulativeTarget: SignedPercentage.create("15.0"),
    inflationSpread: SignedPercentage.create("3.0"),
    riskFreeSpread: SignedPercentage.create("1.0"),
    marketSpread: SignedPercentage.create("2.0"),
  },
  PORTFOLIO_PERFORMANCE_ID,
);

export const FRESH_PORTFOLIO_PERFORMANCE = PortfolioPerformance.create({
  portfolioId: EntityId.create(PORTFOLIO_ID),
  date: new Date("2026-04-05T00:00:00.000Z"),
  quotasHeld: QuotaQuantity.create("1300"),
  patrimony: PositiveMoney.create("130000.00"),
  applicationTotal: PositiveMoney.create("65000.00"),
  redemptionTotal: PositiveMoney.create("25000.00"),
  cashFlowNet: SignedMoney.create("40000.00"),
  earnings: SignedMoney.create("8000.00"),
  returnDaily: SignedPercentage.create("0.9"),
  returnMonthly: SignedPercentage.create("4.5"),
  returnYearly: SignedPercentage.create("13.0"),
  returnLast12m: SignedPercentage.create("11.0"),
  target: SignedPercentage.create("12.0"),
  cumulativeTarget: SignedPercentage.create("20.0"),
  inflationSpread: SignedPercentage.create("4.2"),
  riskFreeSpread: SignedPercentage.create("1.1"),
  marketSpread: SignedPercentage.create("3.1"),
});

export const STATEMENT = Statement.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    periodStart: new Date("2026-01-01T00:00:00.000Z"),
    periodEnd: new Date("2026-01-31T00:00:00.000Z"),
    fileUrl: "https://example.com/statements/fia-january.pdf",
    generatedByUserId: EntityId.create(USER_ID),
  },
  STATEMENT_ID,
);

export const OTHER_STATEMENT = Statement.create(
  {
    portfolioId: EntityId.create(OTHER_PORTFOLIO_ID),
    periodStart: new Date("2026-02-01T00:00:00.000Z"),
    periodEnd: new Date("2026-02-28T00:00:00.000Z"),
    fileUrl: "https://example.com/statements/rf-february.pdf",
    generatedByUserId: EntityId.create(USER_ID),
  },
  OTHER_STATEMENT_ID,
);

export const THIRD_STATEMENT = Statement.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    periodStart: new Date("2026-03-01T00:00:00.000Z"),
    periodEnd: new Date("2026-03-31T00:00:00.000Z"),
    fileUrl: "https://example.com/statements/fia-march.pdf",
    generatedByUserId: EntityId.create(OTHER_USER_ID),
  },
  THIRD_STATEMENT_ID,
);

export const UPDATED_STATEMENT = Statement.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    periodStart: STATEMENT.periodStart,
    periodEnd: STATEMENT.periodEnd,
    fileUrl: "https://example.com/statements/fia-january-v2.pdf",
    generatedByUserId: EntityId.create(USER_ID),
  },
  STATEMENT_ID,
);

export const FRESH_STATEMENT = Statement.create({
  portfolioId: EntityId.create(PORTFOLIO_ID),
  periodStart: new Date("2026-04-01T00:00:00.000Z"),
  periodEnd: new Date("2026-04-30T00:00:00.000Z"),
  fileUrl: "https://example.com/statements/fia-april.pdf",
  generatedByUserId: EntityId.create(USER_ID),
});

export const AUDIT_LOG = AuditLog.create(
  {
    entity: "user",
    entityId: EntityId.create(USER_ID),
    action: "update",
    changes: { name: { from: "José", to: "José da Silva Junior" } },
    userId: EntityId.create(USER_ID),
  },
  AUDIT_LOG_ID,
);

export const OTHER_AUDIT_LOG = AuditLog.create(
  {
    entity: "portfolio",
    entityId: EntityId.create(PORTFOLIO_ID),
    action: "create",
    changes: null,
    userId: EntityId.create(OTHER_USER_ID),
  },
  OTHER_AUDIT_LOG_ID,
);
