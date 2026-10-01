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
    <div className="min-h-full overflow-auto">
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
