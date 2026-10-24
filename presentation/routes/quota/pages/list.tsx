"use client"

import { IconChartPie } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { QuotaRow } from "@/presentation/types/quota-row.types"

import { QuotaDatatableFilters } from "../datatable/filters"
import { QuotaDatatableTable } from "../datatable/table"
import { QuotaDatatableToolbar } from "../datatable/toolbar"
import type { QuotaFundLookups } from "../types/quota-list.types"
import { EMPTY_QUOTA_FUND_LOOKUPS } from "../helpers/build-quota-fund-lookups.helper"
import { useQuotaDatatable } from "../hooks/use-quota-datatable.hook"
import { useQuotaDatatableFilters } from "../hooks/use-quota-datatable-filters.hook"
import { useQuotaKpis } from "../hooks/use-quota-kpis.hook"
import { useSharedCommandOpen } from "@/presentation/parts/hooks/use-shared-command-open.hook"
import { QUOTA_EMPTY } from "../settings/labels.settings"
export interface QuotaListProps {
  data: QuotaRow[] | null
  lookups?: QuotaFundLookups
}

/**
 * @summary
 * Renders the quota list page.
 *
 * @remarks
 * Composes KPI group, toolbar, filters, empty and read-only table.
 *
 * @param props - Props of the quota list page.
 * @param props.data - The quota rows, or `null` while
 *                     loading.
 * @param props.lookups - The quota fund lookups.
 *
 * @returns The quota list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function QuotaList({
  data,
  lookups = EMPTY_QUOTA_FUND_LOOKUPS,
}: QuotaListProps) {
  const PENDING = data === null
  const QUOTAS = data ?? []
  const HAS_QUOTAS = QUOTAS.length > 0

  const filters = useQuotaDatatableFilters(QUOTAS, lookups)

  const { table } = useQuotaDatatable(
    filters.filteredQuotas,
    lookups
  )
  const KPIS = useQuotaKpis({ quotas: QUOTAS })

  useSharedCommandOpen("import-quotas", () => {})

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

      <QuotaDatatableToolbar
        filters={
          <QuotaDatatableFilters
            fundId={filters.fundId}
            onFundChange={filters.onFundChange}
            fundOptions={lookups.fundOptions}
            dateRange={filters.dateRange}
            onDateRangeChange={filters.onDateRangeChange}
          />
        }
      />

      {PENDING || HAS_QUOTAS ? (
        <QuotaDatatableTable table={table} pending={PENDING} />
      ) : (
        <EntityEmptyTable
          icon={IconChartPie}
          title={QUOTA_EMPTY.TITLE}
          description={QUOTA_EMPTY.DESCRIPTION}
        />
      )}
    </>
  )
}

export { QuotaList }
