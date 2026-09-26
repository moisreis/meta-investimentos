"use client"

import { EntityEditDialog } from "@/presentation/parts/dialogs/entity-edit"
import { EntityEditToast } from "@/presentation/parts/toasts/entity-edit-toast"
import { useEntityEditDialog } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import type { EntityEditDialogModel } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"
import { EditUserForm } from "@/presentation/routes/users/forms/edit"
import {
  USER_DIALOG,
  USER_FORM,
} from "@/presentation/routes/users/settings/labels.settings"

/**
 * Props for the user edit dialog.
 */
export interface UserEditDialogProps {
  dialog: EntityEditDialogModel<UserResponseDTO>
}

/**
 * @summary
 * Renders the user edit dialog flow.
 *
 * @remarks
 * Composes the shared edit dialog with the edit form
 * seeded from the target row. The result toast fires on
 * success or error; on success the dialog closes and the
 * server data refreshes.
 *
 * @param props - Props of the user edit dialog.
 * @param props.dialog - The edit dialog flow state.
 *
 * @returns The user edit dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function UserEditDialog({ dialog }: UserEditDialogProps) {
  return (
    <>
      <EntityEditDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={USER_DIALOG.EDIT_TITLE}
        description={USER_DIALOG.EDIT_DESCRIPTION}
      >
        {dialog.target ? (
          <EditUserForm
            user={dialog.target}
            onStatusChange={dialog.handleStatusChange}
          />
        ) : null}
      </EntityEditDialog>

      <EntityEditToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={USER_FORM.UPDATE_SUCCESS_TITLE}
        successDescription={USER_FORM.UPDATE_SUCCESS_DESCRIPTION}
        errorTitle={USER_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { UserEditDialog }
