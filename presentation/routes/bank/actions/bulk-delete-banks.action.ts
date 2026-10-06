"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { BankContainer } from "@/presentation/composition/bank.container"
import { ActionAudited } from "@/presentation/parts/audit/shared-log-action.helper"
import {
  ActionFailure,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"

import { BULK_DELETE_BANKS_SCHEMA } from "../validations/bank-actions.validation"

/**
 * @summary
 * Deletes multiple banks.
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
 * bank datatable.
 *
 * @param input - The untrusted bank ids payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await bulkDeleteBanksAction({
 *   bankIds: ["bank-1", "bank-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function bulkDeleteBanksAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = BULK_DELETE_BANKS_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { bulkDelete: BULK_DELETE_BANKS } = BankContainer()

    await BULK_DELETE_BANKS.execute(PARSED.data)

    return ActionAudited(undefined, {
      userId: USER.id,
      action: "DELETED",
      entity: "Bank",
      entityId: PARSED.data.bankIds[0] ?? "",
      changes: {
        ids: PARSED.data.bankIds,
        count: PARSED.data.bankIds.length,
      },
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir os bancos."
    )
  }
}
