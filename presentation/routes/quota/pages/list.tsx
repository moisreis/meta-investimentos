"use client"

import { IconChartPie } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { QuotaResponseDTO } from "@/services/quota/dto/quota-response.dto"

import { QuotaDatatableFilters } from "../datatable/filters"
import { QuotaDatatableTable } from "../datatable/table"
import { QuotaDatatableToolbar } from "../datatable/toolbar"
import { QuotaConfirmImportDialog } from "../dialogs/quota-confirm-import"
import { QuotaImportProgressDialog } from "../dialogs/quota-import-progress"
import { EMPTY_QUOTA_FUND_LOOKUPS } from "../helpers/build-quota-fund-lookups.helper"
import { useQuotaDatatable } from "../hooks/use-quota-datatable.hook"
import { useQuotaDatatableFilters } from "../hooks/use-quota-datatable-filters.hook"
import { useQuotaKpis } from "../hooks/use-quota-kpis.hook"
import { useQuotaImport } from "../hooks/use-quota-import.hook"
import { QUOTA_EMPTY } from "../settings/labels.settings"
import type { QuotaFundLookups } from "../types/quota-list.types"

interface QuotaListProps {
  data: QuotaResponseDTO[] | null
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
  const QUOTAS = data ?? []
  const HAS_QUOTAS = QUOTAS.length > 0

  const filters = useQuotaDatatableFilters(QUOTAS, lookups)
  const { table } = useQuotaDatatable(
    filters.filteredQuotas,
    lookups
  )
  const kpis = useQuotaKpis({ quotas: QUOTAS })
  const importFlow = useQuotaImport()

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
            query={filters.query}
            onQueryChange={filters.onQueryChange}
          />
        }
      />

      {HAS_QUOTAS ? (
        <QuotaDatatableTable table={table} />
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
