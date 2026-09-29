"use client"

import { EntityConfirmReverseDialog } from "@/presentation/parts/dialogs/entity-confirm-reverse"
import { EntityReverseToast } from "@/presentation/parts/toasts/entity-reverse-toast"
import { FormatPositionLookup } from "@/presentation/presenters/lookup.presenter"
import { useApplicationRowActions } from "@/presentation/routes/application/hooks/use-application-row-actions.hook"
import {
  APPLICATION_DATATABLE,
  FormatReverseApplicationDescription,
} from "@/presentation/routes/application/settings/labels.settings"

import type { ApplicationLookups } from "../types/application-list.types"

/**
 * Props for the application confirm-reverse dialog.
 */
export interface ApplicationConfirmReverseDialogProps {
  dialog: ReturnType<typeof useApplicationRowActions>
  lookups: ApplicationLookups
}

/**
 * @summary
 * Renders the application confirm-reverse dialog flow.
 *
 * @remarks
 * Composes the shared confirm-reverse dialog with the
 * application copy and the reverse result toast. The title
 * and description come from the datatable settings; the
 * description resolves the target fund and portfolio names
 * through the lookup presenter.
 *
 * @param props - Props of the confirm-reverse dialog.
 * @param props.dialog - The row actions flow state.
 * @param props.lookups - The application row lookups.
 *
 * @returns The application confirm-reverse dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function ApplicationConfirmReverseDialog({
  dialog,
  lookups,
}: ApplicationConfirmReverseDialogProps) {
  const TARGET = dialog.reverseTarget

  const LOOKUP = TARGET ? lookups.rows[TARGET.id] : null

  return (
    <>
      <EntityConfirmReverseDialog
        open={dialog.reverseOpen}
        onOpenChange={dialog.setReverseOpen}
        title={APPLICATION_DATATABLE.REVERSE_TITLE}
        description={
          LOOKUP
            ? FormatReverseApplicationDescription(
                FormatPositionLookup(LOOKUP)
              )
            : ""
        }
        confirmLabel={APPLICATION_DATATABLE.REVERSE_CONFIRM_LABEL}
        cancelLabel={APPLICATION_DATATABLE.REVERSE_CANCEL_LABEL}
        pending={dialog.reversePending}
        onConfirm={dialog.handleConfirmReverse}
      />

      <EntityReverseToast
        status={dialog.reverseStatus}
        errorMessage={dialog.reverseError}
        successTitle={APPLICATION_DATATABLE.REVERSE_SUCCESS_TITLE}
        successDescription={
          APPLICATION_DATATABLE.REVERSE_SUCCESS_DESCRIPTION
        }
        errorTitle={APPLICATION_DATATABLE.REVERSE_ERROR_TITLE}
      />
    </>
  )
}

export { ApplicationConfirmReverseDialog }