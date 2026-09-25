"use client"

import { useCallback, useMemo, useState } from "react"

import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"

interface UseCategoryDatatableFiltersOutput {
  query: string
  onQueryChange: (query: string) => void
  filteredCategories: CategoryResponseDTO[]
}

/**
 * @summary
 * Coordinates the category datatable filters.
 *
 * @remarks
 * Owns the search query and narrows the rows by the
 * category name before the table receives them.
 *
 * @param categories - The rows rendered by the datatable.
 *
 * @returns The filter state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useCategoryDatatableFilters(
  categories: CategoryResponseDTO[]
): UseCategoryDatatableFiltersOutput {
  const [QUERY, setQuery] = useState("")

  const FILTERED_CATEGORIES = useMemo(() => {
    const NORMALIZED = QUERY.trim().toLowerCase()

    if (!NORMALIZED) return categories

    return categories.filter((category) =>
      category.name.toLowerCase().includes(NORMALIZED)
    )
  }, [categories, QUERY])

  return {
    query: QUERY,
    onQueryChange: setQuery,
    filteredCategories: FILTERED_CATEGORIES,
  }
}

export { useCategoryDatatableFilters }
