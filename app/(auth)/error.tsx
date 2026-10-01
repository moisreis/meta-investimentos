"use client"

import { useEffect } from "react"

import { SharedErrorPanel } from "@/presentation/parts/feedback/shared-error-panel"

/**
 * @summary
 * Catches a failure thrown by an authentication screen.
 *
 * @remarks
 * The authentication group has no shared frame, so the panel
 * renders directly on the document background.
 *
 * @param props - Props of the authentication boundary.
 * @param props.error - The thrown error, read for its
 *   digest.
 * @param props.reset - Re-renders the failed segment.
 *
 * @returns The failed authentication screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[AuthError] an auth screen failed.", error)
  }, [error])

  return (
    <main className="flex min-h-svh w-full flex-col bg-background">
      <SharedErrorPanel digest={error.digest} onRetry={reset} />
    </main>
  )
}
