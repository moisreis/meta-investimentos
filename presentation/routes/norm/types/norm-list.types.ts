import type { CategoryRow } from "@/presentation/types/category-row.types"

/**
 * @summary
 * Options consumed by the norm form selects.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export interface NormSelectOptions {
  categories: CategoryRow[]
}

/**
 * @summary
 * Name lookups used by the norm datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export interface NormNameLookups {
  categories: Record<string, string>
}
