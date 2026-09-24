"use client"

import type { ButtonHTMLAttributes, JSX } from "react"
import { IconSettings } from "@tabler/icons-react"
import { Button } from "@/presentation/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/presentation/ui/dropdown-menu"

export interface EntityDatatableEditColumnsColumn {
  id: string
  getCanHide: () => boolean
  getIsVisible: () => boolean
  toggleVisibility: (value?: boolean) => void
}

export interface EntityDatatableEditColumns {
  getAllColumns: () => EntityDatatableEditColumnsColumn[]
}

/**
 * Props for the shared edit table button.
 *
 * @remarks
 * Extends the native button HTML attributes. When a `table` instance
 * is provided, the button opens a dropdown that toggles the
 * visibility of the hideable columns.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-18
 */
export interface EntityDatatableEditColumnsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  table?: EntityDatatableEditColumns
  getColumnLabel?: (
    column: EntityDatatableEditColumnsColumn
  ) => string
}

// ---------------------------------
// COMPONENT
// ---------------------------------

/**
 * Renders the shared button used to edit a table.
 *
 * @remarks
 * Without a `table`, renders a standalone button. With a `table`,
 * attaches a dropdown listing every hideable column, each toggled
 * through a checkbox item.
 *
 * @param props - Native button properties plus the optional table.
 *
 * @returns The edit table button, or a column visibility dropdown.
 *
 * @example
 * ```tsx
 * <EntityDatatableEditColumnsButton table={table} />
 * ```
 *
 * @author Moisés Reis
 *
 * @date 2026-09-18
 */
export function EntityDatatableEditColumnsButton({
  table,
  getColumnLabel,
  children = "Editar Tabela",
  ...props
}: EntityDatatableEditColumnsButtonProps): JSX.Element {
  const content = (
    <>
      <IconSettings aria-hidden="true" />
      <span>{children}</span>
    </>
  )

  if (!table) {
    return (
      <Button
        type="button"
        variant="ghost"
        className="font-normal text-muted-foreground"
        {...props}
      >
        {content}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="font-normal text-muted-foreground"
            {...props}
          />
        }
      >
        {content}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) =>
                column.toggleVisibility(!!value)
              }
            >
              {getColumnLabel
                ? getColumnLabel(column)
                : column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
