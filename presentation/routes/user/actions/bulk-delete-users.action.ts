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

import { BULK_DELETE_USERS_SCHEMA } from "../validations/user-actions.validation"

/**
 * @summary
 * Deletes multiple users.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, including a non-empty cap on the selection,
 * and only then runs the bulk delete use case. The acting
 * user is derived from the session, never from the payload.
 * Returns a human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the bulk delete flow of the
 * user datatable.
 *
 * @param input - The untrusted user ids payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await bulkDeleteUsersAction({
 *   userIds: ["user-1", "user-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function bulkDeleteUsersAction(
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

  const PARSED = BULK_DELETE_USERS_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const {
      bulkDelete: BULK_DELETE_USERS,
      get: GET_TARGET,
      list: LIST_USERS,
    } = UserContainer()
    const USERS_TO_DELETE = PARSED.data.userIds
    if (USERS_TO_DELETE.includes(ACTOR.id)) {
      return ActionFailure(
        "Não é possível excluir a própria conta."
      )
    }
    const MANAGERS_TO_DELETE = []
    for (const USER_ID of USERS_TO_DELETE) {
      try {
        const TARGET = await GET_TARGET.execute({
          userId: USER_ID,
        })
        if (TARGET.role === "MANAGER") {
          MANAGERS_TO_DELETE.push(TARGET)
        }
      } catch {}
    }
    if (MANAGERS_TO_DELETE.length > 0) {
      const ALL_USERS = await LIST_USERS.execute({})
      const MANAGER_COUNT = ALL_USERS.filter(
        (user) => user.role === "MANAGER"
      ).length
      if (MANAGER_COUNT - MANAGERS_TO_DELETE.length < 1) {
        return ActionFailure(
          "Não é possível excluir o último administrador."
        )
      }
    }

    await BULK_DELETE_USERS.execute(PARSED.data)

    return ActionAudited(undefined, {
      userId: USER.id,
      action: "DELETED",
      entity: "User",
      entityId: PARSED.data.userIds[0] ?? "",
      changes: {
        ids: PARSED.data.userIds,
        count: PARSED.data.userIds.length,
      },
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir os usuários."
    )
  }
}
