import type { ReactNode } from "react"

import type { MainBreadcrumbResolvers } from "@/presentation/parts/navigation/main-breadcrumb-resolvers.types"

import { MainSidebar } from "./main-sidebar"
import { MainHeader } from "./main-header"
import { MainSidebarProvider } from "./main-sidebar-provider"
import { MainContentArea } from "./main-content-area"

interface MainShellProps {
  children: ReactNode
  breadcrumbResolvers: MainBreadcrumbResolvers
}

function MainShell({
  children,
  breadcrumbResolvers,
}: MainShellProps) {
  return (
    <MainSidebarProvider>
      <MainSidebar />
      <MainContentArea>
        <MainHeader breadcrumbResolvers={breadcrumbResolvers} />
        {children}
      </MainContentArea>
    </MainSidebarProvider>
  )
}

export { MainShell }
