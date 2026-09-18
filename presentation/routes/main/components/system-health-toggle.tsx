import { Button } from "@/presentation/ui/button"
import { IconActivityHeartbeat } from "@tabler/icons-react"
import { DotIndicator } from "./dot-indicator"

function SystemHealthToggle() {
  return (
    <Button variant="ghost" size="icon" className="relative">
      <IconActivityHeartbeat />
      <DotIndicator />
    </Button>
  )
}

export { SystemHealthToggle }
