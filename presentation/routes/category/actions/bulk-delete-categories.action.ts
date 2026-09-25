"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { CategoryRepository } from "@/infrastructure/category/repositories/category.repository"
import { BulkDeleteCategoriesUseCase } from "@/services/category/use-cases/bulk-delete-categories.use-case"

export interface BulkDeleteCategoriesActionInput {
  categoryIds: string[]
}

/**
 * @summary
 * Deletes multiple categories.
 *
 * @remarks
 * Resolves the session user from the request headers
 * and runs the bulk delete use case. Returns a
 * human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the bulk delete flow of
 * the category datatable.
 *
 * @param input - The category ids to delete.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await bulkDeleteCategoriesAction({
 *   categoryIds: ["category-1", "category-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function bulkDeleteCategoriesAction(
  input: BulkDeleteCategoriesActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new CategoryRepository(db)
    const USE_CASE = new BulkDeleteCategoriesUseCase(REPOSITORY)

    await USE_CASE.execute({
      categoryIds: input.categoryIds,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível excluir as categorias.",
    }
  }
}
