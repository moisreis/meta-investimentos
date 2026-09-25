"use client"

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
import { usePortfolioKpis } from "../hooks/use-portfolio-kpis.hook"
import type {
  PortfolioHoldingsCount,
  PortfolioOwner,
} from "../types/portfolio-list.types"

interface PortfolioListProps {
  data: PortfolioResponseDTO[] | null
  availableDates?: string[]
  holdingsCounts?: Record<string, PortfolioHoldingsCount> | null
  owner?: PortfolioOwner | null
}

function PortfolioList({
  data,
  availableDates = [],
  holdingsCounts = null,
  owner = null,
}: PortfolioListProps) {
  const PORTFOLIOS = data ?? []

  const filters = usePortfolioDatatableFilters(
    PORTFOLIOS,
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
    filters.performanceFor,
    holdingsCounts,
    owner
  )
  const kpis = usePortfolioKpis({
    portfolios: PORTFOLIOS,
    performanceFor: filters.performanceFor,
    holdingsCounts,
  })

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

      <PortfolioDatatableToolbar
        table={table}
        onAddItem={addDialog.handleOpen}
        filters={
          <PortfolioDatatableFilters
            isPerformanceDay={filters.isPerformanceDay}
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
