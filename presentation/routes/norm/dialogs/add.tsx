"use client"

import { EntityAddDialog } from "@/presentation/parts/dialogs/entity-add"
import { EntityAddToast } from "@/presentation/parts/toasts/entity-add-toast"
import type { EntityAddDialogModel } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { AddNormForm } from "@/presentation/routes/norm/forms/add"
import {
  NORM_DIALOG,
  NORM_FORM,
} from "@/presentation/routes/norm/settings/labels.settings"

import type { NormSelectOptions } from "../types/norm-list.types"
import { NormAddAnotherDialog } from "./add-another"

/**
 * Props for the norm add dialog.
 */
export interface NormAddDialogProps {
  dialog: EntityAddDialogModel
  options: NormSelectOptions
}

/**
 * @summary
 * Renders the norm add dialog flow.
 *
 * @remarks
 * Composes the shared add dialog with the add form and
 * the add-another prompt. On success the add-another
 * prompt opens so the user can return to the table or
 * add another norm. The result toast fires on both
 * outcomes.
 *
 * @param props - Props of the norm add dialog.
 * @param props.dialog - The add dialog flow state.
 * @param props.options - The registry options.
 *
 * @returns The norm add dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function NormAddDialog({ dialog, options }: NormAddDialogProps) {
  return (
    <>
      <EntityAddDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={NORM_DIALOG.ADD_TITLE}
        description={NORM_DIALOG.ADD_DESCRIPTION}
      >
        <AddNormForm
          key={dialog.formKey}
          options={options}
          onStatusChange={dialog.handleStatusChange}
        />
      </EntityAddDialog>

      <NormAddAnotherDialog
        open={dialog.anotherOpen}
        onOpenChange={dialog.handleBackToTable}
        onBack={dialog.handleBackToTable}
        onAddAnother={dialog.handleAddAnother}
      />

      <EntityAddToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={NORM_FORM.CREATE_SUCCESS_TITLE}
        successDescription={NORM_FORM.CREATE_SUCCESS_DESCRIPTION}
        errorTitle={NORM_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { NormAddDialog }
