"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { ApplicationContainer } from "@/presentation/composition/application.container"
import { ActionAudited } from "@/presentation/parts/audit/shared-log-action.helper"
import {
  ActionFailure,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"

import { BULK_DELETE_APPLICATIONS_SCHEMA } from "../validations/application-actions.validation"

/**
 * @summary
 * Deletes multiple applications.
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
 * application datatable.
 *
 * @param input - The untrusted application ids payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await bulkDeleteApplicationsAction({
 *   applicationIds: ["application-1", "application-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
export async function bulkDeleteApplicationsAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = BULK_DELETE_APPLICATIONS_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { bulkDelete: BULK_DELETE_APPLICATIONS } =
      ApplicationContainer()

    await BULK_DELETE_APPLICATIONS.execute(PARSED.data)

    return ActionAudited(undefined, {
      userId: USER.id,
      action: "DELETED",
      entity: "Application",
      entityId: PARSED.data.applicationIds[0] ?? "",
      changes: {
        ids: PARSED.data.applicationIds,
        count: PARSED.data.applicationIds.length,
      },
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir as aplicações."
    )
  }
}
