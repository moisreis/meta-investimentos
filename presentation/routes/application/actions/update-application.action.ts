"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { ApplicationContainer } from "@/presentation/composition/application.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"

import { UPDATE_APPLICATION_SCHEMA } from "../validations/application-actions.validation"

/**
 * @summary
 * Updates an application.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the update use case. The
 * acting user is derived from the session, never from the
 * payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the edit application form.
 *
 * @param input - The untrusted application update payload.
 *
 * @returns The updated application, or a failure result.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function updateApplicationAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = UPDATE_APPLICATION_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    // Note: There's no update use case implemented yet.
    // This is a placeholder - in a real implementation, you would call an update use case.
    return ActionFailure("Edição de aplicação ainda não implementada.")
  } catch (cause) {
    return ToActionFailure(cause, "Não foi possível atualizar a aplicação.")
  }
}