import type { ReactNode } from "react"

import type { MainBreadcrumbResolvers } from "@/presentation/parts/navigation/main-breadcrumb-resolvers.types"
import type { UserIdentity } from "@/presentation/types/user-identity.types"
import { NotificationProvider } from "./main-notifications-context"

import { MainSidebar } from "./main-sidebar"
import { MainHeader } from "./main-header"
import { MainSidebarProvider } from "./main-sidebar-provider"
import { MainContentArea } from "./main-content-area"

interface MainShellProps {
  children: ReactNode
  breadcrumbResolvers: MainBreadcrumbResolvers
  // The signed-in user, resolved once by the route layout so
  // the chrome can name them. `null` while the profile is
  // unresolved, which drops the byline rather than the menu.
  user: UserIdentity | null
}

function MainShell({
  children,
  breadcrumbResolvers,
  user,
}: MainShellProps) {
  return (
    // The provider takes the same identity as the sidebar, so
    // a notification names the user who caused it without
    // every action having to send the name along.
    <MainSidebarProvider>
      <NotificationProvider user={user}>
        <MainSidebar user={user} />
        <MainContentArea>
          <MainHeader
            breadcrumbResolvers={breadcrumbResolvers}
          />
          {children}
        </MainContentArea>
      </NotificationProvider>
    </MainSidebarProvider>
  )
}

export { MainShell }
