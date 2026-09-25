"use client"

import {
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import { PortfolioDatatableFilters } from "../datatable/filters"
import { PortfolioDatatableTable } from "../datatable/table"
import { PortfolioDatatableToolbar } from "../datatable/toolbar"
import { PortfolioAddDialog } from "../dialogs/add"
import { PortfolioConfirmDeleteDialog } from "../dialogs/confirm-delete"
import { PortfolioEditDialog } from "../dialogs/edit"
import { usePortfolioDatatableFilters } from "../hooks/use-portfolio-datatable-filters.hook"
import { usePortfolioDatatable } from "../hooks/use-portfolio-datatable.hook"

interface PortfolioListProps {
  data: PortfolioResponseDTO[] | null
  availableDates?: string[]
}

function PortfolioList({
  data,
  availableDates = [],
}: PortfolioListProps) {
  const filters = usePortfolioDatatableFilters(
    data ?? [],
    availableDates
  )
  const {
    table,
    rowActions,
    bulkDelete,
    addDialog,
    editDialog,
  } = usePortfolioDatatable(
    filters.filteredPortfolios,
    filters.performanceFor
  )

  return (
    <>
      <EntityDatatableKpiGroup>
        <EntityDatatableKpiCard
          title="Patrimônio Total"
          value="R$ 1.901.910,00"
          trend="+ 12%"
          dotIndicator="success"
          comparison="vs. mês anterior"
          icon={IconTrendingUp}
        />
        <EntityDatatableKpiCard
          title="Rendimento Mensal"
          value="R$ 18.450,20"
          trend="- 2.4%"
          dotIndicator="negative"
          comparison="vs. mês anterior"
          icon={IconTrendingDown}
        />
        <EntityDatatableKpiCard
          title="Ativos Custodiados"
          value="14"
          comparison="em 4 corretoras"
        />
        <EntityDatatableKpiCard
          title="Maior Alocação"
          value="Renda Fixa"
          comparison="45% da carteira"
        />
      </EntityDatatableKpiGroup>

      <PortfolioDatatableToolbar
        table={table}
        onAddItem={addDialog.handleOpen}
        filters={
          <PortfolioDatatableFilters
            dates={filters.calendarDates}
            range={filters.range}
            onRangeChange={filters.onRangeChange}
            query={filters.query}
            onQueryChange={filters.onQueryChange}
          />
        }
      />

      <PortfolioDatatableTable
        table={table}
        onBulkDelete={bulkDelete.handleBulkDelete}
      />

      <PortfolioAddDialog dialog={addDialog} />
      <PortfolioEditDialog dialog={editDialog} />
      <PortfolioConfirmDeleteDialog dialog={rowActions} />
    </>
  )
}

export { PortfolioList }
