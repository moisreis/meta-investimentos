import * as React from "react"

// Width in pixels below which the shell is the mobile one.
const MOBILE_BREAKPOINT = 768

/**
 * @summary
 * Reports whether the viewport is narrower than the
 * mobile breakpoint.
 *
 * @remarks
 * Subscribes to the media query and unsubscribes on
 * unmount, so the answer follows a resize instead of being
 * frozen at the first render. The question is answered from
 * the query itself rather than from a mirrored state: the
 * media query is the source of truth, so there is nothing
 * to synchronise after subscribing, and the server and the
 * client markup agree because the first render answers
 * `false`.
 *
 * @returns Whether the viewport is a mobile one.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export function useIsMobile() {
  const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

  return React.useSyncExternalStore(
    SubscribeToQuery,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}

/**
 * Subscribes to the mobile media query.
 */
function SubscribeToQuery(onStoreChange: () => void) {
  const MEDIA_QUERY = window.matchMedia(
    `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
  )

  MEDIA_QUERY.addEventListener("change", onStoreChange)

  return () => {
    MEDIA_QUERY.removeEventListener("change", onStoreChange)
  }
}
