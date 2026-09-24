import { cn } from "cn"

interface AuthBackgroundWrapperProps {
  children: React.ReactNode
  className?: string
}

export function AuthBackgroundWrapper({
  children,
  className,
}: AuthBackgroundWrapperProps) {
  return (
    <div className={cn("w-full max-w-sm space-y-6", className)}>
      {children}
    </div>
  )
}
