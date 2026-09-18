"use client"

import { SidebarTrigger } from "@/presentation/ui/sidebar"
import { ModeToggle } from "../components/mode-toggle"
import { NotificationsToggle } from "../components/notifications-toggle"
import { MainBreadcrumb } from "../components/breadcrumb"
import { SystemHealthToggle } from "../components/system-health-toggle"
import { CommandTrigger } from "../components/command-trigger"

function MainHeader() {
  return (
    <header className="flex min-h-11 w-full flex-row items-center justify-between px-2 border-b border-border">
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
