import { db } from "@/clients/database.client"
import { StatementRepository } from "@/infrastructure/statement/repositories/statement.repository"
import { BulkDeleteStatementsUseCase } from "@/services/statement/use-cases/bulk-delete-statements.use-case"
import { DeleteStatementUseCase } from "@/services/statement/use-cases/delete-statement.use-case"
import { GenerateStatementUseCase } from "@/services/statement/use-cases/generate-statement.use-case"
import { ListStatementsByPortfoliosUseCase } from "@/services/statement/use-cases/list-statements-by-portfolios.use-case"

// The statement use cases, already wired to the repository.
interface StatementUseCases {
  bulkDelete: BulkDeleteStatementsUseCase
  generate: GenerateStatementUseCase
  listByPortfolios: ListStatementsByPortfoliosUseCase
  remove: DeleteStatementUseCase
}

/**
 * @summary
 * Wires the statement use cases to the statement repository.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot.
 *
 * @explanation
 * Use this container from any server module that needs a
 * statement use case. The portfolio use case used to check
 * the ownership of a target portfolio is wired by
 * `PortfolioContainer`, so the statement route never builds
 * a portfolio repository on its own.
 *
 * @returns The wired statement use cases.
 *
 * @example
 * const { generate: GENERATE_STATEMENT } = StatementContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function StatementContainer(): StatementUseCases {
  const REPOSITORY = new StatementRepository(db)

  return {
    bulkDelete: new BulkDeleteStatementsUseCase(REPOSITORY),
    generate: new GenerateStatementUseCase(REPOSITORY),
    listByPortfolios: new ListStatementsByPortfoliosUseCase(
      REPOSITORY
    ),
    remove: new DeleteStatementUseCase(REPOSITORY),
  }
}

export { StatementContainer, type StatementUseCases }
