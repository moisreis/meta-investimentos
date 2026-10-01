import { RequireSessionUser } from "@/lib/auth/require-session"
import { CategoryContainer } from "@/presentation/composition/category.container"
import { ToCategoryRows } from "@/presentation/mappers/category-row.mapper"
import type { CategoryRow } from "@/presentation/types/category-row.types"

/**
 * @summary
 * Resolves the session user and the registered categories.
 *
 * @remarks
 * Derives the acting user from the session and lists all
 * categories of the platform through the use case. Returns
 * null when there is no active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the category listing stay in a single place.
 *
 * @returns The category rows, or `null`.
 *
 * @example
 * const CATEGORIES = await LoadCategories();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadCategories(): Promise<
  CategoryRow[] | null
> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const { list: LIST_CATEGORIES } = CategoryContainer()

  return ToCategoryRows(await LIST_CATEGORIES.execute({}))
}
