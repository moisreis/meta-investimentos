import type { CSSProperties, ReactNode } from "react"
import { cn } from "cn"

/**
 * Props for the fluid column content wrapper.
 */
export interface EntityTableFluidContentProps {
  /** Minimum width of the column during overflow. */
  size: number
  children: ReactNode
  className?: string
}

/**
 * @summary
 * Wraps the content of a fluid entity table column.
 *
 * @remarks
 * A fluid column has no declared table width, so the fixed
 * table layout lets it absorb the horizontal surplus while
 * every other column keeps its exact size. This wrapper
 * gives that column a content-level min-width equal to its
 * declared size: without it, the overflow case would let
 * the column collapse to its content minimum, and a cell
 * level min-width is ignored by the fixed table algorithm.
 *
 * @param props - The column size and the rendered content.
 *
 * @returns The fluid column content wrapper.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityTableFluidContent({
  size,
  children,
  className,
}: EntityTableFluidContentProps) {
  const STYLE: CSSProperties = { minWidth: size }

  return (
    <div className={cn("truncate", className)} style={STYLE}>
      {children}
    </div>
  )
}

export { EntityTableFluidContent }
