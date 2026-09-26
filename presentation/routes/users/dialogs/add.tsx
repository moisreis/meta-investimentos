"use client"

import { EntityAddDialog } from "@/presentation/parts/dialogs/entity-add"
import { EntityAddToast } from "@/presentation/parts/toasts/entity-add-toast"
import { AddUserForm } from "@/presentation/routes/users/forms/add"
import { useUserAddDialog } from "@/presentation/routes/users/hooks/use-user-add-dialog.hook"
import {
  USER_DIALOG,
  USER_FORM,
} from "@/presentation/routes/users/settings/labels.settings"

import { UserAddAnotherDialog } from "./add-another"

/**
 * Props for the user add dialog.
 */
export interface UserAddDialogProps {
  dialog: ReturnType<typeof useUserAddDialog>
}

/**
 * @summary
 * Renders the user add dialog flow.
 *
 * @remarks
 * Composes the shared add dialog with the add form and
 * the add-another prompt. On success the add-another
 * prompt opens so the user can return to the table or
 * add another user. The result toast fires on both
 * outcomes.
 *
 * @param props - Props of the user add dialog.
 * @param props.dialog - The add dialog flow state.
 *
 * @returns The user add dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function UserAddDialog({ dialog }: UserAddDialogProps) {
  return (
    <>
      <EntityAddDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={USER_DIALOG.ADD_TITLE}
        description={USER_DIALOG.ADD_DESCRIPTION}
      >
        <AddUserForm
          key={dialog.formKey}
          onStatusChange={dialog.handleStatusChange}
        />
      </EntityAddDialog>

      <UserAddAnotherDialog
        open={dialog.anotherOpen}
        onOpenChange={dialog.handleBackToTable}
        onBack={dialog.handleBackToTable}
        onAddAnother={dialog.handleAddAnother}
      />

      <EntityAddToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={USER_FORM.CREATE_SUCCESS_TITLE}
        successDescription={USER_FORM.CREATE_SUCCESS_DESCRIPTION}
        errorTitle={USER_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { UserAddDialog }
