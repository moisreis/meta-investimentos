"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { ApplicationContainer } from "@/presentation/composition/application.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"

import { REVERSE_APPLICATION_SCHEMA } from "../validations/application-actions.validation"

/**
 * @summary
 * Reverses an application.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the reverse use case.
 * The acting user is derived from the session, never from
 * the payload. Returns a human-readable error when
 * anything fails.
 *
 * @explanation
 * Use as the submit target of the single-row reverse
 * flow of the application datatable. A reversed
 * application is marked as estornado and stops counting
 * toward the position, instead of being erased.
 *
 * @param input - The untrusted application id payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await reverseApplicationAction({
 *   applicationId: "application-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export async function reverseApplicationAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = REVERSE_APPLICATION_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { reverse: REVERSE_APPLICATION } =
      ApplicationContainer()

    await REVERSE_APPLICATION.execute({
      applicationId: PARSED.data.applicationId,
      reversedByUserId: USER.id,
    })

    return ActionSuccess(undefined)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível reverter a aplicação."
    )
  }
}
