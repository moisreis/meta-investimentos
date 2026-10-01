"use client"

import { useEffect } from "react"

import { SharedErrorPanel } from "@/presentation/parts/feedback/shared-error-panel"

/**
 * @summary
 * Catches a failure thrown by a signed-in screen.
 *
 * @remarks
 * The boundary renders inside the main shell, so the sidebar
 * and the header stay put and only the screen underneath is
 * replaced. That is the point: a failure in one screen should
 * not cost the reader their navigation.
 *
 * @param props - Props of the shell boundary.
 * @param props.error - The thrown error, read for its
 *   digest.
 * @param props.reset - Re-renders the failed segment.
 *
 * @returns The failed screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(
      "[MainError] a signed-in screen failed.",
      error
    )
  }, [error])

  return (
    <SharedErrorPanel digest={error.digest} onRetry={reset} />
  )
}
