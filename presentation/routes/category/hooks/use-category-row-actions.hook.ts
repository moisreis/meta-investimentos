"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deleteCategoryAction } from "@/presentation/routes/category/actions/delete-category.action"
import type { CategoryRow } from "@/presentation/types/category-row.types"

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
function useCategoryRowActions() {
  return useEntityRowActions<CategoryRow>({
    runDelete: (id) => deleteCategoryAction({ categoryId: id }),
  })
}

export { useCategoryRowActions }
