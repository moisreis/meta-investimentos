import type { ReactNode } from "react"

import { MainSidebar } from "./sidebar"
import { MainHeader } from "./header"
import { MainSidebarProvider } from "@/presentation/parts/components/main-sidebar-provider"
import { MainContentArea } from "@/presentation/parts/components/main-content-area"

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
