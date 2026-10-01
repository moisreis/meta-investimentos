"use client"

import { IconBuildingBank } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { BankRow } from "@/presentation/types/bank-row.types"

import { BankDatatableFilters } from "../datatable/filters"
import { BankDatatableTable } from "../datatable/table"
import { BankDatatableToolbar } from "../datatable/toolbar"
import { BankAddDialog } from "../dialogs/add"
import { BankConfirmDeleteDialog } from "../dialogs/confirm-delete"
import { BankEditDialog } from "../dialogs/edit"
import { useBankDatatableFilters } from "../hooks/use-bank-datatable-filters.hook"
import { useBankDatatable } from "../hooks/use-bank-datatable.hook"
import { useBankKpis } from "../hooks/use-bank-kpis.hook"
import { BANK_EMPTY } from "../settings/labels.settings"
import type { BankRowSummary } from "../types/bank-list.types"

export interface BankListProps {
  data: BankRow[] | null
  summaries?: Record<string, BankRowSummary> | null
}

/**
 * @summary
 * Renders the bank list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the search
 * filter, the empty state and the datatable. The page
 * renders no markup of its own, so the blocks above the
 * table stay in the parts and the blocks below it stay
 * in the route components.
 *
 * @param props - Props of the bank list page.
 * @param props.data - The bank rows, or `null` while
 *                     loading.
 * @param props.summaries - The bank summaries the KPIs
 *                          and the row actions read.
 *
 * @returns The bank list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function BankList({ data, summaries = null }: BankListProps) {
  const PENDING = data === null
  const BANKS = data ?? []
  const HAS_BANKS = BANKS.length > 0

  const filters = useBankDatatableFilters(BANKS)
  const {
    table,
    rowActions,
    bulkDelete,
    addDialog,
    editDialog,
  } = useBankDatatable(filters.filteredBanks, summaries)
  const kpis = useBankKpis({ banks: BANKS, summaries })

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

      <BankDatatableToolbar
        table={table}
        onAddItem={addDialog.handleOpen}
        filters={
          <BankDatatableFilters
            query={filters.query}
            onQueryChange={filters.onQueryChange}
          />
        }
      />

      {PENDING || HAS_BANKS ? (
        <BankDatatableTable
          pending={PENDING}
          table={table}
          onBulkDelete={bulkDelete.handleBulkDelete}
        />
      ) : (
        <EntityEmptyTable
          icon={IconBuildingBank}
          title={BANK_EMPTY.TITLE}
          description={BANK_EMPTY.DESCRIPTION}
          primaryActionLabel={BANK_EMPTY.PRIMARY_ACTION_LABEL}
          onPrimaryAction={addDialog.handleOpen}
        />
      )}

      <BankAddDialog dialog={addDialog} />
      <BankEditDialog dialog={editDialog} />
      <BankConfirmDeleteDialog dialog={rowActions} />
    </>
  )
}

export { BankList }
