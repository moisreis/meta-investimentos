"use client"

import { IconCoin } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { FundRow } from "@/presentation/types/fund-row.types"

import { FundDatatableFilters } from "../datatable/filters"
import { FundDatatableTable } from "../datatable/table"
import { FundDatatableToolbar } from "../datatable/toolbar"
import { FundAddDialog } from "../dialogs/add"
import { FundConfirmDeleteDialog } from "../dialogs/confirm-delete"
import { FundEditDialog } from "../dialogs/edit"
import { EMPTY_FUND_NAME_LOOKUPS } from "../helpers/build-fund-name-lookups.helper"
import { useFundDatatableFilters } from "../hooks/use-fund-datatable-filters.hook"
import { useFundDatatable } from "../hooks/use-fund-datatable.hook"
import { useFundKpis } from "../hooks/use-fund-kpis.hook"
import { FUND_EMPTY } from "../settings/labels.settings"
import type {
  FundNameLookups,
  FundRowSummary,
  FundSelectOptions,
} from "../types/fund-list.types"

// Empty options used while the loader resolves.
const EMPTY_OPTIONS: FundSelectOptions = {
  banks: [],
  benchmarks: [],
  categories: [],
}

export interface FundListProps {
  data: FundRow[] | null
  options?: FundSelectOptions | null
  summaries?: Record<string, FundRowSummary> | null
  names?: FundNameLookups
}

/**
 * @summary
 * Renders the fund list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the search
 * filter, the empty state and the datatable. The add and
 * the edit dialogs are opened with the banks, the
 * benchmarks and the categories the form needs, so the
 * options travel with the page instead of being fetched
 * by each dialog.
 *
 * @param props - Props of the fund list page.
 * @param props.data - The fund rows, or `null` while
 *                     loading.
 * @param props.options - The bank, benchmark and category
 *                       options of the add and edit
 *                       forms.
 * @param props.summaries - The fund summaries the KPIs and
 *                          the row actions read.
 * @param props.names - The fund name lookups the row
 *                      actions and the delete dialogs
 *                      read.
 *
 * @returns The fund list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function FundList({
  data,
  options = null,
  summaries = null,
  names = EMPTY_FUND_NAME_LOOKUPS,
}: FundListProps) {
  const FUNDS = data ?? []
  const HAS_FUNDS = FUNDS.length > 0
  const OPTIONS = options ?? EMPTY_OPTIONS

  const filters = useFundDatatableFilters(FUNDS)
  const {
    table,
    rowActions,
    bulkDelete,
    addDialog,
    editDialog,
  } = useFundDatatable(filters.filteredFunds, summaries, names)
  const kpis = useFundKpis({ funds: FUNDS, summaries })

  return (
    <>
      <EntityDatatableKpiGroup>
        {kpis.map((kpi) => (
          <EntityDatatableKpiCard
            key={kpi.key}
            title={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
            comparison={kpi.comparison}
            dotIndicator={kpi.dotIndicator}
            icon={kpi.icon}
          />
        ))}
      </EntityDatatableKpiGroup>

      <FundDatatableToolbar
        table={table}
        onAddItem={addDialog.handleOpen}
        filters={
          <FundDatatableFilters
            query={filters.query}
            onQueryChange={filters.onQueryChange}
          />
        }
      />

      {HAS_FUNDS ? (
        <FundDatatableTable
          table={table}
          onBulkDelete={bulkDelete.handleBulkDelete}
        />
      ) : (
        <EntityEmptyTable
          icon={IconCoin}
          title={FUND_EMPTY.TITLE}
          description={FUND_EMPTY.DESCRIPTION}
          primaryActionLabel={FUND_EMPTY.PRIMARY_ACTION_LABEL}
          onPrimaryAction={addDialog.handleOpen}
        />
      )}

      <FundAddDialog dialog={addDialog} options={OPTIONS} />
      <FundEditDialog dialog={editDialog} options={OPTIONS} />
      <FundConfirmDeleteDialog dialog={rowActions} />
    </>
  )
}

export { FundList }
