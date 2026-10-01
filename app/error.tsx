"use client"

import { useEffect } from "react"

import { SharedErrorPanel } from "@/presentation/parts/feedback/shared-error-panel"

/**
 * @summary
 * Catches a failure thrown outside the signed-in shell.
 *
 * @remarks
 * The root boundary renders inside the root layout, so the
 * fonts and the theme are on the page and the shared panel
 * can be used directly. It exists for the routes that sit
 * between the document and a shell: the root page and
 * anything else rendered by the root layout alone.
 *
 * @param props - Props of the root boundary.
 * @param props.error - The thrown error, read for its
 *   digest.
 * @param props.reset - Re-renders the failed segment.
 *
 * @returns The root error screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[RootError] a route failed.", error)
  }, [error])

  return (
    <main className="flex min-h-svh w-full flex-col bg-background">
      <SharedErrorPanel digest={error.digest} onRetry={reset} />
    </main>
  )
}
