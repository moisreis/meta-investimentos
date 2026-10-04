"use client"

import type { ComponentType, ReactNode } from "react"
import type { RowData } from "@tanstack/react-table"

import type { EntityTable } from "../settings/entity-table-features.settings"

import { EntityDatatable } from "./entity-datatable"
import { EntityEmptyTable } from "../pagination/entity-empty-table"

/**
 * Props for the shared datatable section.
 */
export interface SharedDatatableSectionProps<
  TData extends RowData,
> {
  // Unique id of the heading, which labels the section.
  titleId: string
  // Heading of the section.
  title: string
  // Supporting line under the heading.
  description: string
  // The table behind the section.
  table: EntityTable<TData>
  // Whether the table has rows to render.
  hasRows: boolean
  // Icon of the empty state.
  emptyIcon: ComponentType<{ size?: number; stroke?: number }>
  // Empty state title.
  emptyTitle: string
  // Empty state description.
  emptyDescription: string
  // Slot rendered above the table, for a toolbar.
  toolbar?: ReactNode
}

/**
 * @summary
 * Renders the section a detail screen wraps a read-only
 * datatable in.
 *
 * @remarks
 * A detail screen is made of two or three of these sections
 * stacked with a rule between them, each one a heading, a
 * supporting line and either the table or the shared empty
 * state. Owning that shape here is what keeps a section
 * component in a route down to the table hook and its copy:
 * the frame, the heading and the empty swap are the same
 * everywhere, so only the rows and the words differ.
 *
 * An empty section swaps the table for the shared empty
 * state, so a window or a list without movements explains
 * itself instead of presenting an empty frame.
 *
 * @explanation
 * Use as the section frame of a read-only detail datatable:
 * a portfolio's positions or activity, a fund's linked
 * positions, a position's activity. Pass the rows through
 * the section hook first, then hand its table here.
 *
 * @param props - Props of the shared datatable section.
 * @param props.titleId - Unique id of the heading.
 * @param props.title - Heading of the section.
 * @param props.description - Supporting line under the
 *   heading.
 * @param props.table - The table behind the section.
 * @param props.hasRows - Whether the table has rows.
 * @param props.emptyIcon - Icon of the empty state.
 * @param props.emptyTitle - Empty state title.
 * @param props.emptyDescription - Empty state description.
 * @param props.toolbar - Slot rendered above the table.
 *
 * @returns The shared datatable section.
 *
 * @example
 * <SharedDatatableSection
 *   titleId="portfolio-activity-title"
 *   title={PORTFOLIO_ACTIVITY.TITLE}
 *   description={PORTFOLIO_ACTIVITY.DESCRIPTION}
 *   table={table}
 *   hasRows={hasRows}
 *   emptyIcon={IconArrowDownRight}
 *   emptyTitle={PORTFOLIO_ACTIVITY.EMPTY_TITLE}
 *   emptyDescription={PORTFOLIO_ACTIVITY.EMPTY_DESCRIPTION}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function SharedDatatableSection<TData extends RowData>({
  titleId,
  title,
  description,
  table,
  hasRows,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  toolbar,
}: SharedDatatableSectionProps<TData>) {
  return (
    <section
      className="flex w-full flex-col gap-4 rounded-md border border-border px-4 py-6 sm:px-6"
      aria-labelledby={titleId}
    >
      <div className="flex flex-col gap-1">
        <h2
          id={titleId}
          className="font-heading text-xs font-medium text-foreground uppercase"
        >
          {title}
        </h2>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      {toolbar}

      {hasRows ? (
        <EntityDatatable table={table} />
      ) : (
        <EntityEmptyTable
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
        />
      )}
    </section>
  )
}

export { SharedDatatableSection }
