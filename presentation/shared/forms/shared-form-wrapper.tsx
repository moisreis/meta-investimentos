"use client"

import type { ReactNode } from "react"
import { cn } from "cn"

export interface SharedFormWrapperProps extends React.ComponentProps<"form"> {
  formTitle: string
  formDescription?: string
  children: ReactNode
}

/**
 * @summary
 * Shared form shell for dialogs.
 *
 * @remarks
 * Wraps the form fields with a title and an optional
 * description header. Renders a native `<form>` element so
 * consumers can submit it from a dialog footer via the
 * `form` attribute, pass `onSubmit`, or render their own
 * submit button as a child.
 *
 * @param props - Component configuration props.
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
      {children}
    </form>
  )
}