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

import { UPDATE_USER_SCHEMA } from "../validations/user-actions.validation"

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

  const { get: GET_USER } = UserContainer()
  const ACTOR = await GET_USER.execute({ userId: USER.id })
  const ROLE_CHECK = RequireRole(ACTOR.role, ["MANAGER"])
  if (!ROLE_CHECK.success) {
    return ROLE_CHECK
  }

  const PARSED = UPDATE_USER_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const {
      update: UPDATE_USER,
      get: GET_TARGET,
      list: LIST_USERS,
    } = UserContainer()
    const TARGET_BEFORE = await GET_TARGET.execute({
      userId: PARSED.data.userId,
    })
    if (TARGET_BEFORE.id === ACTOR.id) {
      return ActionFailure(
        "Não é possível alterar a própria conta."
      )
    }
    if (TARGET_BEFORE.role === "MANAGER") {
      const ALL_USERS = await LIST_USERS.execute({})
      const MANAGER_COUNT = ALL_USERS.filter(
        (user) => user.role === "MANAGER"
      ).length
      if (MANAGER_COUNT <= 1) {
        return ActionFailure(
          "Não é possível rebaixar o último administrador."
        )
      }
    }
    const UPDATE_INPUT = {
      ...PARSED.data,
      role: TARGET_BEFORE.role,
    }
    await UPDATE_USER.execute(UPDATE_INPUT)

    return ActionAudited(undefined, {
      userId: USER.id,
      action: "UPDATED",
      entity: "User",
      entityId: PARSED.data.userId,
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível atualizar o usuário."
    )
  }
}
