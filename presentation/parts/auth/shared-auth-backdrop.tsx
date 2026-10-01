import { cn } from "cn"

interface SharedAuthBackdropProps {
  // The blocks stacked in front of the backdrop.
  children: React.ReactNode

  // Classes merged into the column.
  className?: string
}

/**
 * @summary
 * Renders the column that sits over an auth backdrop.
 *
 * @remarks
 * Holds the card, the copyright and anything else the
 * screen stacks in front of the animated background, at
 * the width a sign in form reads best at. The caller only
 * adds its own classes on top of it.
 *
 * @param props - Props of the column.
 * @param props.children - The stacked blocks.
 * @param props.className - Classes merged into the column.
 *
 * @returns The column over the auth backdrop.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function SharedAuthBackdrop({
  children,
  className,
}: SharedAuthBackdropProps) {
  return (
    <div className={cn("w-full max-w-sm space-y-6", className)}>
      {children}
    </div>
  )
}

export { SharedAuthBackdrop }
