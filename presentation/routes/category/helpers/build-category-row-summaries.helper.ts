import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"
import type { CategoryRowSummaryDTO } from "@/services/category/use-cases/list-category-row-summaries.use-case"

import type { CategoryRowSummary } from "../types/category-list.types"

/**
 * @summary
 * Composes the derived data of the category rows.
 *
 * @remarks
 * Merges the grouped fund counts with the category rows,
 * keyed by category id. Categories without any linked
 * fund fall back to a zero count.
 *
 * @explanation
 * Use this helper in loaders that need the per-row
 * summary record consumed by the datatable and the KPI
 * hooks.
 *
 * @param categories - The category rows.
 * @param counts - The fund counts from the service.
 *
 * @returns The summaries keyed by category id.
 *
 * @example
 * const SUMMARIES = BuildCategoryRowSummaries(
 *   CATEGORIES, COUNTS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildCategoryRowSummaries(
  categories: CategoryResponseDTO[],
  counts: CategoryRowSummaryDTO[]
): Record<string, CategoryRowSummary> {
  const COUNTS_BY_CATEGORY = new Map(
    counts.map((entry) => [entry.categoryId, entry])
  )

  return Object.fromEntries(
    categories.map((category) => [
      category.id,
      {
        fundCount:
          COUNTS_BY_CATEGORY.get(category.id)?.fundCount ?? 0,
      },
    ])
  )
}
