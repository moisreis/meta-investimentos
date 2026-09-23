"use client"

import { createColumnHelper } from "@tanstack/react-table"
import type { ColumnDef, RowData } from "@tanstack/react-table"
import { useRouter } from "next/navigation"

import { formatPercentage } from "@/presentation/presenters/percentage.presenter"
import { formatText } from "@/presentation/presenters/text.presenter"
import {
  SharedDateValue,
  SharedPercentageValue,
  SharedTextValue,
  SharedUserAvatar,
} from "@/presentation/shared/datatable/values/shared-cell-value"
import { SharedRowActionsMenu } from "@/presentation/shared/datatable/rows/shared-row-actions-menu"
import { SharedRowSelectCell } from "@/presentation/shared/datatable/cells/shared-row-select-cell"
import { SharedRowSelectHeader } from "@/presentation/shared/datatable/header/shared-row-select-header"
import { SharedScreenReaderLabel } from "@/presentation/shared/datatable/others/shared-screen-reader-label"
import {
  SHARED_ACTIONS_COLUMN_ID,
  SHARED_ACTIONS_COLUMN_WIDTH,
  SHARED_ACTIONS_LABEL,
  SHARED_SELECT_COLUMN_ID,
  SHARED_SELECT_COLUMN_WIDTH,
  SHARED_SELECT_LABEL,
  type SharedDataTableCellFormat,
  type SharedDataTableColumnConfig,
  type SharedDataTableRowAction,
} from "@/presentation/shared/settings/shared-datatable-columns.settings"
import type { SharedDataTableFeatures } from "@/presentation/shared/settings/shared-datatable-features.settings"

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))
}

/**
 * Resolves a possibly nested dot-path key (e.g. `"user.name"`) against
 * a row, or `undefined` when the path does not exist.
 */
function getValueByPath<TData extends RowData>(
  row: TData,
  path: string | number | symbol
): unknown {
  const keys = String(path).split(".")

  return keys.reduce<unknown>((value, key) => {
    if (value === null || value === undefined) return undefined
    if (typeof value !== "object") return undefined

    return (value as Record<string, unknown>)[key]
  }, row)
}

function renderSharedValue(value: unknown, format?: SharedDataTableCellFormat) {
  switch (format ?? "text") {
    case "percentage":
      return SharedPercentageValue({
        text: formatPercentage(value as string | number),
      })
    case "date":
      return SharedDateValue({ text: formatDate(value as string) })
    case "user":
      return SharedUserAvatar({ name: formatText(value as string) })
    default:
      return SharedTextValue({ text: formatText(value as string | number) })
  }
}

export interface UseEntityColumnsOptions<TData extends RowData> {
  columns: SharedDataTableColumnConfig<TData>[]
  actions?: SharedDataTableRowAction<TData>[]
  withSelection?: boolean
  withRowActions?: boolean
  selectLabel?: string
  actionsLabel?: string
}

export function useEntityColumns<TData extends RowData>(
  options: UseEntityColumnsOptions<TData>
): Array<ColumnDef<SharedDataTableFeatures, TData, any>> {
  const {
    columns,
    actions = [],
    withSelection = true,
    withRowActions = true,
    selectLabel = SHARED_SELECT_LABEL,
    actionsLabel = SHARED_ACTIONS_LABEL,
  } = options

  const router = useRouter()
  const columnHelper = createColumnHelper<SharedDataTableFeatures, TData>()

  const dataColumns = columns.map((column) =>
    columnHelper.accessor((row) => getValueByPath(row, column.accessorKey), {
      id: column.id,
      header: column.label,
      cell: ({ getValue }) => renderSharedValue(getValue(), column.cellFormat),
      meta: {
        width: column.width ?? 0,
        align: column.align,
      },
      enableHiding: column.enableHiding ?? true,
    })
  )

  const selectionColumn = columnHelper.display({
    id: SHARED_SELECT_COLUMN_ID,
    header: ({ table }) =>
      SharedRowSelectHeader({
        checked: table.getIsAllPageRowsSelected(),
        indeterminate:
          table.getIsSomePageRowsSelected() &&
          !table.getIsAllPageRowsSelected(),
        onCheckedChange: (checked) => table.toggleAllPageRowsSelected(checked),
        label: selectLabel,
      }),
    cell: ({ row }) =>
      SharedRowSelectCell({
        checked: row.getIsSelected(),
        onCheckedChange: (checked) => row.toggleSelected(checked),
        label: selectLabel,
      }),
    enableHiding: false,
    meta: { width: SHARED_SELECT_COLUMN_WIDTH },
  })

  const actionsColumn = columnHelper.display({
    id: SHARED_ACTIONS_COLUMN_ID,
    header: () => SharedScreenReaderLabel({ text: actionsLabel }),
    cell: ({ row }) =>
      SharedRowActionsMenu({
        label: actionsLabel,
        actions: actions.map((action) => ({
          key: action.key,
          label: action.label,
          variant: action.variant,
          separatorBefore: action.separatorBefore,
          onSelect: action.href
            ? () => router.push(action.href!(row.original))
            : action.onClick
              ? () => action.onClick!(row.original)
              : undefined,
        })),
      }),
    enableHiding: false,
    meta: { width: SHARED_ACTIONS_COLUMN_WIDTH },
  })

  return [
    ...(withSelection ? [selectionColumn] : []),
    ...dataColumns,
    ...(withRowActions ? [actionsColumn] : []),
  ]
}
