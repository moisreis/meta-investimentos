"use client"

import { IconHistory } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"

import { BenchmarkHistoryDatatableFilters } from "../datatable/filters"
import { BenchmarkHistoryDatatableTable } from "../datatable/table"
import { BenchmarkHistoryDatatableToolbar } from "../datatable/toolbar"
import { BenchmarkHistoryAddDialog } from "../dialogs/add"
import { BenchmarkHistoryConfirmDeleteDialog } from "../dialogs/confirm-delete"
import { BenchmarkHistoryEditDialog } from "../dialogs/edit"
import { useBenchmarkHistoryDatatableFilters } from "../hooks/use-benchmark-history-datatable-filters.hook"
import { useBenchmarkHistoryDatatable } from "../hooks/use-benchmark-history-datatable.hook"
import { useBenchmarkHistoryKpis } from "../hooks/use-benchmark-history-kpis.hook"
import { BENCHMARK_HISTORY_EMPTY } from "../settings/labels.settings"
import type { BenchmarkHistoryListProps } from "../types/benchmark-history-list.types"

/**
 * @summary
 * Renders the benchmark history list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the search
 * filter, the empty state, the datatable and the three dialog
 * flows of the screen: record, correct and delete. The page
 * renders no markup of its own, so the blocks above the table
 * stay in the parts and the blocks below it stay in the route
 * components.
 *
 * @param props - Props of the benchmark history list page.
 * @param props.data - The benchmark history rows, or `null`
 *                     while loading.
 * @param props.benchmarks - Indices the record and the edit
 *                          dialogs offer.
 *
 * @returns The benchmark history list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BenchmarkHistoryList({
  data,
  benchmarks,
}: BenchmarkHistoryListProps) {
  const PENDING = data === null
  const HISTORY = data ?? []
  const HAS_HISTORY = HISTORY.length > 0

  const filters = useBenchmarkHistoryDatatableFilters(HISTORY)
  const { table, addDialog, editDialog, rowActions } =
    useBenchmarkHistoryDatatable(filters.filteredHistory)
  const kpis = useBenchmarkHistoryKpis(HISTORY)

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

      <BenchmarkHistoryDatatableToolbar
        table={table}
        onAddItem={addDialog.handleOpen}
        filters={
          <BenchmarkHistoryDatatableFilters
            query={filters.query}
            onQueryChange={filters.onQueryChange}
          />
        }
      />

      {PENDING || HAS_HISTORY ? (
        <BenchmarkHistoryDatatableTable
          pending={PENDING}
          table={table}
        />
      ) : (
        <EntityEmptyTable
          icon={IconHistory}
          title={BENCHMARK_HISTORY_EMPTY.TITLE}
          description={BENCHMARK_HISTORY_EMPTY.DESCRIPTION}
          primaryActionLabel={
            BENCHMARK_HISTORY_EMPTY.PRIMARY_ACTION_LABEL
          }
          onPrimaryAction={addDialog.handleOpen}
        />
      )}

      <BenchmarkHistoryAddDialog
        dialog={addDialog}
        benchmarks={benchmarks}
      />

      <BenchmarkHistoryEditDialog
        dialog={editDialog}
        benchmarks={benchmarks}
      />

      <BenchmarkHistoryConfirmDeleteDialog dialog={rowActions} />
    </>
  )
}

export { BenchmarkHistoryList }
