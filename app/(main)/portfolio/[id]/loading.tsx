import { EntityDetailSkeleton } from "@/presentation/parts/feedback/entity-detail-skeleton"

/**
 * @summary
 * Streams the portfolio detail screen.
 *
 * @remarks
 * The detail screen opens with a portfolio registry and its
 * linked rows, so its fallback is the detail skeleton rather
 * than the list one.
 *
 * @returns The portfolio detail placeholder.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export default function PortfolioIdLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <EntityDetailSkeleton />
    </div>
  )
}
