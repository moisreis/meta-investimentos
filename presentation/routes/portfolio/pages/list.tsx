"use client"

import { IconWallet } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type { NormOptionRegistry } from "@/presentation/types/norms-portfolio.types"

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

export interface PortfolioListProps {
  data: PortfolioRow[] | null
  availableDates?: string[]
  summaries?: Record<string, PortfolioRowSummary> | null
  normRegistry: NormOptionRegistry | null
}

/**
 * @summary
 * Renders the portfolio list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the search
 * filter and the window filter, the empty state and the
 * datatable. The window filter is handed the performance
 * days of the session, so it can hide a day the
 * performance has no entry for instead of querying a
 * range nothing was calculated for. The norm registry
 * travels to the add and edit dialogs, which are the only
 * places that offer a norm or seed its stored bounds.
 *
 * @param props - Props of the portfolio list page.
 * @param props.data - The portfolio rows, or `null`
 *                     while loading.
 * @param props.availableDates - The days the performance
 *                               has an entry for.
 * @param props.summaries - The portfolio summaries the
 *                          KPIs and the row actions read.
 * @param props.normRegistry - The norms the forms offer and
 *                             the bounds stored per row.
 *
 * @returns The portfolio list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function PortfolioList({
  data,
  availableDates = [],
  summaries = null,
  normRegistry,
}: PortfolioListProps) {
  const PENDING = data === null
  const PORTFOLIOS = data ?? []
  const HAS_PORTFOLIOS = PORTFOLIOS.length > 0

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

      {PENDING || HAS_PORTFOLIOS ? (
        <PortfolioDatatableTable
          pending={PENDING}
          table={table}
          onBulkDelete={bulkDelete.handleBulkDelete}
        />
      ) : (
        <EntityEmptyTable
          icon={IconWallet}
          title={PORTFOLIO_EMPTY.TITLE}
          description={PORTFOLIO_EMPTY.DESCRIPTION}
          primaryActionLabel={
            PORTFOLIO_EMPTY.PRIMARY_ACTION_LABEL
          }
          onPrimaryAction={addDialog.handleOpen}
        />
      )}

      <PortfolioAddDialog
        dialog={addDialog}
        norms={normRegistry}
      />
      <PortfolioEditDialog
        dialog={editDialog}
        norms={normRegistry}
      />
      <PortfolioConfirmDeleteDialog dialog={rowActions} />
    </>
  )
}

export { PortfolioList }
