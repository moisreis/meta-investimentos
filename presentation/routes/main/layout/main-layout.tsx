import type { ReactNode } from "react"
import { SidebarProvider } from "@/presentation/ui/sidebar"
import { MainSidebar } from "./sidebar"
import { MainHeader } from "./header"

interface MainLayoutProps {
  children: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "13rem",
          "--sidebar-width-mobile": "18rem",
        } as React.CSSProperties
      }
    >
      <MainSidebar />
      <main className="flex w-full flex-col">
        <MainHeader />
        {children}
      </main>
    </SidebarProvider>
  )
}

export { MainLayout }
