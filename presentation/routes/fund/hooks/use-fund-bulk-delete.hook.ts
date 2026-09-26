"use client"

import { useEntityBulkDeleteAction } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import type { EntityBulkDeleteModel } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import { bulkDeleteFundsAction } from "@/presentation/routes/fund/actions/bulk-delete-funds.action"
import { FUND_DATATABLE } from "@/presentation/routes/fund/settings/labels.settings"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

/**
 * @summary
 * Binds the fund bulk delete flow to the shared
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
function useFundBulkDelete(): EntityBulkDeleteModel<FundResponseDTO> {
  return useEntityBulkDeleteAction<FundResponseDTO>({
    run: (ids) => bulkDeleteFundsAction({ fundIds: ids }),
    labels: FUND_DATATABLE,
  })
}

export { useFundBulkDelete }
