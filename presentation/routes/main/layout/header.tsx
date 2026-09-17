import { SidebarTrigger } from "@/presentation/ui/sidebar"
import { ModeToggle } from "../others/mode-toggle"
import { NotificationsToggle } from "../others/notifications-toggle"
import { MainBreadcrumb } from "../others/breadcrumb"
import { SystemHealthToggle } from "../others/system-health-toggle"
import { CommandTrigger } from "../others/command-trigger"

function MainHeader() {
  return (
    <header className="flex h-11 w-full flex-row items-center justify-between px-2">
      <div className="flex flex-row items-center justify-start gap-2">
        <SidebarTrigger />
        <MainBreadcrumb />
      </div>
      <div className="flex flex-row items-center justify-start gap-2">
        <CommandTrigger />
        <SystemHealthToggle />
        <NotificationsToggle />
        <ModeToggle />
      </div>
    </header>
  )
}

export { MainHeader }
