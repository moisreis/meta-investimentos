import { cn } from "cn"

import { AsciiFluid } from "@/presentation/ui/ascii-fluid"

interface SharedAuthFluidBackdropProps {
  // Backdrop colour behind the fluid.
  backgroundColor?: string

  // Colour of the fluid itself.
  color?: string

  // Side of a fluid cell, in pixels.
  cellSize?: number

  // Classes merged into the backdrop.
  className?: string
}

/**
 * @summary
 * Renders the animated backdrop of an auth screen.
 *
 * @remarks
 * Pins the shared ASCII fluid behind the whole viewport and
 * centres it on the screen, so the backdrop never scrolls
 * away from the form. The palette and the cell size are
 * props, so the screen decides the mood rather than the
 * renderer.
 *
 * @param props - Props of the backdrop.
 * @param props.backgroundColor - Backdrop colour.
 * @param props.color - Fluid colour.
 * @param props.cellSize - Side of a fluid cell, in pixels.
 * @param props.className - Classes merged into the backdrop.
 *
 * @returns The animated backdrop of the auth screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function SharedAuthFluidBackdrop({
  backgroundColor = "#f4f4f0",
  color = "#1447e6",
  cellSize = 24,
  className,
}: SharedAuthFluidBackdropProps) {
  return (
    <AsciiFluid
      backgroundColor={backgroundColor}
      color={color}
      cellSize={cellSize}
      className={cn(
        "absolute top-1/2 left-1/2 z-0 h-screen w-screen -translate-x-1/2 -translate-y-1/2",
        className
      )}
    />
  )
}

export { SharedAuthFluidBackdrop }
