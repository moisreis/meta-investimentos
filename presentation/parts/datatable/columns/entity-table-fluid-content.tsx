import type { ReactNode } from "react"
import { cn } from "cn"

/**
 * Props for the fluid column content wrapper.
 */
export interface EntityTableFluidContentProps {
  children: ReactNode
  className?: string
}

/**
 * @summary
 * Wraps the content of a fluid entity table column.
 *
 * @remarks
 * The fluid column width is resolved by the screen sizing
 * pass and applied to the cell itself, so this wrapper only
 * clips the content to a single truncated line. Keeping the
 * truncation here stops wide values from spilling into the
 * neighboring columns when the space runs out.
 *
 * @param props - The rendered content.
 *
 * @returns The fluid column content wrapper.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityTableFluidContent({
  children,
  className,
}: EntityTableFluidContentProps) {
  return (
    <div className={cn("truncate", className)}>{children}</div>
  )
}

export { EntityTableFluidContent }
