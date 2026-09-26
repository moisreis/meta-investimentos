"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { UserContainer } from "@/presentation/composition/user.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"

import { UPDATE_USER_SCHEMA } from "../validations/users-actions.validation"

/**
 * @summary
 * Updates an existing user.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the update use case. The
 * acting user is derived from the session, never from the
 * payload. Returns a human-readable error when anything
 * fails. The updated user is deliberately not echoed back:
 * the response payload of the use case carries the **CPF**,
 * which must never travel to the client.
 *
 * @explanation
 * Use as the submit target of the edit user form.
 *
 * @param input - The untrusted user update payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await updateUserAction({
 *   userId: "user-1",
 *   name: "Maria Souza",
 *   firstName: "Maria",
 *   lastName: "Souza",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function updateUserAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = UPDATE_USER_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { update: UPDATE_USER } = UserContainer()

    await UPDATE_USER.execute(PARSED.data)

    return ActionSuccess(undefined)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível atualizar o usuário."
    )
  }
}
