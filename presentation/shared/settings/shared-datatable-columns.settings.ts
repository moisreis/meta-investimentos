import type { RowData } from "@tanstack/react-table"
import type { Icon as TablerIcon } from "@tabler/icons-react"

export const SHARED_SELECT_COLUMN_ID = "select"
export const SHARED_SELECT_COLUMN_WIDTH = 40
export const SHARED_SELECT_LABEL = "Selecionar linhas"

export const SHARED_ACTIONS_COLUMN_ID = "actions"
export const SHARED_ACTIONS_COLUMN_WIDTH = 48
export const SHARED_ACTIONS_LABEL = "Ações"

export const SHARED_EMPTY_STATE_LABEL = "Sem resultados."

export type SharedDataTableColumnAlign = "start" | "end"
export type SharedDataTableCellFormat = "text" | "percentage" | "date"

export interface SharedDataTableColumnConfig<TData extends RowData> {
  id: string
  accessorKey: keyof TData
  label: string
  cellFormat?: SharedDataTableCellFormat
  align?: SharedDataTableColumnAlign
  width?: number
  enableHiding?: boolean
}

export interface SharedDataTableRowAction<TData extends RowData> {
  key: string
  label: string
  icon?: TablerIcon
  variant?: "default" | "destructive"
  separatorBefore?: boolean
  href?: (row: TData) => string
  onClick?: (row: TData) => void
}
