"use client"

import { IconCoin } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"

import { PositionPerformanceDatatableFilters } from "../datatable/filters"
import { PositionPerformanceDatatableTable } from "../datatable/table"
import { PositionPerformanceDatatableToolbar } from "../datatable/toolbar"
import { PositionPerformanceCalculateConfirmDialog } from "../dialogs/position-performance-calculate-confirm"
import { PositionPerformanceCalculateProgressDialog } from "../dialogs/position-performance-calculate-progress"
import { EMPTY_POSITION_PERFORMANCE_LOOKUPS } from "../helpers/build-position-performance-lookups.helper"
import { usePositionPerformanceCalculation } from "../hooks/use-position-performance-calculation.hook"
import { usePositionPerformanceDatatable } from "../hooks/use-position-performance-datatable.hook"
import { usePositionPerformanceDatatableFilters } from "../hooks/use-position-performance-datatable-filters.hook"
import { usePositionPerformanceKpis } from "../hooks/use-position-performance-kpis.hook"
import { POSITION_PERFORMANCE_EMPTY } from "../settings/labels.settings"
import type { PositionPerformanceLookups } from "../types/position-performance-list.types"

interface PositionPerformanceListProps {
  data: PositionPerformanceResponseDTO[] | null
  lookups?: PositionPerformanceLookups
}

/**
 * @summary
 * Renders the position performance list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the calculate
 * button, the position and period filters, the empty
 * state and the read-only datatable. The calculate-confirm
 * and calculate-progress dialogs render at the page level
 * above the table.
 *
 * @param props - Props of the performance list page.
 * @param props.data - The performance rows, or `null`
 *                     while loading.
 * @param props.lookups - The position performance lookups.
 *
 * @returns The position performance list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PositionPerformanceList({
  data,
  lookups = EMPTY_POSITION_PERFORMANCE_LOOKUPS,
}: PositionPerformanceListProps) {
  const PERFORMANCES = data ?? []
  const HAS_PERFORMANCES = PERFORMANCES.length > 0

  const filters =
    usePositionPerformanceDatatableFilters(PERFORMANCES)
  const { table } = usePositionPerformanceDatatable(
    filters.filteredPerformances,
    lookups
  )
  const kpis = usePositionPerformanceKpis({
    performances: PERFORMANCES,
  })
  const calculation = usePositionPerformanceCalculation()

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

      <PositionPerformanceDatatableToolbar
        onCalculate={calculation.handleOpenConfirm}
        filters={
          <PositionPerformanceDatatableFilters
            positionId={filters.positionId}
            dateRange={filters.dateRange}
            positionOptions={lookups.positionOptions}
            onPositionChange={filters.onPositionChange}
            onDateRangeChange={filters.onDateRangeChange}
          />
        }
      />

      {HAS_PERFORMANCES ? (
        <PositionPerformanceDatatableTable table={table} />
      ) : (
        <EntityEmptyTable
          icon={IconCoin}
          title={POSITION_PERFORMANCE_EMPTY.TITLE}
          description={POSITION_PERFORMANCE_EMPTY.DESCRIPTION}
          primaryActionLabel={
            POSITION_PERFORMANCE_EMPTY.PRIMARY_ACTION_LABEL
          }
          onPrimaryAction={calculation.handleOpenConfirm}
        />
      )}

      <PositionPerformanceCalculateConfirmDialog
        open={calculation.confirmOpen}
        onOpenChange={calculation.handleConfirmOpenChange}
        positionOptions={lookups.calculationOptions}
        positionId={calculation.positionId}
        onPositionChange={calculation.handlePositionChange}
        dateRange={calculation.dateRange}
        onDateRangeChange={calculation.handleDateRangeChange}
        pending={calculation.starting}
        error={calculation.startError}
        onConfirm={calculation.handleConfirm}
      />

      <PositionPerformanceCalculateProgressDialog
        open={calculation.progressOpen}
        onOpenChange={calculation.handleProgressOpenChange}
        job={calculation.job}
        onDone={calculation.handleClose}
      />
    </>
  )
}

export { PositionPerformanceList }
