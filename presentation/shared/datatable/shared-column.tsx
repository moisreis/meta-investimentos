"use client"

import type { CSSProperties } from "react"
import { Fragment } from "react"
import {
  type Cell,
  type Column,
  type Header,
  type ReactTable,
  type RowData,
} from "@tanstack/react-table"
import { IconDotsVertical, type Icon as TablerIcon } from "@tabler/icons-react"
import { cn } from "cn"

import { Button } from "@/presentation/ui/button"
import { Checkbox } from "@/presentation/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/ui/dropdown-menu"
import { TEXT_LINE_CLAMP_CLASS } from "@/presentation/presenters/text.presenter"

import type { SharedDataTableFeatures } from "@/presentation/shared/settings/shared-datatable-features.settings"

type SharedTable<TData extends RowData> = ReactTable<
  SharedDataTableFeatures,
  TData
>
type SharedColumn<TData extends RowData> = Column<
  SharedDataTableFeatures,
  TData,
  unknown
>
type SharedHeader<TData extends RowData> = Header<
  SharedDataTableFeatures,
  TData,
  unknown
>
type SharedCell<TData extends RowData> = Cell<
  SharedDataTableFeatures,
  TData,
  unknown
>

export const SHARED_HEADER_BG = "bg-[#FFFFFF] dark:bg-neutral-900"

function getColumnWidthPx<TData extends RowData>(
  column: SharedColumn<TData>
): number {
  return column.columnDef.meta?.width ?? 0
}

function getColumnAlign<TData extends RowData>(
  column: SharedColumn<TData>
): string {
  return column.columnDef.meta?.align ?? "start"
}

function getPinnedStyle<TData extends RowData>(
  table: SharedTable<TData>,
  column: SharedColumn<TData>
): CSSProperties | undefined {
  const pin = column.getIsPinned()

  if (pin === "start") {
    let left = 0
    for (const c of table.getStartLeafColumns()) {
      if (c.id === column.id) break
      left += getColumnWidthPx(c)
    }
    return { position: "sticky", left }
  }

  if (pin === "end") {
    let right = 0
    for (const c of table.getEndLeafColumns()) {
      if (c.id === column.id) break
      right += getColumnWidthPx(c)
    }
    return { position: "sticky", right }
  }

  return undefined
}

function getColumnCellStyle<TData extends RowData>(
  column: SharedColumn<TData>
): CSSProperties {
  const width = getColumnWidthPx(column)
  const pin = column.getIsPinned()

  if (pin !== false) {
    return {
      flex: `0 0 ${width}px`,
      minWidth: width,
      maxWidth: width,
    }
  }

  return {
    flex: `1 1 ${width}px`,
    minWidth: width,
  }
}

export interface SharedTableHeaderCellProps<TData extends RowData> {
  table: SharedTable<TData>
  header: SharedHeader<TData>
}

export function SharedTableHeaderCell<TData extends RowData>({
  table,
  header,
}: SharedTableHeaderCellProps<TData>) {
  const column = header.column

  return (
    <div
      style={{
        ...getPinnedStyle(table, column),
        ...getColumnCellStyle(column),
      }}
      className={cn(
        "flex h-11 items-center border-r border-border px-3 text-xs font-medium text-muted-foreground uppercase",
        getColumnAlign(column) === "end" && "justify-end",
        SHARED_HEADER_BG
      )}
    >
      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
    </div>
  )
}

export interface SharedTableCellProps<TData extends RowData> {
  table: SharedTable<TData>
  cell: SharedCell<TData>
}

export function SharedTableCell<TData extends RowData>({
  table,
  cell,
}: SharedTableCellProps<TData>) {
  const column = cell.column

  return (
    <div
      style={{
        ...getPinnedStyle(table, column),
        ...getColumnCellStyle(column),
      }}
      className={cn(
        "flex h-11 items-center border-r border-b border-border px-3 text-sm font-normal group-data-[state=selected]:bg-muted",
        column.getIsPinned() !== false && "z-20",
        getColumnAlign(column) === "end" && "justify-end"
      )}
    >
      <table.FlexRender cell={cell} />
    </div>
  )
}

export interface SharedRowSelectHeaderProps {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
}

export function SharedRowSelectHeader({
  checked,
  indeterminate,
  onCheckedChange,
  label,
}: SharedRowSelectHeaderProps) {
  return (
    <Checkbox
      checked={checked}
      indeterminate={indeterminate}
      onCheckedChange={(value) => onCheckedChange(!!value)}
      aria-label={label}
    />
  )
}

export interface SharedRowSelectCellProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
}

export function SharedRowSelectCell({
  checked,
  onCheckedChange,
  label,
}: SharedRowSelectCellProps) {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(value) => onCheckedChange(!!value)}
      aria-label={label}
    />
  )
}

export interface SharedRowActionsMenuAction {
  key: string
  label: string
  icon?: TablerIcon
  variant?: "default" | "destructive"
  separatorBefore?: boolean
  onSelect?: () => void
}

export interface SharedRowActionsMenuProps {
  label: string
  actions: SharedRowActionsMenuAction[]
}

export function SharedRowActionsMenu({
  label,
  actions,
}: SharedRowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="size-8 p-0" />
        }
      >
        <span className="sr-only">{label}</span>
        <IconDotsVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
        </DropdownMenuGroup>
        {actions.map((action) => (
          <Fragment key={action.key}>
            {action.separatorBefore ? <DropdownMenuSeparator /> : null}
            <DropdownMenuItem
              variant={action.variant}
              onClick={() => action.onSelect?.()}
            >
              {action.icon ? <action.icon /> : null}
              {action.label}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SharedTextValue({ text }: { text: string }) {
  return <div className={cn(TEXT_LINE_CLAMP_CLASS, "min-w-0")}>{text}</div>
}

export function SharedPercentageValue({ text }: { text: string }) {
  return <div className="flex w-full justify-end">{text}</div>
}

export function SharedDateValue({ text }: { text: string }) {
  return <span>{text}</span>
}

export function SharedScreenReaderLabel({ text }: { text: string }) {
  return <span className="sr-only">{text}</span>
}
