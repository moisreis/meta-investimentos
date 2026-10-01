import { cn } from "cn"

import { SidebarContent } from "@/presentation/ui/sidebar"

interface MainSidebarContentProps {
  children: React.ReactNode
  className?: string
}

export function MainSidebarContent({
  children,
  className,
}: MainSidebarContentProps) {
  return (
    <SidebarContent className={cn("scroll-fade", className)}>
      {children}
    </SidebarContent>
  )
}
