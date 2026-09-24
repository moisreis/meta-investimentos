import { cn } from "cn"

interface MainHeaderSectionProps {
  side?: "left" | "right"
  children: React.ReactNode
  className?: string
}

export function MainHeaderSection({
  side = "left",
  children,
  className,
}: MainHeaderSectionProps) {
  return (
    <div
      className={cn(
        "flex flex-row items-center gap-2",
        side === "left" ? "justify-start" : "justify-end",
        className
      )}
    >
      {children}
    </div>
  )
}
