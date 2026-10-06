import * as React from "react"

// Width in pixels below which the viewport is a mobile one.
const MOBILE_BREAKPOINT = 768

/**
 * @summary
 * Reports whether the viewport is narrower than the
 * mobile breakpoint.
 *
 * @remarks
 * The shadcn `use-mobile` hook, adopted into the shared
 * shelf as the shell's single answer to the mobile
 * question. It subscribes to the media query and
 * unsubscribes on unmount, so the answer follows device
 * or window resizes instead of being frozen at the first
 * render.
 *
 * The question is answered from the query itself rather
 * than from a mirrored state: the media query is the
 * source of truth, so there is nothing to synchronise
 * after subscribing, and the server and the client markup
 * agree because the first render answers `false`.
 *
 * @explanation
 * Use wherever the shell must pick between the desktop
 * and the mobile layout, such as the sidebar provider.
 *
 * @returns Whether the viewport is a mobile one.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function useIsMobile() {
  const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

  return React.useSyncExternalStore(
    SubscribeToQuery(QUERY),
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}

/**
 * @summary
 * Subscribes to a media query and unsubscribes on unmount.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
function SubscribeToQuery(query: string) {
  return (onStoreChange: () => void) => {
    const MEDIA_QUERY = window.matchMedia(query)

    MEDIA_QUERY.addEventListener("change", onStoreChange)

    return () => {
      MEDIA_QUERY.removeEventListener("change", onStoreChange)
    }
  }
}
