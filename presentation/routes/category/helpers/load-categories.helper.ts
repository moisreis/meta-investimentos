import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { CategoryRepository } from "@/infrastructure/category/repositories/category.repository"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"
import { ListCategoriesUseCase } from "@/services/category/use-cases/list-categories.use-case"

/**
 * @summary
 * Resolves the session user and the registered categories.
 *
 * @remarks
 * Fetches the session from the request headers and lists
 * all categories of the platform. Returns null when there
 * is no active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the category listing stay in a single
 * composition point.
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
  CategoryResponseDTO[] | null
> {
  const SESSION = await auth.api.getSession({
    headers: await headers(),
  })

  if (!SESSION?.user) return null

  const CATEGORY_REPOSITORY = new CategoryRepository(db)
  const LIST_USE_CASE = new ListCategoriesUseCase(
    CATEGORY_REPOSITORY
  )
  const CATEGORIES = await LIST_USE_CASE.execute({})

  return CATEGORIES
}
