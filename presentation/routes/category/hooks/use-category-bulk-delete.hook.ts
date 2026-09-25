"use client"

import { useRouter } from "next/navigation"

import { useAuthFormToast } from "@/presentation/parts/hooks/use-auth-form-toast.hook"
import { bulkDeleteCategoriesAction } from "@/presentation/routes/category/actions/bulk-delete-categories.action"
import { CATEGORY_DATATABLE } from "@/presentation/routes/category/settings/labels.settings"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"

/**
 * @summary
 * Manages the bulk delete flow of the category datatable.
 *
 * @remarks
 * Runs the bulk delete server action with the ids of the
 * selected rows, toasts the outcome and refreshes the
 * server data after a successful deletion.
 *
 * @returns The callback invoked with the selected items.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useCategoryBulkDelete() {
  const ROUTER = useRouter()
  const { showSuccess, showError } = useAuthFormToast({
    successTitle: CATEGORY_DATATABLE.BULK_DELETE_SUCCESS_TITLE,
    successDescription:
      CATEGORY_DATATABLE.BULK_DELETE_SUCCESS_DESCRIPTION,
    errorTitle: CATEGORY_DATATABLE.BULK_DELETE_ERROR_TITLE,
  })

  async function HandleBulkDelete(items: CategoryResponseDTO[]) {
    const RESULT = await bulkDeleteCategoriesAction({
      categoryIds: items.map((item) => item.id),
    })

    if (RESULT.error) {
      showError(RESULT.error)
      return
    }

    showSuccess()
    ROUTER.refresh()
  }

  return { handleBulkDelete: HandleBulkDelete }
}

export { useCategoryBulkDelete }
