"use client"

import { IconChartLine } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

import { PortfolioPerformanceDatatableFilters } from "../datatable/filters"
import { PortfolioPerformanceDatatableTable } from "../datatable/table"
import { PortfolioPerformanceDatatableToolbar } from "../datatable/toolbar"
import { PortfolioPerformanceCalculateConfirmDialog } from "../dialogs/portfolio-performance-calculate-confirm"
import { PortfolioPerformanceCalculateProgressDialog } from "../dialogs/portfolio-performance-calculate-progress"
import { EMPTY_PORTFOLIO_PERFORMANCE_LOOKUPS } from "../helpers/build-portfolio-performance-lookups.helper"
import { usePortfolioPerformanceCalculation } from "../hooks/use-portfolio-performance-calculation.hook"
import { usePortfolioPerformanceDatatable } from "../hooks/use-portfolio-performance-datatable.hook"
import { usePortfolioPerformanceDatatableFilters } from "../hooks/use-portfolio-performance-datatable-filters.hook"
import { usePortfolioPerformanceKpis } from "../hooks/use-portfolio-performance-kpis.hook"
import { PORTFOLIO_PERFORMANCE_EMPTY } from "../settings/labels.settings"
import type { PortfolioPerformanceLookups } from "../types/portfolio-performance-list.types"

interface PortfolioPerformanceListProps {
  data: PortfolioPerformanceResponseDTO[] | null
  portfolios?: PortfolioResponseDTO[]
  lookups?: PortfolioPerformanceLookups
}

/**
 * @summary
 * Renders the portfolio performance list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the calculate
 * button, the portfolio and period filters, the empty
 * state and the read-only datatable. The calculate-confirm
 * and calculate-progress dialogs render at the page level
 * above the table.
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
 * @date 2026-09-25
 */
function PortfolioPerformanceList({
  data,
  portfolios = [],
  lookups = EMPTY_PORTFOLIO_PERFORMANCE_LOOKUPS,
}: PortfolioPerformanceListProps) {
  const PERFORMANCES = data ?? []
  const HAS_PERFORMANCES = PERFORMANCES.length > 0

  const filters =
    usePortfolioPerformanceDatatableFilters(PERFORMANCES)
  const { table } = usePortfolioPerformanceDatatable(
    filters.filteredPerformances,
    lookups
  )
  const kpis = usePortfolioPerformanceKpis({
    performances: PERFORMANCES,
  })
  const calculation = usePortfolioPerformanceCalculation()

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

      {HAS_PERFORMANCES ? (
        <PortfolioPerformanceDatatableTable table={table} />
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
    </>
  )
}

export { PortfolioPerformanceList }
