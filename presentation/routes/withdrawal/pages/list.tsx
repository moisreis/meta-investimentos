"use client"

import { IconArrowDownCircle } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { WithdrawalRow } from "@/presentation/types/withdrawal-row.types"

import { WithdrawalDatatableFilters } from "../datatable/filters"
import { WithdrawalDatatableTable } from "../datatable/table"
import { WithdrawalDatatableToolbar } from "../datatable/toolbar"
import { WithdrawalAddDialog } from "../dialogs/add"
import { WithdrawalConfirmReverseDialog } from "../dialogs/confirm-reverse"
import { EMPTY_WITHDRAWAL_LOOKUPS } from "../helpers/build-withdrawal-lookups.helper"
import { useWithdrawalDatatable } from "../hooks/use-withdrawal-datatable.hook"
import { useWithdrawalDatatableFilters } from "../hooks/use-withdrawal-datatable-filters.hook"
import { useWithdrawalKpis } from "../hooks/use-withdrawal-kpis.hook"
import { WITHDRAWAL_EMPTY } from "../settings/labels.settings"
import type { WithdrawalLookups } from "../types/withdrawal-list.types"
import type { WithdrawalAddOptions } from "../types/withdrawal-add.types"
import { EMPTY_WITHDRAWAL_ADD_OPTIONS } from "../types/withdrawal-add.types"

export interface WithdrawalListProps {
  data: WithdrawalRow[] | null
  lookups?: WithdrawalLookups
  options?: WithdrawalAddOptions | null
}

/**
 * @summary
 * Renders the withdrawal list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the portfolio,
 * fund and period filters, the empty state and the
 * datatable with add flow. The add dialog renders at the
 * page level above the table.
 *
 * @param props - Props of the withdrawal list page.
 * @param props.data - The withdrawal rows, or `null`
 *                     while loading.
 * @param props.lookups - The withdrawal lookups.
 * @param props.options - The position options for the add form.
 *
 * @returns The withdrawal list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function WithdrawalList({
  data,
  lookups = EMPTY_WITHDRAWAL_LOOKUPS,
  options = null,
}: WithdrawalListProps) {
  const WITHDRAWALS = data ?? []
  const HAS_WITHDRAWALS = WITHDRAWALS.length > 0
  const OPTIONS = options ?? EMPTY_WITHDRAWAL_ADD_OPTIONS

  const filters = useWithdrawalDatatableFilters(
    WITHDRAWALS,
    lookups
  )
  const { table, rowActions, addDialog } =
    useWithdrawalDatatable(filters.filteredWithdrawals, lookups)
  const kpis = useWithdrawalKpis({ withdrawals: WITHDRAWALS })

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

      <WithdrawalDatatableToolbar
        onAddItem={addDialog.handleOpen}
        filters={
          <WithdrawalDatatableFilters
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

      {HAS_WITHDRAWALS ? (
        <WithdrawalDatatableTable table={table} />
      ) : (
        <EntityEmptyTable
          icon={IconArrowDownCircle}
          title={WITHDRAWAL_EMPTY.TITLE}
          description={WITHDRAWAL_EMPTY.DESCRIPTION}
          primaryActionLabel={
            WITHDRAWAL_EMPTY.PRIMARY_ACTION_LABEL
          }
          onPrimaryAction={addDialog.handleOpen}
        />
      )}

      <WithdrawalAddDialog
        dialog={addDialog}
        options={OPTIONS}
      />

      <WithdrawalConfirmReverseDialog
        dialog={rowActions}
        lookups={lookups}
      />
    </>
  )
}

export { WithdrawalList }
