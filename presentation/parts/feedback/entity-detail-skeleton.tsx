import { Skeleton } from "@/presentation/ui/skeleton"
import { cn } from "cn"

// Placeholder entry rows in the registry block, matching the
// number of entries a detail screen lists under the headline.
const ENTRY_ROW_COUNT = 5

// Placeholder section rows in the tables below the block.
const SECTION_ROW_COUNT = 4

/**
 * Props for the entity detail skeleton.
 */
export interface EntityDetailSkeletonProps {
  className?: string
}

/**
 * @summary
 * Renders the placeholder of a detail screen while its
 * registry and its linked rows are on their way.
 *
 * @remarks
 * A detail screen opens with a headline block, a ruled list
 * of registry entries and one or two tables of linked rows.
 * The placeholder holds that same order and those same
 * heights, so the screen the data lands in is the screen the
 * reader was already looking at.
 *
 * @explanation
 * Use as the fallback of a `[id]` route `loading.tsx`.
 *
 * @param props - Props of the skeleton.
 * @param props.className - Optional wrapper class.
 *
 * @returns The detail screen placeholder.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function EntityDetailSkeleton({
  className,
}: EntityDetailSkeletonProps) {
  const ENTRIES = Array.from({ length: ENTRY_ROW_COUNT })
  const SECTION_ROWS = Array.from({
    length: SECTION_ROW_COUNT,
  })

  return (
    <div
      className={cn("flex w-full flex-col", className)}
      aria-busy
    >
      <div className="flex flex-col gap-3 border-b border-border px-4 py-6 sm:px-6">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-64" />
      </div>

      <div className="flex flex-col border-b border-border px-4 py-6 sm:px-6">
        {ENTRIES.map((_, INDEX) => (
          <div
            key={INDEX}
            className="flex h-10 items-center gap-4 border-b border-border last:border-b-0"
          >
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 px-4 py-6 sm:px-6">
        <Skeleton className="h-3 w-40" />

        {SECTION_ROWS.map((_, INDEX) => (
          <div
            key={INDEX}
            className="flex h-11 items-center gap-4 border-b border-border"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

export { EntityDetailSkeleton }
