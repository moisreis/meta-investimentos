import { db } from "@/__tests__/__setup__/_database.setup";
import { StatementRepository } from "@/infrastructure/repositories";

/**
 * Re-exports the statement seed fixtures and functions
 * used by statement repository tests.
 */
export {
  FRESH_STATEMENT,
  OTHER_STATEMENT,
  OTHER_STATEMENT_ID,
  STATEMENT,
  STATEMENT_ID,
  seedStatementParents,
  seedStatements,
  THIRD_STATEMENT,
  THIRD_STATEMENT_ID,
  UPDATED_STATEMENT,
} from "@/__tests__/__seeds__/_statement.seed";

/**
 * Creates a new `StatementRepository` bound to the
 * shared test database.
 *
 * @returns A new `StatementRepository` instance.
 */
export function newStatementRepository(): StatementRepository {
  return new StatementRepository(db);
}
