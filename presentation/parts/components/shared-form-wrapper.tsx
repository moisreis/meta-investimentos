import { cn } from "cn"

interface SharedFormWrapperProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  children: React.ReactNode
  className?: string
}

export function SharedFormWrapper({
  onSubmit,
  children,
  className,
}: SharedFormWrapperProps) {
  return (
    <form className={cn("space-y-4", className)} noValidate onSubmit={onSubmit}>
      {children}
    </form>
  )
}
