"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { CategoryRepository } from "@/infrastructure/category/repositories/category.repository"
import { CreateCategoryUseCase } from "@/services/category/use-cases/create-category.use-case"

export interface CreateCategoryActionInput {
  name: string
}

/**
 * @summary
 * Creates a new category.
 *
 * @remarks
 * Resolves the session user from the request headers,
 * builds the create payload and runs the service use
 * case. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the add category form.
 *
 * @param input - The category creation payload.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await createCategoryAction({
 *   name: "Renda Fixa",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function createCategoryAction(
  input: CreateCategoryActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new CategoryRepository(db)
    const USE_CASE = new CreateCategoryUseCase(REPOSITORY)

    await USE_CASE.execute({
      name: input.name,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível criar a categoria.",
    }
  }
}
