import { Button } from "@/presentation/ui/button"
import { IconBell } from "@tabler/icons-react"

function MainNotificationsToggle() {
  return (
    <Button variant="ghost" size="icon" className="relative">
      <IconBell />
      <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-green-600"></div>
    </Button>
  )
}

export { MainNotificationsToggle }
