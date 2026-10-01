import { RequireSessionUser } from "@/lib/auth/require-session"
import { CategoryContainer } from "@/presentation/composition/category.container"
import { NormContainer } from "@/presentation/composition/norm.container"
import { ToCategoryRows } from "@/presentation/mappers/category-row.mapper"
import { ToNormRows } from "@/presentation/mappers/norm-row.mapper"
import type { CategoryRow } from "@/presentation/types/category-row.types"
import type { NormRow } from "@/presentation/types/norm-row.types"

// Data resolved by the norm list loader.
export interface LoadedNormList {
  norms: NormRow[]
  categories: CategoryRow[]
}

/**
 * @summary
 * Resolves the session user, the registered categories
 * and the norms they hold.
 *
 * @remarks
 * Derives the acting user from the session and lists all
 * categories of the platform. Because the list use case
 * scopes the query to a single category, the loader asks
 * the use case once per category and flattens the groups
 * into one global index. Returns null when there is no
 * active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the norm listing stay in a single
 * composition point.
 *
 * @returns The norm rows and the category options,
 *          or `null`.
 *
 * @example
 * const LOADED = await LoadNorms();
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export async function LoadNorms(): Promise<LoadedNormList | null> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const { list: LIST_CATEGORIES } = CategoryContainer()
  const CATEGORIES = ToCategoryRows(
    await LIST_CATEGORIES.execute({})
  )

  const { list: LIST_NORMS } = NormContainer()
  const NORM_GROUPS = await Promise.all(
    CATEGORIES.map((category) =>
      LIST_NORMS.execute({ categoryId: category.id })
    )
  )

  return {
    norms: ToNormRows(NORM_GROUPS.flat()),
    categories: CATEGORIES,
  }
}
