import { cn } from "cn"

interface AuthShellWrapperProps {
  children: React.ReactNode
  className?: string
}

export function AuthShellWrapper({
  children,
  className,
}: AuthShellWrapperProps) {
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
