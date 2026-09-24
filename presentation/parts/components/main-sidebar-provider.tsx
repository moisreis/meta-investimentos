import type { ReactNode } from "react"
import { SidebarProvider } from "@/presentation/ui/sidebar"

interface MainSidebarProviderProps {
  children: ReactNode
  sidebarWidth?: string
  sidebarWidthMobile?: string
}

function MainSidebarProvider({
  children,
  sidebarWidth = "13rem",
  sidebarWidthMobile = "18rem",
}: MainSidebarProviderProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": sidebarWidth,
          "--sidebar-width-mobile": sidebarWidthMobile,
        } as React.CSSProperties
      }
    >
      {children}
    </SidebarProvider>
  )
}

export { MainSidebarProvider }