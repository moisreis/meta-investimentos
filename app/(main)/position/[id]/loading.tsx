import { EntityDetailSkeleton } from "@/presentation/parts/feedback/entity-detail-skeleton"

/**
 * @summary
 * Streams the position detail screen.
 *
 * @remarks
 * The detail screen opens with a position registry and its
 * linked movements, so its fallback is the detail skeleton
 * rather than the list one.
 *
 * @returns The position detail placeholder.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export default function PositionIdLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <EntityDetailSkeleton />
    </div>
  )
}
