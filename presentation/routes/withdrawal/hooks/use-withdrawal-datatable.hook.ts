"use client"

import { useCallback, useMemo } from "react"
import {
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { WithdrawalResponseDTO } from "@/services/withdrawal/dto/withdrawal-response.dto"

import { CreateWithdrawalTableColumns } from "../datatable/table-columns"
import { EMPTY_WITHDRAWAL_LOOKUPS } from "../helpers/build-withdrawal-lookups.helper"
import type { WithdrawalLookups } from "../types/withdrawal-list.types"

// Column helper bound to the entity table features.
const COLUMN_HELPER = createColumnHelper<
  EntityTableFeatures,
  WithdrawalResponseDTO
>()

/**
 * @summary
 * Coordinates the withdrawal datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the
 * datatable and the pagination, wiring the portfolio and
 * fund name resolution into the column definitions. The
 * pagination starts at ten rows per page; it is seeded
 * through `initialState` so the slice stays mutable.
 *
 * @param withdrawals - The rows rendered by the table.
 * @param lookups - The withdrawal lookups.
 *
 * @returns The shared table instance.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useWithdrawalDatatable(
  withdrawals: WithdrawalResponseDTO[],
  lookups: WithdrawalLookups = EMPTY_WITHDRAWAL_LOOKUPS
) {
  const rowFor = useCallback(
    (withdrawalId: string) => lookups.rows[withdrawalId] ?? null,
    [lookups]
  )

  const COLUMNS = useMemo(
    () =>
      CreateWithdrawalTableColumns(COLUMN_HELPER, {
        rowFor,
      }),
    [rowFor]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: withdrawals,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  return { table: TABLE }
}

export { useWithdrawalDatatable }
