"use client"

import { createColumnHelper } from "@tanstack/react-table"
import type { ColumnDef, RowData } from "@tanstack/react-table"
import { useRouter } from "next/navigation"

import { formatPercentage } from "@/presentation/presenters/percentage.presenter"
import { formatText } from "@/presentation/presenters/text.presenter"
import {
  SharedDateValue,
  SharedPercentageValue,
  SharedRowActionsMenu,
  SharedRowSelectCell,
  SharedRowSelectHeader,
  SharedScreenReaderLabel,
  SharedTextValue,
} from "@/presentation/shared/datatable/shared-column"
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

function renderSharedValue(value: unknown, format?: SharedDataTableCellFormat) {
  switch (format ?? "text") {
    case "percentage":
      return SharedPercentageValue({
        text: formatPercentage(value as string | number),
      })
    case "date":
      return SharedDateValue({ text: formatDate(value as string) })
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
    columnHelper.accessor((row) => row[column.accessorKey], {
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
          icon: action.icon,
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
