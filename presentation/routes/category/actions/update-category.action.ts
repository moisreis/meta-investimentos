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

import { UPDATE_CATEGORY_SCHEMA } from "../validations/category-actions.validation"

/**
 * @summary
 * Updates an existing category.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the update use case. The
 * acting user is derived from the session, never from the
 * payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the edit category form.
 *
 * @param input - The untrusted category update payload.
 *
 * @returns The updated category, or a failure result.
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
  input: unknown
): Promise<ActionResult<CategoryResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = UPDATE_CATEGORY_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { update: UPDATE_CATEGORY } = CategoryContainer()
    const CATEGORY = await UPDATE_CATEGORY.execute(PARSED.data)

    return ActionSuccess(CATEGORY)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível atualizar a categoria."
    )
  }
}
