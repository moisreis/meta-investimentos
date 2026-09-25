"use client"

import { IconCreditCard } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

import { CheckingAccountDatatableFilters } from "../datatable/filters"
import { CheckingAccountDatatableTable } from "../datatable/table"
import { CheckingAccountDatatableToolbar } from "../datatable/toolbar"
import { CheckingAccountAddDialog } from "../dialogs/add"
import { CheckingAccountConfirmDeleteDialog } from "../dialogs/confirm-delete"
import { CheckingAccountEditDialog } from "../dialogs/edit"
import { EMPTY_CHECKING_ACCOUNT_NAME_LOOKUPS } from "../helpers/build-checking-account-name-lookups.helper"
import { useCheckingAccountDatatableFilters } from "../hooks/use-checking-account-datatable-filters.hook"
import { useCheckingAccountDatatable } from "../hooks/use-checking-account-datatable.hook"
import { useCheckingAccountKpis } from "../hooks/use-checking-account-kpis.hook"
import { CHECKING_ACCOUNT_EMPTY } from "../settings/labels.settings"
import type {
  CheckingAccountNameLookups,
  CheckingAccountSelectOptions,
} from "../types/checking-account-list.types"

// Empty options used while the loader resolves.
const EMPTY_OPTIONS: CheckingAccountSelectOptions = {
  bankAccounts: [],
  banks: [],
}

interface CheckingAccountListProps {
  data: CheckingAccountResponseDTO[] | null
  options?: CheckingAccountSelectOptions | null
  names?: CheckingAccountNameLookups
}

/**
 * @summary
 * Renders the checking account list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar, the search
 * filters, the empty state and the datatable. The add,
 * edit, bulk delete and row-actions dialog flows are
 * rendered at the page level above the table.
 *
 * @param props - Props of the checking account list
 *                page.
 * @param props.data - The balance rows, or `null` while
 *                     loading.
 * @param props.options - The registry options.
 * @param props.names - The bank account name lookups.
 *
 * @returns The checked account list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function CheckingAccountList({
  data,
  options = null,
  names = EMPTY_CHECKING_ACCOUNT_NAME_LOOKUPS,
}: CheckingAccountListProps) {
  const ENTRIES = data ?? []
  const HAS_ENTRIES = ENTRIES.length > 0
  const OPTIONS = options ?? EMPTY_OPTIONS

  const filters = useCheckingAccountDatatableFilters(
    ENTRIES,
    names
  )
  const {
    table,
    rowActions,
    bulkDelete,
    addDialog,
    editDialog,
  } = useCheckingAccountDatatable(filters.filteredEntries, names)
  const kpis = useCheckingAccountKpis({ entries: ENTRIES })

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

      <CheckingAccountDatatableToolbar
        table={table}
        onAddItem={addDialog.handleOpen}
        filters={
          <CheckingAccountDatatableFilters
            query={filters.query}
            onQueryChange={filters.onQueryChange}
          />
        }
      />

      {HAS_ENTRIES ? (
        <CheckingAccountDatatableTable
          table={table}
          onBulkDelete={bulkDelete.handleBulkDelete}
        />
      ) : (
        <EntityEmptyTable
          icon={IconCreditCard}
          title={CHECKING_ACCOUNT_EMPTY.TITLE}
          description={CHECKING_ACCOUNT_EMPTY.DESCRIPTION}
          primaryActionLabel={
            CHECKING_ACCOUNT_EMPTY.PRIMARY_ACTION_LABEL
          }
          onPrimaryAction={addDialog.handleOpen}
        />
      )}

      <CheckingAccountAddDialog
        dialog={addDialog}
        options={OPTIONS}
      />
      <CheckingAccountEditDialog
        dialog={editDialog}
        names={names}
      />
      <CheckingAccountConfirmDeleteDialog
        dialog={rowActions}
        names={names}
      />
    </>
  )
}

export { CheckingAccountList }
