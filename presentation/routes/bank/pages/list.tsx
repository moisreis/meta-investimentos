"use client"

import { IconBuildingBank } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"

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

interface BankListProps {
  data: BankResponseDTO[] | null
  summaries?: Record<string, BankRowSummary> | null
}

function BankList({ data, summaries = null }: BankListProps) {
  const BANKS = data ?? []

  const filters = useBankDatatableFilters(BANKS)
  const {
    table,
    rowActions,
    bulkDelete,
    addDialog,
    editDialog,
  } = useBankDatatable(filters.filteredBanks, summaries)
  const kpis = useBankKpis({ banks: BANKS, summaries })

  if (BANKS.length === 0) {
    return (
      <EntityEmptyTable
        icon={IconBuildingBank}
        title={BANK_EMPTY.TITLE}
        description={BANK_EMPTY.DESCRIPTION}
        primaryActionLabel={BANK_EMPTY.PRIMARY_ACTION_LABEL}
        onPrimaryAction={addDialog.handleOpen}
      />
    )
  }

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

      <BankDatatableTable
        table={table}
        onBulkDelete={bulkDelete.handleBulkDelete}
      />

      <BankAddDialog dialog={addDialog} />
      <BankEditDialog dialog={editDialog} />
      <BankConfirmDeleteDialog dialog={rowActions} />
    </>
  )
}

export { BankList }
