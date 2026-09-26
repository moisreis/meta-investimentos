"use client"

import { useEntityBulkDeleteAction } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import type { EntityBulkDeleteModel } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import { bulkDeleteUsersAction } from "@/presentation/routes/users/actions/bulk-delete-users.action"
import { USER_DATATABLE } from "@/presentation/routes/users/settings/labels.settings"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

/**
 * @summary
 * Binds the user bulk delete flow to the shared
 * entity bulk delete action.
 *
 * @remarks
 * Maps the selected row ids to the route bulk delete
 * server action and reuses the route datatable copy for
 * the outcome toast.
 *
 * @returns The bulk delete callback for the datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function useUserBulkDelete(): EntityBulkDeleteModel<UserResponseDTO> {
  return useEntityBulkDeleteAction<UserResponseDTO>({
    run: (ids) => bulkDeleteUsersAction({ userIds: ids }),
    labels: USER_DATATABLE,
  })
}

export { useUserBulkDelete }
