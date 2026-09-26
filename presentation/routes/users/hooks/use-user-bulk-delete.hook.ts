"use client"

import { useRouter } from "next/navigation"

import { useAuthFormToast } from "@/presentation/parts/hooks/use-auth-form-toast.hook"
import { bulkDeleteUsersAction } from "@/presentation/routes/users/actions/bulk-delete-users.action"
import { USER_DATATABLE } from "@/presentation/routes/users/settings/labels.settings"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

/**
 * @summary
 * Manages the bulk delete flow of the user datatable.
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
function useUserBulkDelete() {
  const ROUTER = useRouter()
  const { showSuccess, showError } = useAuthFormToast({
    successTitle: USER_DATATABLE.BULK_DELETE_SUCCESS_TITLE,
    successDescription:
      USER_DATATABLE.BULK_DELETE_SUCCESS_DESCRIPTION,
    errorTitle: USER_DATATABLE.BULK_DELETE_ERROR_TITLE,
  })

  async function HandleBulkDelete(items: UserResponseDTO[]) {
    const RESULT = await bulkDeleteUsersAction({
      userIds: items.map((item) => item.id),
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

export { useUserBulkDelete }
