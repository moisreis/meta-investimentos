import { db } from "@/__tests__/__setup__/_database.setup";
import { StatementRepository } from "@/infrastructure/repositories";

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

export function newStatementRepository(): StatementRepository {
  return new StatementRepository(db);
}
