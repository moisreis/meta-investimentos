import { cn } from "cn"
import { Button } from "@/presentation/ui/button"
import { IconLoader } from "@tabler/icons-react"

interface SharedSubmitButtonProps {
  pending: boolean
  label: React.ReactNode
  pendingLabel?: string
  className?: string
}

export function SharedSubmitButton({
  pending,
  label,
  pendingLabel,
  className,
}: SharedSubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn("w-full", className)}
      disabled={pending}
      aria-label={pending ? pendingLabel : undefined}
    >
      {pending ? (
        <IconLoader
          className="animate-spin"
          aria-hidden="true"
        />
      ) : (
        label
      )}
    </Button>
  )
}
