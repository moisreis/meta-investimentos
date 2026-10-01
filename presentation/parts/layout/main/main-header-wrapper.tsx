import { cn } from "cn"

interface MainHeaderWrapperProps {
  children: React.ReactNode
  className?: string
}

export function MainHeaderWrapper({
  children,
  className,
}: MainHeaderWrapperProps) {
  return (
    <header
      className={cn(
        "flex min-h-11 w-full flex-row items-center justify-between border-b border-border px-2",
        className
      )}
    >
      {children}
    </header>
  )
}
