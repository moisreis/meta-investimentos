"use client"

import { IconChartPie } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { QuotaRow } from "@/presentation/types/quota-row.types"

import { QuotaDatatableFilters } from "../datatable/filters"
import { QuotaDatatableTable } from "../datatable/table"
import { QuotaDatatableToolbar } from "../datatable/toolbar"
import { QuotaConfirmImportDialog } from "../dialogs/confirm-import"
import { QuotaImportProgressDialog } from "../dialogs/import-progress"
import { EMPTY_QUOTA_FUND_LOOKUPS } from "../helpers/build-quota-fund-lookups.helper"
import { useQuotaDatatable } from "../hooks/use-quota-datatable.hook"
import { useQuotaDatatableFilters } from "../hooks/use-quota-datatable-filters.hook"
import { useQuotaKpis } from "../hooks/use-quota-kpis.hook"
import { useQuotaImport } from "../hooks/use-quota-import.hook"
import { useSharedCommandOpen } from "@/presentation/parts/hooks/use-shared-command-open.hook"
import { QUOTA_EMPTY } from "../settings/labels.settings"
import type { QuotaFundLookups } from "../types/quota-list.types"

export interface QuotaListProps {
  data: QuotaRow[] | null
  lookups?: QuotaFundLookups
}

/**
 * @summary
 * Renders the quota list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the import
 * button, the search filters, the empty state and the
 * read-only datatable. The confirm-import and progress
 * dialogs render at the page level above the table.
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
  const kpis = useQuotaKpis({ quotas: QUOTAS })
  const importFlow = useQuotaImport()

  // The shell reaches this flow without naming it: Ctrl+Q and
  // the palette row both land on `?command=import-quotas`, and
  // this page opens the confirm dialog when it sees the id.
  useSharedCommandOpen(
    "import-quotas",
    importFlow.handleOpenConfirm
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

      <QuotaDatatableToolbar
        onImport={importFlow.handleOpenConfirm}
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
          primaryActionLabel={QUOTA_EMPTY.PRIMARY_ACTION_LABEL}
          onPrimaryAction={importFlow.handleOpenConfirm}
        />
      )}

      <QuotaConfirmImportDialog
        open={importFlow.confirmOpen}
        onOpenChange={importFlow.handleConfirmOpenChange}
        window={importFlow.window}
        onWindowChange={importFlow.handleWindowChange}
        pending={importFlow.starting}
        error={importFlow.startError}
        onConfirm={importFlow.handleConfirm}
      />

      <QuotaImportProgressDialog
        open={importFlow.progressOpen}
        onOpenChange={importFlow.handleProgressOpenChange}
        job={importFlow.job}
        onDone={importFlow.handleClose}
      />
    </>
  )
}

export { QuotaList }
