import { cn } from "cn";

import {
  SidebarHeader,
} from "@/presentation/ui/sidebar"

interface MainSidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function MainSidebarHeader({ children, className }: MainSidebarHeaderProps) {
  return (
    <SidebarHeader className={cn("h-11 border-b border-border", className)}>
      {children}
    </SidebarHeader>
  );
}