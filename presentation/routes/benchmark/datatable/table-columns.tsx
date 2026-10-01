"use client"

import type { ColumnHelper } from "@tanstack/react-table"

import type { EntityColumnDef } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { BENCHMARK_DATATABLE } from "@/presentation/routes/benchmark/settings/labels.settings"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

export interface BenchmarkTableColumnOptions {
  onEdit: (benchmark: BenchmarkRow) => void
}

/**
 * @summary
 * Builds the column definitions of the benchmark datatable.
 *
 * @remarks
 * Pins the acronym column to the start and the actions
 * column to the end. The pinned columns keep a fixed width
 * through the size clamp while the fluid name column grows
 * or shrinks to fit the available width.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row action callbacks.
 *
 * @returns The benchmark column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export function CreateBenchmarkTableColumns(
  columnHelper: ColumnHelper<EntityTableFeatures, BenchmarkRow>,
  options: BenchmarkTableColumnOptions
): EntityColumnDef<BenchmarkRow>[] {
  return [
    columnHelper.accessor("acronym", {
      header: BENCHMARK_DATATABLE.COLUMN_ACRONYM,
      enableHiding: false,
      size: 130,
      minSize: 130,
      maxSize: 130,
      meta: { pinned: "start" },
    }),

    columnHelper.accessor("name", {
      header: BENCHMARK_DATATABLE.COLUMN_NAME,
      size: 220,
      meta: { fluid: true },
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
          label={BENCHMARK_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "edit",
              label: BENCHMARK_DATATABLE.ROW_EDIT_LABEL,
              onSelect: () => options.onEdit(row.original),
            },
          ]}
        />
      ),
    }),
  ]
}
