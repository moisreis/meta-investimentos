"use client"

import { IconChartLine } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type { PortfolioPerformanceRow } from "@/presentation/types/portfolio-performance-row.types"

import { PortfolioPerformanceDatatableFilters } from "../datatable/filters"
import { PortfolioPerformanceDatatableTable } from "../datatable/table"
import { PortfolioPerformanceDatatableToolbar } from "../datatable/toolbar"
import { PortfolioPerformanceConfirmDeleteDialog } from "../dialogs/confirm-delete"
import type { PortfolioPerformanceLookups } from "../types/portfolio-performance-list.types"
import { EMPTY_PORTFOLIO_PERFORMANCE_LOOKUPS } from "../helpers/build-portfolio-performance-lookups.helper"
import { usePortfolioPerformanceDatatable } from "../hooks/use-portfolio-performance-datatable.hook"
import { usePortfolioPerformanceDatatableFilters } from "../hooks/use-portfolio-performance-datatable-filters.hook"
import { usePortfolioPerformanceKpis } from "../hooks/use-portfolio-performance-kpis.hook"
import { useSharedCommandOpen } from "@/presentation/parts/hooks/use-shared-command-open.hook"
import { PORTFOLIO_PERFORMANCE_EMPTY } from "../settings/labels.settings"
export interface PortfolioPerformanceListProps {
  data: PortfolioPerformanceRow[] | null
  portfolios?: PortfolioRow[]
  lookups?: PortfolioPerformanceLookups
}

/**
 * @summary
 * Renders the portfolio performance list page.
 *
 * @remarks
 * Composes KPI group, toolbar, portfolio/period filters, empty and datatable.
 *
 * @param props - Props of the performance list page.
 * @param props.data - The performance rows, or `null`
 *                     while loading.
 * @param props.portfolios - The user portfolios offered
 *                           by the calculate dialog.
 * @param props.lookups - The performance lookups.
 *
 * @returns The performance list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function PortfolioPerformanceList({
  data,
  portfolios,
  lookups = EMPTY_PORTFOLIO_PERFORMANCE_LOOKUPS,
}: PortfolioPerformanceListProps) {
  void portfolios
  const PENDING = data === null
  const PERFORMANCES = data ?? []
  const HAS_PERFORMANCES = PERFORMANCES.length > 0

  const filters =
    usePortfolioPerformanceDatatableFilters(PERFORMANCES)
  const { table, rowActions, bulkDelete } =
    usePortfolioPerformanceDatatable(
      filters.filteredPerformances,
      lookups
    )
  const KPIS = usePortfolioPerformanceKpis({
    performances: PERFORMANCES,
  })

  useSharedCommandOpen("calculate-performance", () => {})

  return (
    <>
      <EntityDatatableKpiGroup>
        {KPIS.map((kpi) => (
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

      <PortfolioPerformanceDatatableToolbar
        filters={
          <PortfolioPerformanceDatatableFilters
            portfolioId={filters.portfolioId}
            dateRange={filters.dateRange}
            portfolioOptions={lookups.portfolioOptions}
            onPortfolioChange={filters.onPortfolioChange}
            onDateRangeChange={filters.onDateRangeChange}
          />
        }
      />

      {PENDING || HAS_PERFORMANCES ? (
        <PortfolioPerformanceDatatableTable
          pending={PENDING}
          table={table}
          onBulkDelete={bulkDelete.handleBulkDelete}
        />
      ) : (
        <EntityEmptyTable
          icon={IconChartLine}
          title={PORTFOLIO_PERFORMANCE_EMPTY.TITLE}
          description={PORTFOLIO_PERFORMANCE_EMPTY.DESCRIPTION}
        />
      )}

      <PortfolioPerformanceConfirmDeleteDialog
        dialog={rowActions}
        lookups={lookups}
      />
    </>
  )
}

export { PortfolioPerformanceList }
