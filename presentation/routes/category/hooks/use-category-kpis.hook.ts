"use client"

import { useCallback } from "react"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"

import { CATEGORY_KPI } from "../settings/labels.settings"
import type { CategoryRowSummary } from "../types/category-list.types"

interface UseCategoryKpisInput {
  categories: CategoryResponseDTO[]
  summaries: Record<string, CategoryRowSummary> | null
}

/**
 * @summary
 * Builds the data-driven KPI cards of the category list.
 *
 * @remarks
 * Tallies the registered categories, the funds linked to
 * them and the number of categories with and without
 * linked funds. All values are formatted through the
 * count presenter.
 *
 * @param categories - The rows of the category list.
 * @param summaries - The derived per-row fund counts.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BuildCategoryKpis(
  categories: readonly CategoryResponseDTO[],
  summaries: Record<string, CategoryRowSummary> | null
): EntityKpi[] {
  const TOTAL_FUNDS = Object.values(summaries ?? {}).reduce(
    (sum, summary) => sum + summary.fundCount,
    0
  )

  const CATEGORIES_WITH_FUNDS = Object.values(
    summaries ?? {}
  ).filter((summary) => summary.fundCount > 0).length

  return [
    {
      key: "categories",
      title: CATEGORY_KPI.CATEGORY_COUNT_TITLE,
      value: FormatCount(categories.length),
      comparison: CATEGORY_KPI.CATEGORY_COUNT_COMPARISON,
    },
    {
      key: "funds",
      title: CATEGORY_KPI.FUND_COUNT_TITLE,
      value: FormatCount(TOTAL_FUNDS),
      comparison: CATEGORY_KPI.FUND_COUNT_COMPARISON,
    },
    {
      key: "categoriesWithFunds",
      title: CATEGORY_KPI.CATEGORIES_WITH_FUNDS_TITLE,
      value: FormatCount(CATEGORIES_WITH_FUNDS),
      comparison: CATEGORY_KPI.CATEGORIES_WITH_FUNDS_COMPARISON,
    },
    {
      key: "categoriesWithoutFunds",
      title: CATEGORY_KPI.CATEGORIES_WITHOUT_FUNDS_TITLE,
      value: FormatCount(
        categories.length - CATEGORIES_WITH_FUNDS
      ),
      comparison:
        CATEGORY_KPI.CATEGORIES_WITHOUT_FUNDS_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the category list.
 *
 * @remarks
 * Delegates the computation to `BuildCategoryKpis` and
 * the memoization to the shared entity KPI hook.
 *
 * @param input - The rows and the derived per-row counts.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useCategoryKpis({
  categories,
  summaries,
}: UseCategoryKpisInput): EntityKpi[] {
  const compute = useCallback(
    (items: readonly CategoryResponseDTO[]) =>
      BuildCategoryKpis(items, summaries),
    [summaries]
  )

  return useEntityKpis({
    items: categories,
    compute,
  })
}

export { useCategoryKpis }
