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

export * from "@/__tests__/__seeds__/_application.seed";
export * from "@/__tests__/__seeds__/_norm.seed";
export * from "@/__tests__/__seeds__/_norms-portfolios.seed";
export * from "@/__tests__/__seeds__/_portfolio.seed";
export * from "@/__tests__/__seeds__/_position.seed";
export * from "@/__tests__/__seeds__/_transaction-allocation.seed";
export * from "@/__tests__/__seeds__/_withdrawal.seed";

export function newPortfolioRepository(): PortfolioRepository {
  return new PortfolioRepository(db);
}

export function newPositionRepository(): PositionRepository {
  return new PositionRepository(db);
}

export function newNormRepository(): NormRepository {
  return new NormRepository(db);
}

export function newNormsPortfoliosRepository(): NormsPortfoliosRepository {
  return new NormsPortfoliosRepository(db);
}

export function newApplicationRepository(): ApplicationRepository {
  return new ApplicationRepository(db);
}

export function newWithdrawalRepository(): WithdrawalRepository {
  return new WithdrawalRepository(db);
}

export function newTransactionAllocationRepository(): TransactionAllocationRepository {
  return new TransactionAllocationRepository(db);
}
