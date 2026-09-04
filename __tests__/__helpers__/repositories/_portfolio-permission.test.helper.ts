import { db } from "@/__tests__/__setup__/_database.setup";
import { PortfolioPermissionRepository } from "@/infrastructure/repositories";

/**
 * Re-exports all portfolio permission seed fixtures
 * and functions used by portfolio-permission repository
 * tests.
 */
export * from "@/__tests__/__seeds__/_portfolio-permission.seed";

/**
 * Creates a new `PortfolioPermissionRepository` bound to
 * the shared test database.
 *
 * @returns A new `PortfolioPermissionRepository` instance.
 */
export function newPortfolioPermissionRepository(): PortfolioPermissionRepository {
  return new PortfolioPermissionRepository(db);
}
