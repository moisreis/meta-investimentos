"use client"

import Link from "next/link"
import { IconAlertTriangle } from "@tabler/icons-react"

import { Button } from "@/presentation/ui/button"

import {
  FormatErrorReference,
  SHARED_FEEDBACK_HOME_HREF,
  SHARED_ROUTE_ERROR,
} from "./settings/shared-feedback-labels.settings"
import { SharedFeedbackSurface } from "./shared-feedback-surface"

/**
 * Props for the route error panel.
 */
export interface SharedErrorPanelProps {
  /** Reference the framework attaches to the failure. */
  digest?: string
  /** Runs the framework's retry of the failed segment. */
  onRetry: () => void
  className?: string
}

/**
 * @summary
 * Renders the body of a route error boundary.
 *
 * @remarks
 * An error boundary is allowed to be a client component and
 * to receive only the error and the retry, so the markup
 * itself lives here and the boundary files in `app/` stay
 * down to naming the failure and wiring the retry.
 *
 * The retry is the primary action because the data behind
 * the screen is the part that failed, and asking for it
 * again is what usually answers. The digest is shown in
 * full rather than truncated: a support call needs the whole
 * reference, and a reader who does not need it is not
 * slowed down by a line of mono.
 *
 * @explanation
 * Use as the presented body of `error.tsx`. Pass the
 * `digest` the boundary receives and its `reset` as
 * `onRetry`.
 *
 * @param props - Props of the route error panel.
 * @param props.digest - The framework error digest.
 * @param props.onRetry - Retries the failed segment.
 * @param props.className - Optional wrapper class.
 *
 * @returns The route error panel.
 *
 * @example
 * <SharedErrorPanel digest={error.digest} onRetry={reset} />
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function SharedErrorPanel({
  digest,
  onRetry,
  className,
}: SharedErrorPanelProps) {
  return (
    <SharedFeedbackSurface
      className={className}
      icon={<IconAlertTriangle />}
      title={SHARED_ROUTE_ERROR.TITLE}
      description={SHARED_ROUTE_ERROR.DESCRIPTION}
      reference={FormatErrorReference(digest)}
      actions={
        <>
          <Button onClick={onRetry}>
            {SHARED_ROUTE_ERROR.RETRY_LABEL}
          </Button>

          <Button
            variant="outline"
            render={<Link href={SHARED_FEEDBACK_HOME_HREF} />}
          >
            {SHARED_ROUTE_ERROR.BACK_LABEL}
          </Button>
        </>
      }
    />
  )
}

export { SharedErrorPanel }
