"use client"

import { useEntityBulkDeleteAction } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import { bulkDeleteApplicationsAction } from "@/presentation/routes/application/actions/bulk-delete-applications.action"
import { APPLICATION_DATATABLE } from "@/presentation/routes/application/settings/labels.settings"
import type { ApplicationRow } from "@/presentation/types/application-row.types"

/**
 * @summary
 * Binds the application bulk delete flow to the shared
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
 * @date 2026-10-20
 */
function useApplicationBulkDelete() {
  return useEntityBulkDeleteAction<ApplicationRow>({
    run: (ids) =>
      bulkDeleteApplicationsAction({ applicationIds: ids }),
    labels: APPLICATION_DATATABLE,
  })
}

export { useApplicationBulkDelete }
