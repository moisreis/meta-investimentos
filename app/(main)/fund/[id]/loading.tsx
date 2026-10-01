import { EntityDetailSkeleton } from "@/presentation/parts/feedback/entity-detail-skeleton"

/**
 * @summary
 * Streams the fund detail screen.
 *
 * @remarks
 * The detail screen opens with a fund registry and a table
 * of linked positions, so its fallback is the detail
 * skeleton rather than the list one.
 *
 * @returns The fund detail placeholder.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export default function FundIdLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <EntityDetailSkeleton />
    </div>
  )
}
