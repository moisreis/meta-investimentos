import { Skeleton } from "@/presentation/ui/skeleton"
import { cn } from "cn"

// Number of KPI cards the placeholder mirrors. The list
// screens carry four cards, so the fallback holds the same
// height and never shifts the page when the data arrives.
const KPI_CARD_COUNT = 4

// Placeholder column and row counts. The table is fixed
// width, so a handful of representative columns is enough to
// read as the grid the data will land in.
const TABLE_COLUMN_COUNT = 5
const TABLE_ROW_COUNT = 10

// Placeholder cell widths, cycled across the columns so the
// grid reads as a table rather than a wall of bars.
const CELL_WIDTHS = ["w-24", "w-16", "w-20", "w-12", "w-28"]

/**
 * Props for the entity datatable skeleton.
 */
export interface EntityDatatableSkeletonProps {
  className?: string
}

/**
 * @summary
 * Renders the placeholder of a list screen while its rows
 * are on their way.
 *
 * @remarks
 * The placeholder mirrors the real screen: a KPI bar, a
 * toolbar line and a ruled grid. Holding those three heights
 * is the whole point. A fallback shaped differently from the
 * screen it stands in for makes the arrival of the data feel
 * like a jump, which is worse than waiting a moment longer.
 *
 * @explanation
 * Use as the fallback of a route `loading.tsx`, and as the
 * pending body of a list screen whose rows have not
 * resolved. Both are the same wait, so both should look the
 * same.
 *
 * @param props - Props of the skeleton.
 * @param props.className - Optional wrapper class.
 *
 * @returns The list screen placeholder.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function EntityDatatableSkeleton({
  className,
}: EntityDatatableSkeletonProps) {
  const COLUMNS = Array.from({ length: TABLE_COLUMN_COUNT })
  const ROWS = Array.from({ length: TABLE_ROW_COUNT })

  return (
    <div
      className={cn("flex w-full flex-col", className)}
      aria-busy
    >
      <section className="flex h-32 w-full flex-row items-center border-b border-border">
        {Array.from({ length: KPI_CARD_COUNT }).map(
          (_, INDEX) => (
            <div
              key={INDEX}
              className="flex h-full w-full flex-col justify-center gap-3 border-r border-border px-3 last:border-r-0"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          )
        )}
      </section>

      <div className="flex h-12 items-center gap-2 border-b border-border px-3">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="ml-auto h-5 w-24" />
      </div>

      <div className="flex h-10 items-center gap-4 border-b border-border px-3">
        {COLUMNS.map((_, INDEX) => (
          <Skeleton
            key={INDEX}
            className={CELL_WIDTHS[INDEX] ?? "w-20"}
          />
        ))}
      </div>

      {ROWS.map((_, ROW_INDEX) => (
        <div
          key={ROW_INDEX}
          className="flex h-11 items-center gap-4 border-b border-border px-3"
        >
          {COLUMNS.map((__, CELL_INDEX) => (
            <Skeleton
              key={CELL_INDEX}
              className={CELL_WIDTHS[CELL_INDEX] ?? "w-20"}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export { EntityDatatableSkeleton }
