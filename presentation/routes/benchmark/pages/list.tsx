"use client"

import { IconChartBar } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

import { BenchmarkDatatableFilters } from "../datatable/filters"
import { BenchmarkDatatableTable } from "../datatable/table"
import { BenchmarkDatatableToolbar } from "../datatable/toolbar"
import { BenchmarkAddDialog } from "../dialogs/add"
import { BenchmarkEditDialog } from "../dialogs/edit"
import { useBenchmarkDatatableFilters } from "../hooks/use-benchmark-datatable-filters.hook"
import { useBenchmarkDatatable } from "../hooks/use-benchmark-datatable.hook"
import { useBenchmarkKpis } from "../hooks/use-benchmark-kpis.hook"
import { BENCHMARK_EMPTY } from "../settings/labels.settings"

export interface BenchmarkListProps {
  data: BenchmarkRow[] | null
}

/**
 * @summary
 * Renders the benchmark list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the search
 * filter, the empty state and the datatable. The page
 * renders no markup of its own, so the blocks above the
 * table stay in the parts and the blocks below it stay
 * in the route components.
 *
 * @param props - Props of the benchmark list page.
 * @param props.data - The benchmark rows, or `null` while
 *                     loading.
 *
 * @returns The benchmark list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BenchmarkList({ data }: BenchmarkListProps) {
  const PENDING = data === null
  const BENCHMARKS = data ?? []
  const HAS_BENCHMARKS = BENCHMARKS.length > 0

  const filters = useBenchmarkDatatableFilters(BENCHMARKS)
  const { table, addDialog, editDialog } = useBenchmarkDatatable(
    filters.filteredBenchmarks
  )
  const kpis = useBenchmarkKpis(BENCHMARKS)

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

      <BenchmarkDatatableToolbar
        table={table}
        onAddItem={addDialog.handleOpen}
        filters={
          <BenchmarkDatatableFilters
            query={filters.query}
            onQueryChange={filters.onQueryChange}
          />
        }
      />

      {PENDING || HAS_BENCHMARKS ? (
        <BenchmarkDatatableTable
          pending={PENDING}
          table={table}
        />
      ) : (
        <EntityEmptyTable
          icon={IconChartBar}
          title={BENCHMARK_EMPTY.TITLE}
          description={BENCHMARK_EMPTY.DESCRIPTION}
          primaryActionLabel={
            BENCHMARK_EMPTY.PRIMARY_ACTION_LABEL
          }
          onPrimaryAction={addDialog.handleOpen}
        />
      )}

      <BenchmarkAddDialog dialog={addDialog} />
      <BenchmarkEditDialog dialog={editDialog} />
    </>
  )
}

export { BenchmarkList }
