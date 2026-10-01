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
 * frozen at the first render. The first render answers
 * `false` until the effect has read the width, which keeps
 * the server and the client markup in agreement.
 *
 * @returns Whether the viewport is a mobile one.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<
    boolean | undefined
  >(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    )
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
