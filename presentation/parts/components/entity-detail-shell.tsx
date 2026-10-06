import type { ReactNode } from "react"

interface EntityDetailShellProps {
  // The toolbar pinned to the top of the screen, or absent
  // when the screen carries none.
  toolbar?: ReactNode
  // The blocks of the document, in reading order.
  children: ReactNode
}

/**
 * @summary
 * Hosts a detail screen, pinning an optional toolbar over the
 * document that scrolls under it.
 *
 * @remarks
 * Every detail screen opens with a toolbar of filters and
 * actions over a document of blocks. The shell owns that
 * skeleton, so a route page states only which toolbar it
 * carries and which blocks follow it, never the scroll
 * container or the sticky wrapper behind them.
 *
 * The document takes the room the header left rather than a
 * full screen of it. Asking for `min-h-full` instead would
 * measure the whole shell against the viewport, so a
 * `h-svh` column would hand the document one screen of
 * height on top of the header that sits above it: the last
 * strip of every page would sit under the header, out of the
 * scroll port and unreachable. `flex-1` with `min-h-0` takes
 * what remains and lets the block shrink, which is what
 * makes this the scroll port the sticky toolbar pins inside.
 *
 * The padding is on the shell rather than on the last block
 * because the last block is whichever table or summary the
 * screen happens to end on, and none of them can promise the
 * document ends with breathing room.
 *
 * @explanation
 * Use this shell as the root element of a `pages/detail`
 * screen. A screen without a toolbar still uses it, so the
 * scroll container lives in one place.
 *
 * @param props - Props of the detail shell.
 * @param props.toolbar - The toolbar pinned to the top.
 * @param props.children - The blocks of the document.
 *
 * @returns The scrollable detail screen.
 *
 * @example
 * <EntityDetailShell toolbar={<Toolbar />}>
 *   <EntityDetailSummary {...SUMMARY} />
 * </EntityDetailShell>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function EntityDetailShell({
  toolbar,
  children,
}: EntityDetailShellProps) {
  return (
    <div className="min-h-0 flex-1 overflow-auto pb-6">
      {toolbar ? (
        <div className="sticky top-0 z-50 h-11 w-full bg-background">
          {toolbar}
        </div>
      ) : null}

      {children}
    </div>
  )
}

export { EntityDetailShell }
