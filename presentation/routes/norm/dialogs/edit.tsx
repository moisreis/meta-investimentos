"use client"

import { EntityEditDialog } from "@/presentation/parts/dialogs/entity-edit"
import { EntityEditToast } from "@/presentation/parts/toasts/entity-edit-toast"
import type { EntityEditDialogModel } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import { EditNormForm } from "@/presentation/routes/norm/forms/edit"
import {
  NORM_DIALOG,
  NORM_FORM,
} from "@/presentation/routes/norm/settings/labels.settings"
import type { NormRow } from "@/presentation/types/norm-row.types"

import type { NormSelectOptions } from "../types/norm-list.types"

/**
 * Props for the norm edit dialog.
 */
export interface NormEditDialogProps {
  dialog: EntityEditDialogModel<NormRow>
  options: NormSelectOptions
}

/**
 * @summary
 * Renders the norm edit dialog flow.
 *
 * @remarks
 * Composes the shared edit dialog with the edit form
 * seeded from the target row. The result toast fires on
 * success or error; on success the dialog closes and the
 * server data refreshes.
 *
 * @param props - Props of the norm edit dialog.
 * @param props.dialog - The edit dialog flow state.
 * @param props.options - The registry options.
 *
 * @returns The norm edit dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function NormEditDialog({
  dialog,
  options,
}: NormEditDialogProps) {
  return (
    <>
      <EntityEditDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={NORM_DIALOG.EDIT_TITLE}
        description={NORM_DIALOG.EDIT_DESCRIPTION}
      >
        {dialog.target ? (
          <EditNormForm
            norm={dialog.target}
            options={options}
            onStatusChange={dialog.handleStatusChange}
          />
        ) : null}
      </EntityEditDialog>

      <EntityEditToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={NORM_FORM.UPDATE_SUCCESS_TITLE}
        successDescription={NORM_FORM.UPDATE_SUCCESS_DESCRIPTION}
        errorTitle={NORM_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { NormEditDialog }
