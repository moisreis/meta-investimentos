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

import { DELETE_USER_SCHEMA } from "../validations/users-actions.validation"

/**
 * @summary
 * Deletes a user.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the delete use case. The
 * acting user is derived from the session, never from the
 * payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the single-row delete flow
 * of the user datatable.
 *
 * @param input - The untrusted user id payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await deleteUserAction({ userId: "user-1" });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function deleteUserAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = DELETE_USER_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { remove: REMOVE_USER } = UserContainer()

    await REMOVE_USER.execute(PARSED.data)

    return ActionSuccess(undefined)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir o usuário."
    )
  }
}
