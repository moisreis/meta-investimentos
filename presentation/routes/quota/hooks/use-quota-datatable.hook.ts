"use client"

import { useCallback, useMemo } from "react"
import {
  ColumnHelper,
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { QuotaRow } from "@/presentation/types/quota-row.types"

import { CreateQuotaTableColumns } from "../datatable/table-columns"
import { EMPTY_QUOTA_FUND_LOOKUPS } from "../helpers/build-quota-fund-lookups.helper"
import type { QuotaFundLookups } from "../types/quota-list.types"

// Column helper bound to the entity table features.
const COLUMN_HELPER: ColumnHelper<
  EntityTableFeatures,
  QuotaRow
> = createColumnHelper<EntityTableFeatures, QuotaRow>()

/**
 * @summary
 * Coordinates the quota datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the
 * datatable and the pagination, wiring the fund name
 * resolution into the column definitions. The pagination
 * starts at ten rows per page; it is seeded through
 * `initialState` so the slice stays mutable — the `state`
 * option would treat it as controlled and ignore every
 * page and page-size change.
 *
 * @param quotas - The rows rendered by the datatable.
 * @param lookups - The quota fund lookups.
 *
 * @returns The shared table instance.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useQuotaDatatable(
  quotas: QuotaRow[],
  lookups: QuotaFundLookups = EMPTY_QUOTA_FUND_LOOKUPS
) {
  const fundFor = useCallback(
    (quotaId: string) => lookups.quotas[quotaId] ?? null,
    [lookups]
  )

  const COLUMNS = useMemo(
    () => CreateQuotaTableColumns(COLUMN_HELPER, { fundFor }),
    [fundFor]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: quotas,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  return { table: TABLE }
}

export { useQuotaDatatable }
