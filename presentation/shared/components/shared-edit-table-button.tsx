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

// ---------------------------------
// TYPES
// ---------------------------------

/**
 * Minimal shape of a column that supports visibility toggling.
 *
 * @remarks
 * Satisfied by any `@tanstack/react-table` column whose feature set
 * registers the `columnVisibilityFeature`.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-18
 */
export interface SharedEditTableColumn {
  id: string
  getCanHide: () => boolean
  getIsVisible: () => boolean
  toggleVisibility: (value?: boolean) => void
}

/**
 * Minimal shape of a table exposing hideable columns.
 *
 * @remarks
 * Satisfied by a `@tanstack/react-table` `ReactTable` instance
 * configured with the `columnVisibilityFeature`.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-18
 */
export interface SharedEditTableColumnTable {
  getAllColumns: () => SharedEditTableColumn[]
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
export interface SharedEditTableButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  table?: SharedEditTableColumnTable
  getColumnLabel?: (column: SharedEditTableColumn) => string
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
 * <SharedEditTableButton table={table} />
 * ```
 *
 * @author Moisés Reis
 *
 * @date 2026-09-18
 */
export function SharedEditTableButton({
  table,
  getColumnLabel,
  children = "Editar Tabela",
  ...props
}: SharedEditTableButtonProps): JSX.Element {
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
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {getColumnLabel ? getColumnLabel(column) : column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
