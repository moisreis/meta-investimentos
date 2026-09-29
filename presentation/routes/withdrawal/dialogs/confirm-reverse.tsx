"use client"

import { EntityConfirmReverseDialog } from "@/presentation/parts/dialogs/entity-confirm-reverse"
import { EntityReverseToast } from "@/presentation/parts/toasts/entity-reverse-toast"
import { FormatPositionLookup } from "@/presentation/presenters/lookup.presenter"
import { useWithdrawalRowActions } from "@/presentation/routes/withdrawal/hooks/use-withdrawal-row-actions.hook"
import {
  FormatReverseWithdrawalDescription,
  WITHDRAWAL_DATATABLE,
} from "@/presentation/routes/withdrawal/settings/labels.settings"

import type { WithdrawalLookups } from "../types/withdrawal-list.types"

/**
 * Props for the withdrawal confirm-reverse dialog.
 */
export interface WithdrawalConfirmReverseDialogProps {
  dialog: ReturnType<typeof useWithdrawalRowActions>
  lookups: WithdrawalLookups
}

/**
 * @summary
 * Renders the withdrawal confirm-reverse dialog flow.
 *
 * @remarks
 * Composes the shared confirm-reverse dialog with the
 * withdrawal copy and the reverse result toast. The title
 * and description come from the datatable settings; the
 * description resolves the target fund and portfolio names
 * through the lookup presenter.
 *
 * @param props - Props of the confirm-reverse dialog.
 * @param props.dialog - The row actions flow state.
 * @param props.lookups - The withdrawal row lookups.
 *
 * @returns The withdrawal confirm-reverse dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function WithdrawalConfirmReverseDialog({
  dialog,
  lookups,
}: WithdrawalConfirmReverseDialogProps) {
  const TARGET = dialog.reverseTarget

  const LOOKUP = TARGET ? lookups.rows[TARGET.id] : null

  return (
    <>
      <EntityConfirmReverseDialog
        open={dialog.reverseOpen}
        onOpenChange={dialog.setReverseOpen}
        title={WITHDRAWAL_DATATABLE.REVERSE_TITLE}
        description={
          LOOKUP
            ? FormatReverseWithdrawalDescription(
                FormatPositionLookup(LOOKUP)
              )
            : ""
        }
        confirmLabel={WITHDRAWAL_DATATABLE.REVERSE_CONFIRM_LABEL}
        cancelLabel={WITHDRAWAL_DATATABLE.REVERSE_CANCEL_LABEL}
        pending={dialog.reversePending}
        onConfirm={dialog.handleConfirmReverse}
      />

      <EntityReverseToast
        status={dialog.reverseStatus}
        errorMessage={dialog.reverseError}
        successTitle={WITHDRAWAL_DATATABLE.REVERSE_SUCCESS_TITLE}
        successDescription={
          WITHDRAWAL_DATATABLE.REVERSE_SUCCESS_DESCRIPTION
        }
        errorTitle={WITHDRAWAL_DATATABLE.REVERSE_ERROR_TITLE}
      />
    </>
  )
}

export { WithdrawalConfirmReverseDialog }