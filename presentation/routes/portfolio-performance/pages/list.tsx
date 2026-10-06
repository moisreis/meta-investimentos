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
import { PortfolioPerformanceCalculateConfirmDialog } from "../dialogs/calculate-confirm"
import { PortfolioPerformanceCalculateProgressDialog } from "../dialogs/calculate-progress"
import { PortfolioPerformanceConfirmDeleteDialog } from "../dialogs/confirm-delete"
import { EMPTY_PORTFOLIO_PERFORMANCE_LOOKUPS } from "../helpers/build-portfolio-performance-lookups.helper"
import { usePortfolioPerformanceCalculation } from "../hooks/use-portfolio-performance-calculation.hook"
import { usePortfolioPerformanceDatatable } from "../hooks/use-portfolio-performance-datatable.hook"
import { usePortfolioPerformanceDatatableFilters } from "../hooks/use-portfolio-performance-datatable-filters.hook"
import { usePortfolioPerformanceKpis } from "../hooks/use-portfolio-performance-kpis.hook"
import { useSharedCommandOpen } from "@/presentation/parts/hooks/use-shared-command-open.hook"
import { PORTFOLIO_PERFORMANCE_EMPTY } from "../settings/labels.settings"
import type { PortfolioPerformanceLookups } from "../types/portfolio-performance-list.types"

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
 * Composes the KPI group, the toolbar with the calculate
 * button, the portfolio and period filters, the empty
 * state and the selectable datatable with row delete action.
 * The calculate-confirm, calculate-progress and confirm delete
 * dialogs render at the page level above the table.
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
  portfolios = [],
  lookups = EMPTY_PORTFOLIO_PERFORMANCE_LOOKUPS,
}: PortfolioPerformanceListProps) {
  const PENDING = data === null
  const PERFORMANCES = data ?? []
  const HAS_PERFORMANCES = PERFORMANCES.length > 0

  const filters =
    usePortfolioPerformanceDatatableFilters(PERFORMANCES)
  const { table, rowActions } = usePortfolioPerformanceDatatable(
    filters.filteredPerformances,
    lookups
  )
  const kpis = usePortfolioPerformanceKpis({
    performances: PERFORMANCES,
  })
  const calculation = usePortfolioPerformanceCalculation()

  // The shell reaches this flow without naming it: Ctrl+P and
  // the palette row both land on the same command id, and
  // this page opens the confirm dialog when it sees it.
  useSharedCommandOpen(
    "calculate-performance",
    calculation.handleOpenConfirm
  )

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

      <PortfolioPerformanceDatatableToolbar
        onCalculate={calculation.handleOpenConfirm}
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
          onBulkDelete={rowActions.handleConfirmDelete}
        />
      ) : (
        <EntityEmptyTable
          icon={IconChartLine}
          title={PORTFOLIO_PERFORMANCE_EMPTY.TITLE}
          description={PORTFOLIO_PERFORMANCE_EMPTY.DESCRIPTION}
          primaryActionLabel={
            PORTFOLIO_PERFORMANCE_EMPTY.PRIMARY_ACTION_LABEL
          }
          onPrimaryAction={calculation.handleOpenConfirm}
        />
      )}

      <PortfolioPerformanceCalculateConfirmDialog
        open={calculation.confirmOpen}
        onOpenChange={calculation.handleConfirmOpenChange}
        portfolios={portfolios}
        portfolioId={calculation.portfolioId}
        onPortfolioChange={calculation.handlePortfolioChange}
        dateRange={calculation.dateRange}
        onDateRangeChange={calculation.handleDateRangeChange}
        pending={calculation.starting}
        error={calculation.startError}
        onConfirm={calculation.handleConfirm}
      />

      <PortfolioPerformanceCalculateProgressDialog
        open={calculation.progressOpen}
        onOpenChange={calculation.handleProgressOpenChange}
        job={calculation.job}
        onDone={calculation.handleClose}
      />

      <PortfolioPerformanceConfirmDeleteDialog
        dialog={rowActions}
        lookups={lookups}
      />
    </>
  )
}

export { PortfolioPerformanceList }
