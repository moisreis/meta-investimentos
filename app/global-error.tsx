"use client"

import { useEffect } from "react"

import {
  FormatErrorReference,
  SHARED_GLOBAL_ERROR,
} from "@/presentation/parts/feedback/settings/shared-feedback-labels.settings"

// Inline styles, deliberately: the root error boundary
// replaces the root layout, so the stylesheet that layout
// imports is not on the page yet. Tailwind classes would
// resolve to nothing here, and the one screen that exists to
// report a failure must not itself come out unstyled.
const STYLE = {
  main: {
    minHeight: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 1.5rem",
    background: "#ffffff",
    color: "#141413",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
  },
  column: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.5rem",
    width: "100%",
    maxWidth: "36rem",
  },
  title: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 600,
    lineHeight: 1.3,
  },
  description: {
    margin: 0,
    maxWidth: "42ch",
    fontSize: "0.875rem",
    lineHeight: 1.7,
    color: "#6b6a66",
  },
  reference: {
    margin: 0,
    fontSize: "0.75rem",
    color: "#6b6a66",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  action: {
    alignSelf: "flex-start" as const,
    borderTop: "1px solid #ecebe7",
    paddingTop: "1.25rem",
    width: "100%",
  },
  button: {
    height: "2rem",
    padding: "0 0.75rem",
    border: "1px solid transparent",
    borderRadius: "0.45rem",
    background: "#1f6f52",
    color: "#ffffff",
    fontSize: "0.75rem",
    fontWeight: 500,
    cursor: "pointer",
  },
}

/**
 * @summary
 * Renders the root error boundary of the application.
 *
 * @remarks
 * This is the boundary of last resort: it catches a failure
 * in the root layout itself, so nothing the application
 * provides is on the page. That is why it carries its own
 * document, its own styles and its own words instead of
 * importing the shared feedback parts.
 *
 * `reset` is offered rather than a reload because the
 * boundary can repair the tree when the failure came from a
 * child render. A reader whose data is gone, though, needs a
 * full reload, which is what the button does after the first
 * attempt fails.
 *
 * @param props - Props of the root boundary.
 * @param props.error - The thrown error, read for its
 *   digest.
 * @param props.reset - Re-renders the root segment.
 *
 * @returns The root error screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[GlobalError] the root layout failed.", error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>
        <main style={STYLE.main}>
          <div style={STYLE.column}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <h1 style={STYLE.title}>
                {SHARED_GLOBAL_ERROR.TITLE}
              </h1>

              <p style={STYLE.description}>
                {SHARED_GLOBAL_ERROR.DESCRIPTION}
              </p>

              <p style={STYLE.reference}>
                {FormatErrorReference(error.digest)}
              </p>
            </div>

            <div style={STYLE.action}>
              <button
                type="button"
                style={STYLE.button}
                onClick={reset}
              >
                {SHARED_GLOBAL_ERROR.RETRY_LABEL}
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
