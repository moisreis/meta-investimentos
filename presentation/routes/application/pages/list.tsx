"use client"

import { IconCoin } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { ApplicationResponseDTO } from "@/services/application/dto/application-response.dto"

import { ApplicationDatatableFilters } from "../datatable/filters"
import { ApplicationDatatableTable } from "../datatable/table"
import { ApplicationDatatableToolbar } from "../datatable/toolbar"
import { EMPTY_APPLICATION_LOOKUPS } from "../helpers/build-application-lookups.helper"
import { useApplicationDatatable } from "../hooks/use-application-datatable.hook"
import { useApplicationDatatableFilters } from "../hooks/use-application-datatable-filters.hook"
import { useApplicationKpis } from "../hooks/use-application-kpis.hook"
import { APPLICATION_EMPTY } from "../settings/labels.settings"
import type { ApplicationLookups } from "../types/application-list.types"

interface ApplicationListProps {
  data: ApplicationResponseDTO[] | null
  lookups?: ApplicationLookups
}

/**
 * @summary
 * Renders the application list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the portfolio,
 * fund and period filters, the empty state and the
 * read-only datatable. No add flow is rendered here,
 * since applications are recorded inside the portfolio
 * screens.
 *
 * @param props - Props of the application list page.
 * @param props.data - The application rows, or `null`
 *                     while loading.
 * @param props.lookups - The application lookups.
 *
 * @returns The application list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function ApplicationList({
  data,
  lookups = EMPTY_APPLICATION_LOOKUPS,
}: ApplicationListProps) {
  const APPLICATIONS = data ?? []
  const HAS_APPLICATIONS = APPLICATIONS.length > 0

  const filters = useApplicationDatatableFilters(
    APPLICATIONS,
    lookups
  )
  const { table } = useApplicationDatatable(
    filters.filteredApplications,
    lookups
  )
  const kpis = useApplicationKpis({ applications: APPLICATIONS })

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

      <ApplicationDatatableToolbar
        filters={
          <ApplicationDatatableFilters
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

      {HAS_APPLICATIONS ? (
        <ApplicationDatatableTable table={table} />
      ) : (
        <EntityEmptyTable
          icon={IconCoin}
          title={APPLICATION_EMPTY.TITLE}
          description={APPLICATION_EMPTY.DESCRIPTION}
        />
      )}
    </>
  )
}

export { ApplicationList }
