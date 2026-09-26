"use client"

import { IconPigMoney } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"

import { BankAccountDatatableFilters } from "../datatable/filters"
import { BankAccountDatatableTable } from "../datatable/table"
import { BankAccountDatatableToolbar } from "../datatable/toolbar"
import { BankAccountAddDialog } from "../dialogs/add"
import { BankAccountConfirmDeleteDialog } from "../dialogs/confirm-delete"
import { BankAccountEditDialog } from "../dialogs/edit"
import { EMPTY_BANK_ACCOUNT_NAME_LOOKUPS } from "../helpers/build-bank-account-name-lookups.helper"
import { useBankAccountDatatable } from "../hooks/use-bank-account-datatable.hook"
import { useBankAccountDatatableFilters } from "../hooks/use-bank-account-datatable-filters.hook"
import { useBankAccountKpis } from "../hooks/use-bank-account-kpis.hook"
import { BANK_ACCOUNT_EMPTY } from "../settings/labels.settings"
import type {
  BankAccountNameLookups,
  BankAccountRowSummary,
  BankAccountSelectOptions,
} from "../types/bank-account-list.types"

// Empty options used while the loader resolves.
const EMPTY_OPTIONS: BankAccountSelectOptions = {
  portfolios: [],
  banks: [],
}

interface BankAccountListProps {
  data: BankAccountResponseDTO[] | null
  options?: BankAccountSelectOptions | null
  names?: BankAccountNameLookups
  summaries?: Record<string, BankAccountRowSummary> | null
}

/**
 * @summary
 * Renders the bank account list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar, the search
 * filters, the empty state and the datatable. The add,
 * edit, bulk delete and row-actions dialog flows are
 * rendered at the page level above the table.
 *
 * @param props - Props of the bank account list page.
 * @param props.data - The bank account rows, or `null`
 *                     while loading.
 * @param props.options - The registry options.
 * @param props.names - The bank account name lookups.
 * @param props.summaries - The derived per-row entry
 *                          counts.
 *
 * @returns The bank account list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankAccountList({
  data,
  options = null,
  names = EMPTY_BANK_ACCOUNT_NAME_LOOKUPS,
  summaries = null,
}: BankAccountListProps) {
  const ACCOUNTS = data ?? []
  const HAS_ACCOUNTS = ACCOUNTS.length > 0
  const OPTIONS = options ?? EMPTY_OPTIONS

  const filters = useBankAccountDatatableFilters(ACCOUNTS, names)
  const {
    table,
    rowActions,
    bulkDelete,
    addDialog,
    editDialog,
  } = useBankAccountDatatable(
    filters.filteredAccounts,
    names,
    summaries
  )
  const kpis = useBankAccountKpis({
    bankAccounts: ACCOUNTS,
    summaries,
  })

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

      <BankAccountDatatableToolbar
        table={table}
        onAddItem={addDialog.handleOpen}
        filters={
          <BankAccountDatatableFilters
            query={filters.query}
            onQueryChange={filters.onQueryChange}
          />
        }
      />

      {HAS_ACCOUNTS ? (
        <BankAccountDatatableTable
          table={table}
          onBulkDelete={bulkDelete.handleBulkDelete}
        />
      ) : (
        <EntityEmptyTable
          icon={IconPigMoney}
          title={BANK_ACCOUNT_EMPTY.TITLE}
          description={BANK_ACCOUNT_EMPTY.DESCRIPTION}
          primaryActionLabel={
            BANK_ACCOUNT_EMPTY.PRIMARY_ACTION_LABEL
          }
          onPrimaryAction={addDialog.handleOpen}
        />
      )}

      <BankAccountAddDialog
        dialog={addDialog}
        options={OPTIONS}
      />
      <BankAccountEditDialog dialog={editDialog} names={names} />
      <BankAccountConfirmDeleteDialog
        dialog={rowActions}
        names={names}
      />
    </>
  )
}

export { BankAccountList }
