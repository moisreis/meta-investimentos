"use client"

import { IconChartDonut } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { PositionRow } from "@/presentation/types/position-row.types"

import { PositionDatatableFilters } from "../datatable/filters"
import { PositionDatatableTable } from "../datatable/table"
import { PositionDatatableToolbar } from "../datatable/toolbar"
import { PositionConfirmDeleteDialog } from "../dialogs/confirm-delete"
import { EMPTY_POSITION_LOOKUPS } from "../helpers/build-position-lookups.helper"
import { usePositionDatatable } from "../hooks/use-position-datatable.hook"
import { usePositionDatatableFilters } from "../hooks/use-position-datatable-filters.hook"
import { usePositionKpis } from "../hooks/use-position-kpis.hook"
import { POSITION_EMPTY } from "../settings/labels.settings"
import type { PositionLookups } from "../types/position-list.types"

export interface PositionListProps {
  data: PositionRow[] | null
  lookups?: PositionLookups
}

/**
 * @summary
 * Renders the position list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the portfolio,
 * fund and opening period filters, the empty state and
 * the selectable datatable with row delete action. The
 * confirm delete dialog renders at the page level above
 * the table.
 *
 * @param props - Props of the position list page.
 * @param props.data - The position rows, or `null` while
 *                     loading.
 * @param props.lookups - The position lookups.
 *
 * @returns The position list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function PositionList({
  data,
  lookups = EMPTY_POSITION_LOOKUPS,
}: PositionListProps) {
  // Normalize missing position data to an empty array.
  const POSITIONS = data ?? []

  // Determine whether there are any positions to display.
  const HAS_POSITIONS = POSITIONS.length > 0

  // Build the position filters using the available positions.
  const FILTERS = usePositionDatatableFilters(POSITIONS)

  // Build the datatable from the filtered positions and the
  // lookup data.
  const { table, rowActions } = usePositionDatatable(
    FILTERS.filteredPositions,
    lookups
  )

  // Calculate KPI values based on the complete set of positions.
  const KPIS = usePositionKpis({ positions: POSITIONS })

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

      <PositionDatatableToolbar
        filters={
          <PositionDatatableFilters
            portfolioId={FILTERS.portfolioId}
            fundId={FILTERS.fundId}
            dateRange={FILTERS.dateRange}
            portfolioOptions={lookups.portfolioOptions}
            fundOptions={lookups.fundOptions}
            onPortfolioChange={FILTERS.onPortfolioChange}
            onFundChange={FILTERS.onFundChange}
            onDateRangeChange={FILTERS.onDateRangeChange}
          />
        }
      />

      {HAS_POSITIONS ? (
        <PositionDatatableTable
          table={table}
          onBulkDelete={rowActions.handleConfirmDelete}
        />
      ) : (
        <EntityEmptyTable
          icon={IconChartDonut}
          title={POSITION_EMPTY.TITLE}
          description={POSITION_EMPTY.DESCRIPTION}
        />
      )}

      <PositionConfirmDeleteDialog
        dialog={rowActions}
        lookups={lookups}
      />
    </>
  )
}

export { PositionList }
