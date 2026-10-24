"use client"

import { EntityConfirmReverseDialog } from "@/presentation/parts/dialogs/entity-confirm-reverse"
import { EntityReverseToast } from "@/presentation/parts/toasts/entity-reverse-toast"
import { FormatPositionLookup } from "@/presentation/presenters/lookup.presenter"
import { FormatReversePositionActivityDescription } from "@/presentation/routes/position/settings/labels.settings"
import { POSITION_ACTIVITY } from "@/presentation/routes/position/settings/labels.settings"

import type { PositionActivityRowActionsModel } from "../hooks/use-position-activity-row-actions.hook"

/**
 * Props for the position activity confirm-reverse dialog.
 */
export interface PositionActivityConfirmReverseDialogProps {
  dialog: PositionActivityRowActionsModel
}

/**
 * @summary
 * Renders the position activity confirm-reverse dialog flow.
 *
 * @remarks
 * Composes the shared confirm-reverse dialog with the
 * position activity copy and the reverse result toast.
 * The description resolves the target fund and portfolio
 * names through the lookup presenter when possible.
 *
 * @param props - Props of the confirm-reverse dialog.
 * @param props.dialog - The row actions flow state.
 *
 * @returns The position activity confirm-reverse dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-21
 */
function PositionActivityConfirmReverseDialog({
  dialog,
}: PositionActivityConfirmReverseDialogProps) {
  const TARGET = dialog.reverseTarget

  const LOOKUP_LABEL = TARGET
    ? FormatPositionLookup({
        fundName: TARGET.fundName,
      })
    : ""

  return (
    <>
      <EntityConfirmReverseDialog
        open={dialog.reverseOpen}
        onOpenChange={dialog.setReverseOpen}
        title={POSITION_ACTIVITY.REVERSE_TITLE}
        description={
          LOOKUP_LABEL
            ? FormatReversePositionActivityDescription(
                LOOKUP_LABEL
              )
            : ""
        }
        confirmLabel={POSITION_ACTIVITY.REVERSE_CONFIRM_LABEL}
        cancelLabel={POSITION_ACTIVITY.REVERSE_CANCEL_LABEL}
        pending={dialog.reversePending}
        onConfirm={dialog.handleConfirmReverse}
      />

      <EntityReverseToast
        status={dialog.reverseStatus}
        errorMessage={dialog.reverseError}
        successTitle={POSITION_ACTIVITY.REVERSE_SUCCESS_TITLE}
        successDescription={
          POSITION_ACTIVITY.REVERSE_SUCCESS_DESCRIPTION
        }
        errorTitle={POSITION_ACTIVITY.REVERSE_ERROR_TITLE}
      />
    </>
  )
}

export { PositionActivityConfirmReverseDialog }
