import { cn } from "cn"

interface MainContentAreaProps {
  children: React.ReactNode
  className?: string
}

export function MainContentArea({
  children,
  className,
}: MainContentAreaProps) {
  return (
    <main
      className={cn(
        "flex h-svh w-full flex-col overflow-hidden",
        className
      )}
    >
      {children}
    </main>
  )
}
