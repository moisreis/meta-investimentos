import { EntityDatatableSkeleton } from "@/presentation/parts/feedback/entity-datatable-skeleton"

/**
 * @summary
 * Streams the shell ahead of the list screens.
 *
 * @remarks
 * Every signed-in screen resolves its rows on the server
 * before it can paint. Without a boundary in between, the
 * whole navigation hangs until the slowest query answers,
 * even though the sidebar and the header have nothing to
 * wait for. This fallback is that boundary: the shell paints
 * at once and the rows arrive into it.
 *
 * Its shape is the list screen's shape, because most screens
 * below this segment are lists. The detail screens override
 * it with a boundary of their own.
 *
 * @returns The list screen placeholder.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export default function MainLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <EntityDatatableSkeleton />
    </div>
  )
}
