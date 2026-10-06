"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { UserContainer } from "@/presentation/composition/user.container"
import { ActionAudited } from "@/presentation/parts/audit/shared-log-action.helper"
import {
  ActionFailure,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"

import { CREATE_USER_SCHEMA } from "../validations/user-actions.validation"

/**
 * @summary
 * Creates a new user.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the create use case. The
 * acting user is derived from the session, never from the
 * payload. Returns a human-readable error when anything
 * fails. The created user is deliberately not echoed back:
 * the response payload of the use case carries the **CPF**,
 * which must never travel to the client.
 *
 * @explanation
 * Use as the submit target of the add user form.
 *
 * @param input - The untrusted user creation payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await createUserAction({
 *   name: "Maria Silva",
 *   email: "maria@example.com",
 *   firstName: "Maria",
 *   lastName: "Silva",
 *   cpf: "123.456.789-09",
 *   role: "MANAGER",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function createUserAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = CREATE_USER_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { create: CREATE_USER } = UserContainer()

    const CREATED_USER = await CREATE_USER.execute(PARSED.data)

    return ActionAudited(undefined, {
      userId: USER.id,
      action: "CREATED",
      entity: "User",
      entityId: CREATED_USER.id,
      entityName: CREATED_USER.name,
      changes: {
        name: PARSED.data.name,
        email: PARSED.data.email,
        role: PARSED.data.role,
      },
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível criar o usuário."
    )
  }
}
