import { db } from "@/clients/database.client"
import { BankRepository } from "@/infrastructure/bank/repositories/bank.repository"
import { BenchmarkRepository } from "@/infrastructure/benchmark/repositories/benchmark.repository"
import { CategoryRepository } from "@/infrastructure/category/repositories/category.repository"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { PositionRepository } from "@/infrastructure/position/repositories/position.repository"
import { ListBanksUseCase } from "@/services/bank/use-cases/list-banks.use-case"
import { ListBenchmarksUseCase } from "@/services/benchmark/use-cases/list-benchmarks.use-case"
import { ListCategoriesUseCase } from "@/services/category/use-cases/list-categories.use-case"
import { BulkDeleteFundsUseCase } from "@/services/fund/use-cases/bulk-delete-funds.use-case"
import { CreateFundUseCase } from "@/services/fund/use-cases/create-fund.use-case"
import { DeleteFundUseCase } from "@/services/fund/use-cases/delete-fund.use-case"
import { ListFundRowSummariesUseCase } from "@/services/fund/use-cases/list-fund-row-summaries.use-case"
import { ListFundsUseCase } from "@/services/fund/use-cases/list-funds.use-case"
import { UpdateFundUseCase } from "@/services/fund/use-cases/update-fund.use-case"

// The fund use cases, already wired to the repository.
interface FundUseCases {
  bulkDelete: BulkDeleteFundsUseCase
  create: CreateFundUseCase
  list: ListFundsUseCase
  listBanks: ListBanksUseCase
  listBenchmarks: ListBenchmarksUseCase
  listCategories: ListCategoriesUseCase
  listRowSummaries: ListFundRowSummariesUseCase
  remove: DeleteFundUseCase
  update: UpdateFundUseCase
}

/**
 * @summary
 * Wires the fund use cases to the fund repository.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot.
 *
 * The bank, benchmark, and category listers are wired
 * here too, because the fund route needs the registries
 * linked by the fund rows to resolve its name columns and
 * its form selects.
 *
 * @explanation
 * Use this container from any server module that needs a
 * fund use case.
 *
 * @returns The wired fund use cases.
 *
 * @example
 * const { create: CREATE_FUND } = FundContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function FundContainer(): FundUseCases {
  const REPOSITORY = new FundRepository(db)
  const BANK_REPOSITORY = new BankRepository(db)
  const BENCHMARK_REPOSITORY = new BenchmarkRepository(db)
  const CATEGORY_REPOSITORY = new CategoryRepository(db)
  const POSITION_REPOSITORY = new PositionRepository(db)

  return {
    bulkDelete: new BulkDeleteFundsUseCase(REPOSITORY),
    create: new CreateFundUseCase(REPOSITORY),
    list: new ListFundsUseCase(REPOSITORY),
    listBanks: new ListBanksUseCase(BANK_REPOSITORY),
    listBenchmarks: new ListBenchmarksUseCase(
      BENCHMARK_REPOSITORY
    ),
    listCategories: new ListCategoriesUseCase(
      CATEGORY_REPOSITORY
    ),
    listRowSummaries: new ListFundRowSummariesUseCase(
      POSITION_REPOSITORY
    ),
    remove: new DeleteFundUseCase(REPOSITORY),
    update: new UpdateFundUseCase(REPOSITORY),
  }
}

export { FundContainer, type FundUseCases }
