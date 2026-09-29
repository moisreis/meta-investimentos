import { LoadCategories } from "../helpers/load-categories.helper"
import { BuildCategoryRowSummaries } from "../helpers/build-category-row-summaries.helper"
import type { CategoryListProps } from "../pages/list"
import type { CategoryRow } from "@/presentation/types/category-row.types"
import type { CategoryRowSummary } from "../types/category-list.types"
import { CategoryContainer } from "@/presentation/composition/category.container"

/**
 * @summary
 * Resolves the props for the category list page.
 *
 * @remarks
 * Loads the session categories and their row summaries.
 *
 * @returns The category list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadCategoryPageProps();
 *
 * @author MoisAcs Reis
 *
 * @date 2026-09-27
 */
export async function LoadCategoryPageProps(): Promise<CategoryListProps> {
  let data: CategoryRow[] | null = null
  let summaries: Record<string, CategoryRowSummary> | null = null

  const LOADED = await LoadCategories()

  if (LOADED) {
    const CATEGORIES = LOADED
    const CATEGORY_IDS = CATEGORIES.map((category) => category.id)
    const { listRowSummaries: LIST_ROW_SUMMARIES } = CategoryContainer()
    const ROW_SUMMARIES = await LIST_ROW_SUMMARIES.execute({ categoryIds: CATEGORY_IDS })

    return { data: CATEGORIES, summaries: BuildCategoryRowSummaries(CATEGORIES, ROW_SUMMARIES) }
  }

  return { data: null, summaries: null }
}