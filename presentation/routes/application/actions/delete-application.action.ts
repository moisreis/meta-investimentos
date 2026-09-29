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

import { DELETE_APPLICATION_SCHEMA } from "../validations/application-actions.validation"

/**
 * @summary
 * Deletes an application.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the delete use case. The
 * acting user is derived from the session, never from the
 * payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the single-row delete
 * flow of the application datatable.
 *
 * @param input - The untrusted application id payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await deleteApplicationAction({
 *   applicationId: "application-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function deleteApplicationAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = DELETE_APPLICATION_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { delete: DELETE_APPLICATION } = ApplicationContainer()

    await DELETE_APPLICATION.execute(PARSED.data)

    return ActionSuccess(undefined)
  } catch (cause) {
    return ToActionFailure(cause, "Não foi possível excluir a aplicação.")
  }
}