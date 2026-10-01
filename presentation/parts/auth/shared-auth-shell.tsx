import { cn } from "cn"

interface SharedAuthShellProps {
  // The card column the screen stacks.
  children: React.ReactNode

  // Classes merged into the frame, for a screen that needs to
  // say more than a centred column.
  className?: string
}

/**
 * @summary
 * Renders the centred page frame of an auth screen.
 *
 * @remarks
 * Fills the viewport and centres the card column, so the
 * sign in and the sign up screens share one frame. The
 * caller only adds its own classes on top of it.
 *
 * @param props - Props of the frame.
 * @param props.children - The card column.
 * @param props.className - Classes merged into the frame.
 *
 * @returns The page frame of the auth screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function SharedAuthShell({
  children,
  className,
}: SharedAuthShellProps) {
  return (
    <main
      className={cn(
        "flex min-h-dvh items-center justify-center px-4",
        className
      )}
    >
      {children}
    </main>
  )
}

export { SharedAuthShell }
