"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { CategoryRepository } from "@/infrastructure/category/repositories/category.repository"
import { DeleteCategoryUseCase } from "@/services/category/use-cases/delete-category.use-case"

export interface DeleteCategoryActionInput {
  categoryId: string
}

/**
 * @summary
 * Deletes a category.
 *
 * @remarks
 * Resolves the session user from the request headers
 * and runs the delete use case. Returns a
 * human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the single-row delete
 * flow of the category datatable.
 *
 * @param input - The category id to delete.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await deleteCategoryAction({
 *   categoryId: "category-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function deleteCategoryAction(
  input: DeleteCategoryActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new CategoryRepository(db)
    const USE_CASE = new DeleteCategoryUseCase(REPOSITORY)

    await USE_CASE.execute({
      categoryId: input.categoryId,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível excluir a categoria.",
    }
  }
}
