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
 * One fixed header row on a surface background and one
 * bordered row per record. Columns render their own cells
 * through a callback, so multi-line cells and right-aligned
 * figures stay on the section that owns them. The header
 * row is fixed, which keeps the column labels visible when
 * a table breaks across pages.
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

  return (
    <View style={tw("mt-3")}>
      <View fixed style={tw("flex-row bg-surface px-2 py-1")}>
        {COLUMNS.map((column, index) => (
          <Text
            key={index}
            style={[
              tw(
                `text-xs font-bold text-subdued${
                  column.align === "right" ? " text-right" : ""
                }`
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
          style={tw("flex-row border-b border-border px-2 py-1")}
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
    </View>
  )
}
