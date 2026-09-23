"use client"

import type { ReactNode } from "react"
import { cn } from "cn"

export interface SharedFormWrapperProps extends React.ComponentProps<"form"> {
  formTitle: string
  formDescription?: string
  /** Sticky action row rendered below the scrollable field area. */
  footer?: ReactNode
  children: ReactNode
}

/**
 * @summary
 * Shared form shell for dialogs.
 *
 * @remarks
 * Renders the form title and optional description header, the
 * field area as a scrollable region capped at half the viewport
 * height, and an optional sticky footer for the action buttons.
 * Renders a native `<form>` element so consumers can submit it
 * from a dialog footer via the `form` attribute or pass
 * `onSubmit`.
 *
 * @param props - Component configuration props.
 * @param props.formTitle - Title rendered in the form header.
 * @param props.formDescription - Optional description header text.
 * @param props.footer - Sticky action row below the scroll area.
 * @param props.children - Form fields rendered in the scroll area.
 *
 * @returns Form element.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function SharedFormWrapper({
  formTitle,
  formDescription,
  footer,
  children,
  className,
  ...props
}: SharedFormWrapperProps) {
  return (
    <form
      data-slot="shared-form"
      className={cn("flex flex-col gap-5", className)}
      {...props}
    >
      <header className="flex flex-col gap-1.5">
        <h2 className="text-lg font-semibold tracking-tight">{formTitle}</h2>
        {formDescription ? (
          <p className="text-sm text-muted-foreground">{formDescription}</p>
        ) : null}
      </header>

      {/* Scrollable field area capped at half the viewport height. */}
      <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
        {children}
      </div>

      {footer ? (
        <footer data-slot="shared-form-footer" className="flex justify-end gap-2 pt-1">
          {footer}
        </footer>
      ) : null}
    </form>
  )
}