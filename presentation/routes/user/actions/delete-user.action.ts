"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { RequireRole } from "@/lib/authz/require-role"
import { UserContainer } from "@/presentation/composition/user.container"
import { ActionAudited } from "@/presentation/parts/audit/shared-log-action.helper"
import {
  ActionFailure,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"

import { DELETE_USER_SCHEMA } from "../validations/user-actions.validation"

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

  const { get: GET_USER } = UserContainer()
  const ACTOR = await GET_USER.execute({ userId: USER.id })
  const ROLE_CHECK = RequireRole(ACTOR.role, ["MANAGER"])
  if (!ROLE_CHECK.success) {
    return ROLE_CHECK
  }

  const PARSED = DELETE_USER_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const {
      get: GET_TARGET,
      remove: REMOVE_USER,
      list: LIST_USERS,
    } = UserContainer()
    const TARGET = await GET_TARGET.execute({
      userId: PARSED.data.userId,
    })
    if (TARGET.id === ACTOR.id) {
      return ActionFailure(
        "Não é possível excluir a própria conta."
      )
    }
    if (TARGET.role === "MANAGER") {
      const USERS = await LIST_USERS.execute({})
      const MANAGER_COUNT = USERS.filter(
        (user) => user.role === "MANAGER"
      ).length
      if (MANAGER_COUNT <= 1) {
        return ActionFailure(
          "Não é possível excluir o último administrador."
        )
      }
    }

    await REMOVE_USER.execute(PARSED.data)

    return ActionAudited(undefined, {
      userId: USER.id,
      action: "DELETED",
      entity: "User",
      entityId: PARSED.data.userId,
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir o usuário."
    )
  }
}
