"use client"

import { EntityEditDialog } from "@/presentation/parts/dialogs/entity-edit"
import { EntityEditToast } from "@/presentation/parts/toasts/entity-edit-toast"
import { useEntityEditDialog } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import type { EntityEditDialogModel } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"
import { EditCategoryForm } from "@/presentation/routes/category/forms/edit"
import {
  CATEGORY_DIALOG,
  CATEGORY_FORM,
} from "@/presentation/routes/category/settings/labels.settings"

/**
 * Props for the category edit dialog.
 */
export interface CategoryEditDialogProps {
  dialog: EntityEditDialogModel<CategoryResponseDTO>
}

/**
 * @summary
 * Renders the category edit dialog flow.
 *
 * @remarks
 * Composes the shared edit dialog with the edit form
 * seeded from the target row. The result toast fires on
 * success or error; on success the dialog closes and the
 * server data refreshes.
 *
 * @param props - Props of the category edit dialog.
 * @param props.dialog - The edit dialog flow state.
 *
 * @returns The category edit dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function CategoryEditDialog({
  dialog,
}: CategoryEditDialogProps) {
  return (
    <>
      <EntityEditDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={CATEGORY_DIALOG.EDIT_TITLE}
        description={CATEGORY_DIALOG.EDIT_DESCRIPTION}
      >
        {dialog.target ? (
          <EditCategoryForm
            category={dialog.target}
            onStatusChange={dialog.handleStatusChange}
          />
        ) : null}
      </EntityEditDialog>

      <EntityEditToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={CATEGORY_FORM.UPDATE_SUCCESS_TITLE}
        successDescription={
          CATEGORY_FORM.UPDATE_SUCCESS_DESCRIPTION
        }
        errorTitle={CATEGORY_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { CategoryEditDialog }
