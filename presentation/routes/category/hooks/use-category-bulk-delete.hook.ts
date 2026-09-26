"use client"

import { useEntityBulkDeleteAction } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import type { EntityBulkDeleteModel } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import { bulkDeleteCategoriesAction } from "@/presentation/routes/category/actions/bulk-delete-categories.action"
import { CATEGORY_DATATABLE } from "@/presentation/routes/category/settings/labels.settings"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"

/**
 * @summary
 * Binds the category bulk delete flow to the shared
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
function useCategoryBulkDelete(): EntityBulkDeleteModel<CategoryResponseDTO> {
  return useEntityBulkDeleteAction<CategoryResponseDTO>({
    run: (ids) =>
      bulkDeleteCategoriesAction({ categoryIds: ids }),
    labels: CATEGORY_DATATABLE,
  })
}

export { useCategoryBulkDelete }
