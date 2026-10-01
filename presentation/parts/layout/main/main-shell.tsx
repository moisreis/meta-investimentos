import type { ReactNode } from "react"

import { MainSidebar } from "./main-sidebar"
import { MainHeader } from "./main-header"
import { MainSidebarProvider } from "./main-sidebar-provider"
import { MainContentArea } from "./main-content-area"

interface MainShellProps {
  children: ReactNode
}

function MainShell({ children }: MainShellProps) {
  return (
    <MainSidebarProvider>
      <MainSidebar />
      <MainContentArea>
        <MainHeader />
        {children}
      </MainContentArea>
    </MainSidebarProvider>
  )
}

export { MainShell }
