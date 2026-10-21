"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { WithdrawalContainer } from "@/presentation/composition/withdrawal.container"
import { ActionAudited } from "@/presentation/parts/audit/shared-log-action.helper"
import {
  ActionFailure,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"

import { BULK_DELETE_WITHDRAWALS_SCHEMA } from "../validations/withdrawal-actions.validation"

/**
 * @summary
 * Deletes multiple withdrawals.
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
 * withdrawal datatable.
 *
 * @param input - The untrusted withdrawal ids payload.
 *
 * @returns Nothing on success, or a failure result.
 *
 * @example
 * const RESULT = await bulkDeleteWithdrawalsAction({
 *   withdrawalIds: ["withdrawal-1", "withdrawal-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
export async function bulkDeleteWithdrawalsAction(
  input: unknown
): Promise<ActionResult<undefined>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = BULK_DELETE_WITHDRAWALS_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { bulkDelete: BULK_DELETE_WITHDRAWALS } =
      WithdrawalContainer()

    await BULK_DELETE_WITHDRAWALS.execute(PARSED.data)

    return ActionAudited(undefined, {
      userId: USER.id,
      action: "DELETED",
      entity: "Withdrawal",
      entityId: PARSED.data.withdrawalIds[0] ?? "",
      changes: {
        ids: PARSED.data.withdrawalIds,
        count: PARSED.data.withdrawalIds.length,
      },
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível excluir os resgates."
    )
  }
}
