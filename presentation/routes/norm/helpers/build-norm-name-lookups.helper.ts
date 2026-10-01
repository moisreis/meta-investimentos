import type { CategoryRow } from "@/presentation/types/category-row.types"

import type { NormNameLookups } from "../types/norm-list.types"

// Empty lookups used before the loader resolves.
export const EMPTY_NORM_NAME_LOOKUPS: NormNameLookups = {
  categories: {},
}

/**
 * @summary
 * Builds the name lookups of the norm datatable.
 *
 * @remarks
 * Maps each category id to its display name so the
 * datatable can resolve the category column without
 * joining tables.
 *
 * @explanation
 * Use this helper in loaders that need the name records
 * consumed by the norm datatable columns.
 *
 * @param categories - The registered categories.
 *
 * @returns The name lookups.
 *
 * @example
 * const NAMES = BuildNormNameLookups(CATEGORIES);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export function BuildNormNameLookups(
  categories: CategoryRow[]
): NormNameLookups {
  return {
    categories: Object.fromEntries(
      categories.map((category) => [category.id, category.name])
    ),
  }
}
