"use client"

import { IconCoin } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

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

interface FundListProps {
  data: FundResponseDTO[] | null
  options?: FundSelectOptions | null
  summaries?: Record<string, FundRowSummary> | null
  names?: FundNameLookups
}

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
