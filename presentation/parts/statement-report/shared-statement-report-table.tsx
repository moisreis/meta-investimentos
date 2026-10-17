import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import { tw } from "./shared-statement-report-styles.constants"

export interface StatementReportColumn<T> {
  // Header label of the column.
  label: string
  // Flex basis of the column and its cells, as a percentage.
  flexBasis: string
  // Horizontal alignment of the header, left by default.
  align?: "left" | "right"
  // How the column renders a data row.
  render: (row: T) => ReactElement
  // How the column reads on the closing total row, when the
  // table renders one. Columns that omit it stay blank on
  // that row, so a return that cannot be summed never shows
  // a figure.
  total?: (rows: readonly T[]) => string
}

interface StatementReportTableProps<T> {
  columns: StatementReportColumn<T>[]
  rows: readonly T[]
}

/**
 * @summary
 * Renders the plain datatable of the statement PDF.
 *
 * @remarks
 * One fixed header row on a neutral-100 background, edged by
 * a 1pt border above and below only, and one row per record
 * with the same top and bottom edge and no background.
 * Columns render their own cells through a callback, so
 * multi-line cells and right-aligned figures stay on the
 * section that owns them. When any column defines a `total`,
 * the table closes with one bold row that repeats the
 * columns: summable columns print their figure and the rest
 * stay blank. The header row is fixed, which keeps the
 * column labels visible when a table breaks across pages.
 *
 * @explanation
 * Use this primitive for every flat table of the statement
 * report, so the column markup stays in one place.
 *
 * @example
 * <StatementReportTable columns={COLUMNS} rows={ROWS} />
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function StatementReportTable<T>(
  props: StatementReportTableProps<T>
): ReactElement {
  const { columns: COLUMNS, rows: ROWS } = props

  const SHOWS_TOTALS = COLUMNS.some(
    (column) => column.total !== undefined
  )

  return (
    <View style={tw("mt-3")}>
      <View
        fixed
        style={tw(
          "flex-row border-t border-b border-border bg-neutral-100 px-2 py-1"
        )}
      >
        {COLUMNS.map((column, index) => (
          <Text
            key={index}
            style={[
              tw(
                `text-xs text-foreground font-normal${column.align === "right" ? " text-right" : ""}`
              ),
              { flexBasis: column.flexBasis },
            ]}
          >
            {column.label}
          </Text>
        ))}
      </View>
      {ROWS.map((row, index) => (
        <View
          key={index}
          style={tw(
            "flex-row border-t border-b border-border px-2 py-1"
          )}
        >
          {COLUMNS.map((column, columnIndex) => (
            <View
              key={columnIndex}
              style={{ flexBasis: column.flexBasis }}
            >
              {column.render(row)}
            </View>
          ))}
        </View>
      ))}
      {SHOWS_TOTALS && (
        <View
          style={tw(
            "flex-row border-t border-b border-border px-2 py-1"
          )}
        >
          {COLUMNS.map((column, index) => (
            <Text
              key={index}
              style={[
                tw(
                  `text-xs font-bold${column.align === "right" ? " text-right" : ""}`
                ),
                { flexBasis: column.flexBasis },
              ]}
            >
              {column.total?.(ROWS) ?? ""}
            </Text>
          ))}
        </View>
      )}
    </View>
  )
}
