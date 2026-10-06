"use client"

import type { ColumnHelper } from "@tanstack/react-table"

import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityColumnDef } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import { FormatEntityLookup } from "@/presentation/presenters/lookup.presenter"
import { FormatSignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"

import { BENCHMARK_HISTORY_DATATABLE } from "@/presentation/routes/benchmark-history/settings/labels.settings"

/**
 * Row action callbacks of the benchmark history datatable.
 */
export interface BenchmarkHistoryTableColumnOptions {
  // Opens the edit dialog on the chosen entry.
  onEdit: (entry: BenchmarkHistoryRow) => void
  // Opens the delete confirmation on the chosen entry.
  onDelete: (entry: BenchmarkHistoryRow) => void
}

/**
 * @summary
 * Builds the column definitions of the benchmark history
 * datatable.
 *
 * @remarks
 * Pins the date column to the start with descending sort so
 * the newest rate appears first, and the actions column to the
 * end. The benchmark column resolves its display through the
 * lookup, and the rate column uses the signed percentage
 * presenter.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row action callbacks.
 *
 * @returns The benchmark history column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export function CreateBenchmarkHistoryTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    BenchmarkHistoryRow
  >,
  options: BenchmarkHistoryTableColumnOptions
): EntityColumnDef<BenchmarkHistoryRow>[] {
  return [
    columnHelper.accessor("date", {
      header: BENCHMARK_HISTORY_DATATABLE.COLUMN_DATE,
      enableHiding: false,
      size: 130,
      minSize: 130,
      maxSize: 130,
      meta: { pinned: "start" },
      cell: (info) => FormatDate(info.getValue()),
    }),

    columnHelper.accessor(
      (row) => `${row.benchmarkName} (${row.benchmarkAcronym})`,
      {
        id: "benchmark",
        header: BENCHMARK_HISTORY_DATATABLE.COLUMN_BENCHMARK,
        size: 220,
        meta: { fluid: true },
        cell: (info) => FormatEntityLookup(info.getValue()),
      }
    ),

    columnHelper.accessor("rate", {
      header: BENCHMARK_HISTORY_DATATABLE.COLUMN_RATE,
      size: 130,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatSignedPercentage(info.getValue()),
    }),

    columnHelper.display({
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      size: 50,
      minSize: 50,
      maxSize: 50,
      meta: { pinned: "end", align: "center" },
      cell: ({ row }) => (
        <EntityTableRowMenuDropdown
          label={BENCHMARK_HISTORY_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "edit",
              label: BENCHMARK_HISTORY_DATATABLE.ROW_EDIT_LABEL,
              onSelect: () => options.onEdit(row.original),
            },
            {
              key: "delete",
              label:
                BENCHMARK_HISTORY_DATATABLE.ROW_DELETE_LABEL,
              variant: "destructive",
              separatorBefore: true,
              onSelect: () => options.onDelete(row.original),
            },
          ]}
        />
      ),
    }),
  ]
}
