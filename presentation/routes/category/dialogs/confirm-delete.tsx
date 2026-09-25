"use client"

import { EntityConfirmDeleteDialog } from "@/presentation/parts/dialogs/entity-confirm-delete"
import { EntityDeleteToast } from "@/presentation/parts/toasts/entity-delete-toast"
import { useCategoryRowActions } from "@/presentation/routes/category/hooks/use-category-row-actions.hook"
import {
  CATEGORY_DATATABLE,
  FormatDeleteCategoryDescription,
} from "@/presentation/routes/category/settings/labels.settings"

/**
 * Props for the category confirm-delete dialog.
 */
export interface CategoryConfirmDeleteDialogProps {
  dialog: ReturnType<typeof useCategoryRowActions>
}

/**
 * @summary
 * Renders the category confirm-delete dialog flow.
 *
 * @remarks
 * Composes the shared confirm-delete dialog with the
 * category copy and the delete result toast. The title
 * and description come from the datatable settings.
 *
 * @param props - Props of the confirm-delete dialog.
 * @param props.dialog - The row actions flow state.
 *
 * @returns The category confirm-delete dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function CategoryConfirmDeleteDialog({
  dialog,
}: CategoryConfirmDeleteDialogProps) {
  return (
    <>
      <EntityConfirmDeleteDialog
        open={dialog.deleteOpen}
        onOpenChange={dialog.setDeleteOpen}
        title={CATEGORY_DATATABLE.DELETE_TITLE}
        description={
          dialog.deleteTarget
            ? FormatDeleteCategoryDescription(
                dialog.deleteTarget.name
              )
            : ""
        }
        confirmLabel={CATEGORY_DATATABLE.DELETE_CONFIRM_LABEL}
        cancelLabel={CATEGORY_DATATABLE.DELETE_CANCEL_LABEL}
        pending={dialog.deletePending}
        onConfirm={dialog.handleConfirmDelete}
      />

      <EntityDeleteToast
        status={dialog.deleteStatus}
        errorMessage={dialog.deleteError}
        successTitle={CATEGORY_DATATABLE.DELETE_SUCCESS_TITLE}
        successDescription={
          CATEGORY_DATATABLE.DELETE_SUCCESS_DESCRIPTION
        }
        errorTitle={CATEGORY_DATATABLE.DELETE_ERROR_TITLE}
      />
    </>
  )
}

export { CategoryConfirmDeleteDialog }
