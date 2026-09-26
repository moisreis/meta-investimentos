"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { CategoryContainer } from "@/presentation/composition/category.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"

import { CREATE_CATEGORY_SCHEMA } from "../validations/category-actions.validation"

/**
 * @summary
 * Creates a new category.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the create use case.
 * The acting user is derived from the session, never from
 * the payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the add category form.
 *
 * @param input - The untrusted category creation payload.
 *
 * @returns The created category, or a failure result.
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
  input: unknown
): Promise<ActionResult<CategoryResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = CREATE_CATEGORY_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { create: CREATE_CATEGORY } = CategoryContainer()
    const CATEGORY = await CREATE_CATEGORY.execute(PARSED.data)

    return ActionSuccess(CATEGORY)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível criar a categoria."
    )
  }
}
