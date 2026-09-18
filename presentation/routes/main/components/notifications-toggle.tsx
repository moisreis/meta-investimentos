import { Button } from "@/presentation/ui/button"
import { IconBell } from "@tabler/icons-react"
import { DotIndicator } from "./dot-indicator"

function NotificationsToggle() {
  return (
    <Button variant="ghost" size="icon" className="relative">
      <IconBell />
      <DotIndicator />
    </Button>
  )
}

export { NotificationsToggle }
