import { db } from "@/clients/database.client"
import { CategoryRepository } from "@/infrastructure/category/repositories/category.repository"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { BulkDeleteCategoriesUseCase } from "@/services/category/use-cases/bulk-delete-categories.use-case"
import { CreateCategoryUseCase } from "@/services/category/use-cases/create-category.use-case"
import { DeleteCategoryUseCase } from "@/services/category/use-cases/delete-category.use-case"
import { ListCategoriesUseCase } from "@/services/category/use-cases/list-categories.use-case"
import { ListCategoryRowSummariesUseCase } from "@/services/category/use-cases/list-category-row-summaries.use-case"
import { UpdateCategoryUseCase } from "@/services/category/use-cases/update-category.use-case"

// The category use cases, plus the fund registry the row
// summaries read, all wired to their repositories.
interface CategoryUseCases {
  bulkDelete: BulkDeleteCategoriesUseCase
  create: CreateCategoryUseCase
  list: ListCategoriesUseCase
  listRowSummaries: ListCategoryRowSummariesUseCase
  remove: DeleteCategoryUseCase
  update: UpdateCategoryUseCase
}

/**
 * @summary
 * Wires the category use cases to the category repository.
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
 * category use case.
 *
 * @returns The wired category use cases.
 *
 * @example
 * const { create: CREATE_CATEGORY } = CategoryContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CategoryContainer(): CategoryUseCases {
  const REPOSITORY = new CategoryRepository(db)
  const FUND_REPOSITORY = new FundRepository(db)

  return {
    bulkDelete: new BulkDeleteCategoriesUseCase(REPOSITORY),
    create: new CreateCategoryUseCase(REPOSITORY),
    list: new ListCategoriesUseCase(REPOSITORY),
    listRowSummaries: new ListCategoryRowSummariesUseCase(
      FUND_REPOSITORY
    ),
    remove: new DeleteCategoryUseCase(REPOSITORY),
    update: new UpdateCategoryUseCase(REPOSITORY),
  }
}

export { CategoryContainer, type CategoryUseCases }
