import { cn } from "cn";

import { AsciiFluid } from "@/presentation/ui/ascii-fluid"

interface AuthFluidBackgroundProps {
  backgroundColor?: string;
  color?: string;
  cellSize?: number;
  className?: string;
}

export function AuthFluidBackground({
  backgroundColor = "#f4f4f0",
  color = "#1447e6",
  cellSize = 24,
  className,
}: AuthFluidBackgroundProps) {
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
  );
}