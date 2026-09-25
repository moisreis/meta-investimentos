"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { CategoryRepository } from "@/infrastructure/category/repositories/category.repository"
import { UpdateCategoryUseCase } from "@/services/category/use-cases/update-category.use-case"

export interface UpdateCategoryActionInput {
  categoryId: string
  name: string
}

/**
 * @summary
 * Updates an existing category.
 *
 * @remarks
 * Resolves the session user from the request headers
 * and persists the updated entity through the service
 * use case. Returns a human-readable error when
 * anything fails.
 *
 * @explanation
 * Use as the submit target of the edit category form.
 *
 * @param input - The category update payload.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await updateCategoryAction({
 *   categoryId: "category-1",
 *   name: "Renda Variável",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function updateCategoryAction(
  input: UpdateCategoryActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new CategoryRepository(db)
    const USE_CASE = new UpdateCategoryUseCase(REPOSITORY)

    await USE_CASE.execute({
      categoryId: input.categoryId,
      name: input.name,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível atualizar a categoria.",
    }
  }
}
