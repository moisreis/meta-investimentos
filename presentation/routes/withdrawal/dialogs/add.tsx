"use client"

import { EntityAddDialog } from "@/presentation/parts/dialogs/entity-add"
import { EntityAddToast } from "@/presentation/parts/toasts/entity-add-toast"
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import type { EntityAddDialogModel } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { AddWithdrawalForm } from "@/presentation/routes/withdrawal/forms/add"
import {
  WITHDRAWAL_DIALOG,
  WITHDRAWAL_FORM,
} from "@/presentation/routes/withdrawal/settings/labels.settings"

import type { WithdrawalAddOptions } from "../types/withdrawal-add.types"
import { WithdrawalAddAnotherDialog } from "./add-another"

/**
 * Props for the withdrawal add dialog.
 */
export interface WithdrawalAddDialogProps {
  dialog: EntityAddDialogModel
  options: WithdrawalAddOptions
}

/**
 * @summary
 * Renders the withdrawal add dialog flow.
 *
 * @remarks
 * Composes the shared add dialog with the add form and
 * the add-another prompt. On success the add-another
 * prompt opens so the user can go back to the screen or
 * add another withdrawal. The result toast fires on both
 * outcomes.
 *
 * @param props - Props of the withdrawal add dialog.
 * @param props.dialog - The add dialog flow state.
 * @param props.options - The position options.
 *
 * @returns The withdrawal add dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function WithdrawalAddDialog({
  dialog,
  options,
}: WithdrawalAddDialogProps) {
  return (
    <>
      <EntityAddDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={WITHDRAWAL_DIALOG.ADD_TITLE}
        description={WITHDRAWAL_DIALOG.ADD_DESCRIPTION}
      >
        <AddWithdrawalForm
          key={dialog.formKey}
          options={options}
          onStatusChange={dialog.handleStatusChange}
        />
      </EntityAddDialog>

      <WithdrawalAddAnotherDialog
        open={dialog.anotherOpen}
        onOpenChange={dialog.handleBackToTable}
        onBack={dialog.handleBackToTable}
        onAddAnother={dialog.handleAddAnother}
      />

      <EntityAddToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={WITHDRAWAL_FORM.CREATE_SUCCESS_TITLE}
        successDescription={
          WITHDRAWAL_FORM.CREATE_SUCCESS_DESCRIPTION
        }
        errorTitle={WITHDRAWAL_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { WithdrawalAddDialog }
