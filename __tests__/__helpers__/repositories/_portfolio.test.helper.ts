import { db } from "@/__tests__/__setup__/_database.setup";
import {
  ApplicationRepository,
  NormRepository,
  NormsPortfoliosRepository,
  PortfolioRepository,
  PositionRepository,
  TransactionAllocationRepository,
  WithdrawalRepository,
} from "@/infrastructure/repositories";

/**
 * Re-exports all application seed fixtures and functions
 * used by portfolio-related repository tests.
 */
export * from "@/__tests__/__seeds__/_application.seed";

/**
 * Re-exports all norm seed fixtures and functions used
 * by norm repository tests.
 */
export * from "@/__tests__/__seeds__/_norm.seed";

/**
 * Re-exports all norms-portfolios seed fixtures and
 * functions used by norms-portfolios repository tests.
 */
export * from "@/__tests__/__seeds__/_norms-portfolios.seed";

/**
 * Re-exports all portfolio seed fixtures and functions
 * used by portfolio repository tests.
 */
export * from "@/__tests__/__seeds__/_portfolio.seed";

/**
 * Re-exports all position seed fixtures and functions
 * used by position repository tests.
 */
export * from "@/__tests__/__seeds__/_position.seed";

/**
 * Re-exports all transaction allocation seed fixtures
 * and functions used by allocation repository tests.
 */
export * from "@/__tests__/__seeds__/_transaction-allocation.seed";

/**
 * Re-exports all withdrawal seed fixtures and functions
 * used by withdrawal repository tests.
 */
export * from "@/__tests__/__seeds__/_withdrawal.seed";

/**
 * Creates a new `PortfolioRepository` bound to the
 * shared test database.
 *
 * @returns A new `PortfolioRepository` instance.
 */
export function newPortfolioRepository(): PortfolioRepository {
  return new PortfolioRepository(db);
}

/**
 * Creates a new `PositionRepository` bound to the
 * shared test database.
 *
 * @returns A new `PositionRepository` instance.
 */
export function newPositionRepository(): PositionRepository {
  return new PositionRepository(db);
}

/**
 * Creates a new `NormRepository` bound to the shared
 * test database.
 *
 * @returns A new `NormRepository` instance.
 */
export function newNormRepository(): NormRepository {
  return new NormRepository(db);
}

/**
 * Creates a new `NormsPortfoliosRepository` bound to
 * the shared test database.
 *
 * @returns A new `NormsPortfoliosRepository` instance.
 */
export function newNormsPortfoliosRepository(): NormsPortfoliosRepository {
  return new NormsPortfoliosRepository(db);
}

/**
 * Creates a new `ApplicationRepository` bound to the
 * shared test database.
 *
 * @returns A new `ApplicationRepository` instance.
 */
export function newApplicationRepository(): ApplicationRepository {
  return new ApplicationRepository(db);
}

/**
 * Creates a new `WithdrawalRepository` bound to the
 * shared test database.
 *
 * @returns A new `WithdrawalRepository` instance.
 */
export function newWithdrawalRepository(): WithdrawalRepository {
  return new WithdrawalRepository(db);
}

/**
 * Creates a new `TransactionAllocationRepository` bound
 * to the shared test database.
 *
 * @returns A new `TransactionAllocationRepository` instance.
 */
export function newTransactionAllocationRepository(): TransactionAllocationRepository {
  return new TransactionAllocationRepository(db);
}
