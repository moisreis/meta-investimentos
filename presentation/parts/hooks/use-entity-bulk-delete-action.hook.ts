"use client"

import { useRouter } from "next/navigation"

import { useAuthFormToast } from "@/presentation/parts/hooks/use-auth-form-toast.hook"
import type { ActionResult } from "@/presentation/types/action-result"

/**
 * Bulk delete copy of an entity route.
 */
export interface EntityBulkDeleteLabels {
  BULK_DELETE_SUCCESS_TITLE: string
  BULK_DELETE_SUCCESS_DESCRIPTION: string
  BULK_DELETE_ERROR_TITLE: string
}

/**
 * Configuration of the bulk delete flow of an entity
 * route.
 *
 * @typeParam TData - Row type of the datatable.
 */
export interface EntityBulkDeleteConfig<
  TData extends { id: string },
> {
  run: (ids: string[]) => Promise<ActionResult<undefined>>
  labels: EntityBulkDeleteLabels
}

/**
 * View model of the bulk delete flow of an entity route.
 *
 * @typeParam TData - Row type of the datatable.
 */
export interface EntityBulkDeleteModel<TData> {
  handleBulkDelete: (items: TData[]) => Promise<void>
}

/**
 * @summary
 * Runs the bulk delete flow of an entity route.
 *
 * @remarks
 * Runs the bulk delete server action with the ids of the
 * selected rows, toasts the outcome and refreshes the
 * server data after a successful deletion.
 *
 * @explanation
 * Use as the `onBulkDelete` callback of the entity table
 * pagination, paired with `useEntityBulkDelete` which
 * owns the dialog state. Routes differ only in the action
 * and the toast copy, so both live in the config.
 *
 * @typeParam TData - Row type of the datatable.
 *
 * @param config - Action runner and toast copy.
 * @param config.run - Maps the selected ids to the route
 *   bulk delete action.
 * @param config.labels - Bulk delete toast copy.
 *
 * @returns The callback invoked with the selected items.
 *
 * @example
 * const BULK_DELETE = useEntityBulkDeleteAction({
 *   run: (ids) => bulkDeleteCategoriesAction({
 *     categoryIds: ids,
 *   }),
 *   labels: CATEGORY_DATATABLE,
 * })
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function useEntityBulkDeleteAction<
  TData extends { id: string },
>({
  run,
  labels,
}: EntityBulkDeleteConfig<TData>): EntityBulkDeleteModel<TData> {
  const ROUTER = useRouter()
  const { showSuccess, showError } = useAuthFormToast({
    successTitle: labels.BULK_DELETE_SUCCESS_TITLE,
    successDescription: labels.BULK_DELETE_SUCCESS_DESCRIPTION,
    errorTitle: labels.BULK_DELETE_ERROR_TITLE,
  })

  const HandleBulkDelete = async (items: TData[]) => {
    const RESULT = await run(items.map((item) => item.id))

    if (!RESULT.success) {
      showError(RESULT.error)
      return
    }

    showSuccess()
    ROUTER.refresh()
  }

  return { handleBulkDelete: HandleBulkDelete }
}

export { useEntityBulkDeleteAction }
