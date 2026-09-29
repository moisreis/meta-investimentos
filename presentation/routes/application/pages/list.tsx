"use client"

import { IconCoin } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { ApplicationRow } from "@/presentation/types/application-row.types"

import { ApplicationDatatableFilters } from "../datatable/filters"
import { ApplicationDatatableTable } from "../datatable/table"
import { ApplicationDatatableToolbar } from "../datatable/toolbar"
import { ApplicationAddDialog } from "../dialogs/add"
import { ApplicationConfirmReverseDialog } from "../dialogs/confirm-reverse"
import { EMPTY_APPLICATION_LOOKUPS } from "../helpers/build-application-lookups.helper"
import { useApplicationDatatable } from "../hooks/use-application-datatable.hook"
import { useApplicationDatatableFilters } from "../hooks/use-application-datatable-filters.hook"
import { useApplicationKpis } from "../hooks/use-application-kpis.hook"
import { APPLICATION_EMPTY } from "../settings/labels.settings"
import type { ApplicationLookups } from "../types/application-list.types"
import type { ApplicationAddOptions } from "../types/application-add.types"
import { EMPTY_APPLICATION_ADD_OPTIONS } from "../types/application-add.types"

export interface ApplicationListProps {
  data: ApplicationRow[] | null
  lookups?: ApplicationLookups
  options?: ApplicationAddOptions | null
}

/**
 * @summary
 * Renders the application list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the portfolio,
 * fund and period filters, the empty state and the
 * datatable with add flow. The add dialog renders at the
 * page level above the table.
 *
 * @param props - Props of the application list page.
 * @param props.data - The application rows, or `null`
 *                     while loading.
 * @param props.lookups - The application lookups.
 * @param props.options - The fund options for the add form.
 *
 * @returns The application list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function ApplicationList({
  data,
  lookups = EMPTY_APPLICATION_LOOKUPS,
  options = null,
}: ApplicationListProps) {
  const APPLICATIONS = data ?? []
  const HAS_APPLICATIONS = APPLICATIONS.length > 0
  const OPTIONS = options ?? EMPTY_APPLICATION_ADD_OPTIONS

  const filters = useApplicationDatatableFilters(
    APPLICATIONS,
    lookups
  )
  const { table, rowActions, addDialog } = useApplicationDatatable(
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
        onAddItem={addDialog.handleOpen}
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
          primaryActionLabel={APPLICATION_EMPTY.PRIMARY_ACTION_LABEL}
          onPrimaryAction={addDialog.handleOpen}
        />
      )}

      <ApplicationAddDialog
        dialog={addDialog}
        defaultPortfolioId={filters.portfolioId ?? undefined}
        options={OPTIONS}
      />

      <ApplicationConfirmReverseDialog
        dialog={rowActions}
        lookups={lookups}
      />
    </>
  )
}

export { ApplicationList }