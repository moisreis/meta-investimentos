import * as React from "react"

// Breakpoint in pixels where the layout switches to mobile.
const MOBILE_BREAKPOINT = 768

/**
 * @summary
 * Tracks whether the current viewport matches the mobile
 * breakpoint.
 *
 * @remarks
 * Uses a media query listener to react to viewport
 * width changes. Returns `undefined` during server-side
 * rendering.
 *
 * @explanation
 * Use this hook in components that need to conditionally
 * render or behave differently on mobile viewports. It
 * listens for media query changes and updates state
 * accordingly. Call it in client components that require
 * responsive behavior.
 *
 * @returns `true` when viewport is below the mobile breakpoint.
 *
 * @example
 * const IS_MOBILE = useIsMobile();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export function useIsMobile(): boolean {
  const [IS_MOBILE, setIsMobile] = React.useState<
    boolean | undefined
  >(undefined)

  React.useEffect(() => {
    const MQL = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    )
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    MQL.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => MQL.removeEventListener("change", onChange)
  }, [])

  return !!IS_MOBILE
}
