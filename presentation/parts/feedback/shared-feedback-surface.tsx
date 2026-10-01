import type { ReactNode } from "react"
import { cn } from "cn"

/**
 * Props for the feedback surface frame.
 */
export interface SharedFeedbackSurfaceProps {
  icon?: ReactNode
  title: string
  description: string
  /**
   * Figure of account shown under the sentence, such as an
   * error digest or the address that was requested.
   */
  reference?: string
  actions?: ReactNode
  className?: string
}

/**
 * @summary
 * Renders the frame every feedback surface sits in.
 *
 * @remarks
 * A failed screen, a missing screen and a screen still
 * resolving all read from the same shape: a mark in the
 * margin, the title and the sentence beside it, and the way
 * out underneath. Owning that shape here is what keeps an
 * error boundary down to its title, its sentence and its
 * two buttons.
 *
 * The frame is left-aligned and ruled rather than centred in
 * a dashed box: the reader came here to find out what
 * happened to their data, and a ledger line answers that
 * better than a placeholder card. The reference is set in
 * the mono face the app uses for data, so a digest reads as
 * part of the same document as a balance.
 *
 * @param props - Props of the feedback surface.
 * @param props.icon - Optional mark in the margin.
 * @param props.title - Title of the surface.
 * @param props.description - Sentence explaining what
 *   happened and what to do.
 * @param props.reference - Figure shown under the sentence.
 * @param props.actions - Actions offering a way forward.
 * @param props.className - Optional wrapper class.
 *
 * @returns The feedback surface.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function SharedFeedbackSurface({
  icon,
  title,
  description,
  reference,
  actions,
  className,
}: SharedFeedbackSurfaceProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-1 items-center justify-center px-6 py-16",
        className
      )}
    >
      <div className="flex w-full max-w-xl flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {icon ? (
              <span
                aria-hidden
                className="text-destructive [&_svg]:size-5"
              >
                {icon}
              </span>
            ) : null}

            <h1 className="font-heading text-xl font-semibold text-foreground">
              {title}
            </h1>
          </div>

          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>

          {reference ? (
            <p className="font-mono text-xs text-muted-foreground/80">
              {reference}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-5">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export { SharedFeedbackSurface }
