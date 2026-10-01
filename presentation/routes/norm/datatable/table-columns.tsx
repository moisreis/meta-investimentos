"use client"

import type { ColumnHelper } from "@tanstack/react-table"

import type { EntityColumnDef } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatEntityLookup } from "@/presentation/presenters/lookup.presenter"
import { FormatPercentage } from "@/presentation/presenters/percentage.presenter"
import { NORM_DATATABLE } from "@/presentation/routes/norm/settings/labels.settings"
import type { NormRow } from "@/presentation/types/norm-row.types"

export interface NormTableColumnOptions {
  onEdit: (norm: NormRow) => void
  categoryNameFor: (categoryId: string) => string | null
}

/**
 * @summary
 * Builds the column definitions of the norm datatable.
 *
 * @remarks
 * Pins the article column to the start and the actions
 * column to the end. The category column resolves its
 * name through the lookup the loader hands the table,
 * and the three allocation columns are formatted through
 * the percentage presenter.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row action callbacks and the
 *                  category name lookup.
 *
 * @returns The norm column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export function CreateNormTableColumns(
  columnHelper: ColumnHelper<EntityTableFeatures, NormRow>,
  options: NormTableColumnOptions
): EntityColumnDef<NormRow>[] {
  return [
    columnHelper.accessor("articleNumber", {
      header: NORM_DATATABLE.COLUMN_ARTICLE,
      enableHiding: false,
      size: 130,
      minSize: 130,
      maxSize: 130,
      meta: { pinned: "start" },
    }),

    columnHelper.accessor("name", {
      header: NORM_DATATABLE.COLUMN_NAME,
      size: 220,
      meta: { fluid: true },
    }),

    columnHelper.accessor(
      (row) => options.categoryNameFor(row.categoryId),
      {
        id: "category",
        header: NORM_DATATABLE.COLUMN_CATEGORY,
        size: 160,
        meta: { fluid: true },
        cell: (info) => FormatEntityLookup(info.getValue()),
      }
    ),

    columnHelper.accessor("minAllocation", {
      header: NORM_DATATABLE.COLUMN_MIN_ALLOCATION,
      size: 110,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatPercentage(info.getValue()),
    }),

    columnHelper.accessor("targetAllocation", {
      header: NORM_DATATABLE.COLUMN_TARGET_ALLOCATION,
      size: 110,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatPercentage(info.getValue()),
    }),

    columnHelper.accessor("maxAllocation", {
      header: NORM_DATATABLE.COLUMN_MAX_ALLOCATION,
      size: 110,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatPercentage(info.getValue()),
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
          label={NORM_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "edit",
              label: NORM_DATATABLE.ROW_EDIT_LABEL,
              onSelect: () => options.onEdit(row.original),
            },
          ]}
        />
      ),
    }),
  ]
}
