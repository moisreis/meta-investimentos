"use client"

import { IconChartDonut } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"

import { PositionDatatableFilters } from "../datatable/filters"
import { PositionDatatableTable } from "../datatable/table"
import { PositionDatatableToolbar } from "../datatable/toolbar"
import { EMPTY_POSITION_LOOKUPS } from "../helpers/build-position-lookups.helper"
import { usePositionDatatable } from "../hooks/use-position-datatable.hook"
import { usePositionDatatableFilters } from "../hooks/use-position-datatable-filters.hook"
import { usePositionKpis } from "../hooks/use-position-kpis.hook"
import { POSITION_EMPTY } from "../settings/labels.settings"
import type { PositionLookups } from "../types/position-list.types"

interface PositionListProps {
  data: PositionResponseDTO[] | null
  lookups?: PositionLookups
}

/**
 * @summary
 * Renders the position list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the portfolio,
 * fund and opening period filters, the empty state and
 * the read-only datatable. No add flow is rendered here,
 * since positions are created inside the portfolio
 * screens.
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
 * @date 2026-09-25
 */
function PositionList({
  data,
  lookups = EMPTY_POSITION_LOOKUPS,
}: PositionListProps) {
  const POSITIONS = data ?? []
  const HAS_POSITIONS = POSITIONS.length > 0

  const filters = usePositionDatatableFilters(POSITIONS)
  const { table } = usePositionDatatable(
    filters.filteredPositions,
    lookups
  )
  const kpis = usePositionKpis({ positions: POSITIONS })

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

      <PositionDatatableToolbar
        filters={
          <PositionDatatableFilters
            portfolioId={filters.portfolioId}
            fundId={filters.fundId}
            dateRange={filters.dateRange}
            portfolioOptions={lookups.portfolioOptions}
            fundOptions={lookups.fundOptions}
            onPortfolioChange={filters.onPortfolioChange}
            onFundChange={filters.onFundChange}
            onDateRangeChange={filters.onDateRangeChange}
          />
        }
      />

      {HAS_POSITIONS ? (
        <PositionDatatableTable table={table} />
      ) : (
        <EntityEmptyTable
          icon={IconChartDonut}
          title={POSITION_EMPTY.TITLE}
          description={POSITION_EMPTY.DESCRIPTION}
        />
      )}
    </>
  )
}

export { PositionList }
