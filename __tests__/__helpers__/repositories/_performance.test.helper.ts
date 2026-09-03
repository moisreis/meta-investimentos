import { db } from "@/__tests__/__setup__/_database.setup";
import {
  PortfolioPerformanceRepository,
  PositionPerformanceRepository,
} from "@/infrastructure/repositories";

/**
 * Re-exports the portfolio ID constants required by
 * portfolio performance seed setup.
 */
export {
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
} from "@/__tests__/__seeds__/_portfolio.seed";

/**
 * Re-exports the portfolio performance seed fixtures and
 * functions used by portfolio performance repository tests.
 */
export {
  EXTERNAL_PORTFOLIO_PERFORMANCE,
  EXTERNAL_PORTFOLIO_PERFORMANCE_ID,
  FEBRUARY_PERFORMANCE_DATE,
  FRESH_PORTFOLIO_PERFORMANCE,
  OTHER_PORTFOLIO_PERFORMANCE,
  OTHER_PORTFOLIO_PERFORMANCE_ID,
  PERFORMANCE_DATE,
  PERFORMANCE_DUPLICATE_DATE,
  PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE,
  PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE_ID,
  PORTFOLIO_PERFORMANCE,
  PORTFOLIO_PERFORMANCE_ID,
  seedAllPortfolioPerformances,
  seedPortfolioPerformances,
  UPDATED_PORTFOLIO_PERFORMANCE,
} from "@/__tests__/__seeds__/_portfolio-performance.seed";

/**
 * Re-exports the position ID constants required by
 * position performance seed setup.
 */
export {
  OTHER_POSITION_ID,
  POSITION_ID,
} from "@/__tests__/__seeds__/_position.seed";

/**
 * Re-exports the position performance seed fixtures and
 * functions used by position performance repository tests.
 */
export {
  EXTERNAL_POSITION_PERFORMANCE,
  EXTERNAL_POSITION_PERFORMANCE_ID,
  FRESH_POSITION_PERFORMANCE,
  OTHER_POSITION_PERFORMANCE,
  OTHER_POSITION_PERFORMANCE_ID,
  PERIOD_OUTSIDE_POSITION_PERFORMANCE,
  PERIOD_OUTSIDE_POSITION_PERFORMANCE_ID,
  POSITION_PERFORMANCE,
  POSITION_PERFORMANCE_ID,
  seedAllPositionPerformances,
  seedPositionPerformances,
  UPDATED_POSITION_PERFORMANCE,
} from "@/__tests__/__seeds__/_position-performance.seed";

/**
 * Creates a new `PortfolioPerformanceRepository` bound
 * to the shared test database.
 *
 * @returns A new `PortfolioPerformanceRepository` instance.
 */
export function newPortfolioPerformanceRepository(): PortfolioPerformanceRepository {
  return new PortfolioPerformanceRepository(db);
}

/**
 * Creates a new `PositionPerformanceRepository` bound
 * to the shared test database.
 *
 * @returns A new `PositionPerformanceRepository` instance.
 */
export function newPositionPerformanceRepository(): PositionPerformanceRepository {
  return new PositionPerformanceRepository(db);
}
