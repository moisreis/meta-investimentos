"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import { CreateEntitySelectColumn } from "@/presentation/parts/datatable/pinned-columns/entity-table-selectable-column"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import { CATEGORY_DATATABLE } from "@/presentation/routes/category/settings/labels.settings"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"

import type { CategoryRowSummary } from "../types/category-list.types"

export interface CategoryTableColumnOptions {
  onEdit: (category: CategoryResponseDTO) => void
  onDelete: (category: CategoryResponseDTO) => void
  summaryFor: (categoryId: string) => CategoryRowSummary | null
}

/**
 * @summary
 * Builds the column definitions of the category datatable.
 *
 * @remarks
 * Pins the selection column to the start and the actions
 * column to the end. The pinned columns keep a fixed
 * width through the size clamp while the fluid ones grow
 * or shrink to fit the available width and their overflow
 * is truncated instead of spilling into the neighbor
 * columns. The fund count column resolves its derived
 * data per row through `summaryFor` and renders through
 * the count presenter, aligned to the end.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row action callbacks.
 *
 * @returns The category column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreateCategoryTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    CategoryResponseDTO
  >,
  options: CategoryTableColumnOptions
): ColumnDef<EntityTableFeatures, CategoryResponseDTO, any>[] {
  return [
    CreateEntitySelectColumn(columnHelper),

    columnHelper.accessor("name", {
      header: CATEGORY_DATATABLE.COLUMN_NAME,
      size: 220,
      meta: { fluid: true },
    }),

    columnHelper.accessor(
      (row) => options.summaryFor(row.id)?.fundCount ?? 0,
      {
        id: "fundCount",
        header: CATEGORY_DATATABLE.COLUMN_FUND_COUNT,
        size: 110,
        meta: { align: "end", fluid: true },
        cell: (info) => FormatCount(info.getValue()),
      }
    ),

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
          label={CATEGORY_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "edit",
              label: CATEGORY_DATATABLE.ROW_EDIT_LABEL,
              onSelect: () => options.onEdit(row.original),
            },
            {
              key: "delete",
              label: CATEGORY_DATATABLE.ROW_DELETE_LABEL,
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
