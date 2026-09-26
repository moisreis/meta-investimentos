"use client"

import { EntityAddDialog } from "@/presentation/parts/dialogs/entity-add"
import { EntityAddToast } from "@/presentation/parts/toasts/entity-add-toast"
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import type { EntityAddDialogModel } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { AddApplicationForm } from "@/presentation/routes/application/forms/add"
import {
  APPLICATION_DIALOG,
  APPLICATION_FORM,
} from "@/presentation/routes/application/settings/labels.settings"

import type { ApplicationAddOptions } from "../types/application-add.types"
import { ApplicationAddAnotherDialog } from "./add-another"

/**
 * Props for the application add dialog.
 */
export interface ApplicationAddDialogProps {
  dialog: EntityAddDialogModel
  portfolioId: string
  options: ApplicationAddOptions
}

/**
 * @summary
 * Renders the application add dialog flow.
 *
 * @remarks
 * Composes the shared add dialog with the add form and
 * the add-another prompt. On success the add-another
 * prompt opens so the user can go back to the screen or
 * add another application. The result toast fires on both
 * outcomes.
 *
 * @param props - Props of the application add dialog.
 * @param props.dialog - The add dialog flow state.
 * @param props.portfolioId - Portfolio receiving the
 * application.
 * @param props.options - The fund options.
 *
 * @returns The application add dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function ApplicationAddDialog({
  dialog,
  portfolioId,
  options,
}: ApplicationAddDialogProps) {
  return (
    <>
      <EntityAddDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={APPLICATION_DIALOG.ADD_TITLE}
        description={APPLICATION_DIALOG.ADD_DESCRIPTION}
      >
        <AddApplicationForm
          key={dialog.formKey}
          portfolioId={portfolioId}
          options={options}
          onStatusChange={dialog.handleStatusChange}
        />
      </EntityAddDialog>

      <ApplicationAddAnotherDialog
        open={dialog.anotherOpen}
        onOpenChange={dialog.handleBackToTable}
        onBack={dialog.handleBackToTable}
        onAddAnother={dialog.handleAddAnother}
      />

      <EntityAddToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={APPLICATION_FORM.CREATE_SUCCESS_TITLE}
        successDescription={
          APPLICATION_FORM.CREATE_SUCCESS_DESCRIPTION
        }
        errorTitle={APPLICATION_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { ApplicationAddDialog }
