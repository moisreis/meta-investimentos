"use client"

import type {
  ColumnHelper,
  DisplayColumnDef,
  RowData,
} from "@tanstack/react-table"

import { Checkbox } from "@/presentation/ui/checkbox"

import { EntityTableSelectableCell } from "../rows/entity-table-selectable-cell"
import type { EntityTableFeatures } from "../settings/entity-table-features.settings"
import {
  ENTITY_TABLE_SELECT_ALL_LABEL,
  ENTITY_TABLE_SELECT_ROW_LABEL,
} from "../settings/entity-table-labels.settings"

// Id shared by the selection column definition.
const ENTITY_TABLE_SELECT_COLUMN_ID = "select"

/**
 * Props for the select-all header checkbox.
 */
export interface EntityTableSelectAllHeaderProps {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
}

/**
 * Renders the select-all checkbox for the table header.
 */
export function EntityTableSelectAllHeader({
  checked,
  indeterminate,
  onCheckedChange,
  label,
}: EntityTableSelectAllHeaderProps) {
  return (
    <Checkbox
      checked={checked}
      indeterminate={indeterminate}
      onCheckedChange={(value) => onCheckedChange(!!value)}
      aria-label={label}
    />
  )
}

/**
 * @summary
 * Builds the selection column for an entity table.
 *
 * @remarks
 * Returns a pinned start display column with a select-all
 * header and a per-row checkbox. The column can never be
 * sorted or hidden.
 *
 * @param columnHelper - The column helper of the entity.
 *
 * @returns The selection column definition.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
export function CreateEntitySelectColumn<TData extends RowData>(
  columnHelper: ColumnHelper<EntityTableFeatures, TData>
): DisplayColumnDef<EntityTableFeatures, TData, unknown> {
  return columnHelper.display({
    id: ENTITY_TABLE_SELECT_COLUMN_ID,
    enableSorting: false,
    enableHiding: false,
    meta: { pinned: "start" },
    header: ({ table }) => (
      <EntityTableSelectAllHeader
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() &&
          !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(value)
        }
        label={ENTITY_TABLE_SELECT_ALL_LABEL}
      />
    ),
    cell: ({ row }) => (
      <EntityTableSelectableCell
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(value)}
        label={ENTITY_TABLE_SELECT_ROW_LABEL}
      />
    ),
  })
}
