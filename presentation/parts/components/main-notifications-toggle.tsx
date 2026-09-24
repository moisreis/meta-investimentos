import { Button } from "@/presentation/ui/button"
import { IconBell } from "@tabler/icons-react"

function MainNotificationsToggle() {
  return (
    <Button variant="ghost" size="icon" className="relative">
      <IconBell />
      <div className="absolute right-1 bottom-1 h-2 w-2 rounded-full bg-green-600"></div>
    </Button>
  )
}

export { MainNotificationsToggle }
