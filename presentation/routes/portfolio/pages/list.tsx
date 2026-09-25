"use client"

import { IconWallet } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
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
import { PORTFOLIO_EMPTY } from "../settings/labels.settings"
import type { PortfolioRowSummary } from "../types/portfolio-list.types"

interface PortfolioListProps {
  data: PortfolioResponseDTO[] | null
  availableDates?: string[]
  summaries?: Record<string, PortfolioRowSummary> | null
}

function PortfolioList({
  data,
  availableDates = [],
  summaries = null,
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
    summaries
  )
  const kpis = usePortfolioKpis({
    portfolios: PORTFOLIOS,
    performanceFor: filters.performanceFor,
    summaries,
  })

  if (PORTFOLIOS.length === 0) {
    return (
      <EntityEmptyTable
        icon={IconWallet}
        title={PORTFOLIO_EMPTY.TITLE}
        description={PORTFOLIO_EMPTY.DESCRIPTION}
        primaryActionLabel={PORTFOLIO_EMPTY.PRIMARY_ACTION_LABEL}
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
