"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/presentation/ui/button"

import {
  FormatRequestedPath,
  SHARED_FEEDBACK_HOME_HREF,
  SHARED_NOT_FOUND,
} from "./settings/shared-feedback-labels.settings"
import { SharedFeedbackSurface } from "./shared-feedback-surface"

/**
 * Props for the not-found panel.
 */
export interface SharedNotFoundPanelProps {
  className?: string
}

/**
 * @summary
 * Renders the body of a not-found screen.
 *
 * @remarks
 * A missing address is not a failure, so the panel carries
 * no failure mark and no retry: retrying an address that
 * does not exist would only fail again. What it does carry
 * is the address itself, read from the current pathname, so
 * a reader who mistyped can see the difference between what
 * they asked for and what exists, and a single way back into
 * the application.
 *
 * @explanation
 * Use as the presented body of `not-found.tsx`. It reads the
 * pathname itself, so the boundary file stays down to
 * rendering it.
 *
 * @param props - Props of the not-found panel.
 * @param props.className - Optional wrapper class.
 *
 * @returns The not-found panel.
 *
 * @example
 * <SharedNotFoundPanel />
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function SharedNotFoundPanel({
  className,
}: SharedNotFoundPanelProps) {
  const PATHNAME = usePathname()

  return (
    <SharedFeedbackSurface
      className={className}
      title={SHARED_NOT_FOUND.TITLE}
      description={SHARED_NOT_FOUND.DESCRIPTION}
      reference={FormatRequestedPath(PATHNAME)}
      actions={
        <Button
          render={<Link href={SHARED_FEEDBACK_HOME_HREF} />}
        >
          {SHARED_NOT_FOUND.HOME_LABEL}
        </Button>
      }
    />
  )
}

export { SharedNotFoundPanel }
