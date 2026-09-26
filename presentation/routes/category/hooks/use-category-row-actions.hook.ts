"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import type { EntityRowActionsModel } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deleteCategoryAction } from "@/presentation/routes/category/actions/delete-category.action"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"

/**
 * @summary
 * Binds the category row actions to the shared
 * entity row actions hook.
 *
 * @remarks
 * Maps the row id to the route delete server action
 * only. The shared hook owns the confirm dialog
 * state and the delete result toast status.
 *
 * @returns The row actions and delete dialog state.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function useCategoryRowActions(): EntityRowActionsModel<CategoryResponseDTO> {
  return useEntityRowActions<CategoryResponseDTO>({
    runDelete: (id) => deleteCategoryAction({ categoryId: id }),
  })
}

export { useCategoryRowActions }
