"use client"

import { EntityAddDialog } from "@/presentation/parts/dialogs/entity-add"
import { EntityAddToast } from "@/presentation/parts/toasts/entity-add-toast"
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import type { EntityAddDialogModel } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { AddCategoryForm } from "@/presentation/routes/category/forms/add"
import {
  CATEGORY_DIALOG,
  CATEGORY_FORM,
} from "@/presentation/routes/category/settings/labels.settings"

import { CategoryAddAnotherDialog } from "./add-another"

/**
 * Props for the category add dialog.
 */
export interface CategoryAddDialogProps {
  dialog: EntityAddDialogModel
}

/**
 * @summary
 * Renders the category add dialog flow.
 *
 * @remarks
 * Composes the shared add dialog with the add form and
 * the add-another prompt. On success the add-another
 * prompt opens so the user can return to the table or
 * add another category. The result toast fires on both
 * outcomes.
 *
 * @param props - Props of the category add dialog.
 * @param props.dialog - The add dialog flow state.
 *
 * @returns The category add dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function CategoryAddDialog({ dialog }: CategoryAddDialogProps) {
  return (
    <>
      <EntityAddDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={CATEGORY_DIALOG.ADD_TITLE}
        description={CATEGORY_DIALOG.ADD_DESCRIPTION}
      >
        <AddCategoryForm
          key={dialog.formKey}
          onStatusChange={dialog.handleStatusChange}
        />
      </EntityAddDialog>

      <CategoryAddAnotherDialog
        open={dialog.anotherOpen}
        onOpenChange={dialog.handleBackToTable}
        onBack={dialog.handleBackToTable}
        onAddAnother={dialog.handleAddAnother}
      />

      <EntityAddToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={CATEGORY_FORM.CREATE_SUCCESS_TITLE}
        successDescription={
          CATEGORY_FORM.CREATE_SUCCESS_DESCRIPTION
        }
        errorTitle={CATEGORY_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { CategoryAddDialog }
