import { LogError } from "@/lib/log/logger"
import { CategoryContainer } from "@/presentation/composition/category.container"
import { NormContainer } from "@/presentation/composition/norm.container"
import { NormsPortfoliosContainer } from "@/presentation/composition/norms-portfolios.container"
import { ToCategoryRows } from "@/presentation/mappers/category-row.mapper"
import { ToNormPortfolioAllocationRows } from "@/presentation/mappers/norm-portfolio-allocation.mapper"
import { ToNormRows } from "@/presentation/mappers/norm-row.mapper"
import type {
  NormOption,
  NormOptionRegistry,
} from "@/presentation/types/norms-portfolio.types"

/**
 * @summary
 * Lists every norm and the norms already attached to each
 * portfolio.
 *
 * @remarks
 * The portfolio forms have two needs that share one query
 * each: the picker has to offer every norm, and the edit
 * form has to show the bounds already stored for its own
 * portfolio. Resolving both here means the list page asks
 * the database once, and the seeded rows are the rows the
 * save use case will reconcile, so the dialog opens showing
 * what is in effect rather than an empty list that would
 * wipe it on submit.
 *
 * A failure here returns `null` instead of an empty registry,
 * because the two are not the same thing: an empty registry
 * claims the portfolio has no norms, and saving on that claim
 * would detach the relations the user configured. `null`
 * tells the form it does not know, so it offers no norm and
 * leaves the stored relations out of the payload entirely.
 *
 * @explanation
 * Use this helper from the portfolio list page loader, and
 * from any screen whose forms edit a portfolio.
 *
 * @param portfolioIds - The portfolios whose relations are
 *                      resolved.
 *
 * @returns The norm registry, or `null` when it could not
 *          be resolved.
 *
 * @example
 * const REGISTRY = await LoadPortfolioNormRegistry(IDS);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-04
 */
async function LoadPortfolioNormRegistry(
  portfolioIds: string[]
): Promise<NormOptionRegistry | null> {
  try {
    const { list: LIST_CATEGORIES } = CategoryContainer()
    const CATEGORIES = ToCategoryRows(
      await LIST_CATEGORIES.execute({})
    )

    const { list: LIST_NORMS } = NormContainer()
    const GROUPS = await Promise.all(
      CATEGORIES.map((category) =>
        LIST_NORMS.execute({ categoryId: category.id })
      )
    )

    const NORM_ROWS = ToNormRows(GROUPS.flat())

    const OPTIONS: NormOption[] = NORM_ROWS.map((norm) => ({
      id: norm.id,
      name: norm.name,
      articleNumber: norm.articleNumber,
      minAllocation: norm.minAllocation,
      targetAllocation: norm.targetAllocation,
      maxAllocation: norm.maxAllocation,
    }))

    const { listByPortfolio: LIST_BY_PORTFOLIO } =
      NormsPortfoliosContainer()
    const RELATIONS = await Promise.all(
      portfolioIds.map((portfolioId) =>
        LIST_BY_PORTFOLIO.execute({ portfolioId })
      )
    )

    return {
      options: OPTIONS,
      allocations: Object.fromEntries(
        portfolioIds.map((portfolioId, index) => [
          portfolioId,
          ToNormPortfolioAllocationRows(
            RELATIONS[index] ?? [],
            OPTIONS
          ),
        ])
      ),
    }
  } catch (cause) {
    LogError(
      "LoadPortfolioNormRegistry",
      "failed to resolve the norm registry.",
      cause
    )

    return null
  }
}

export { LoadPortfolioNormRegistry }
