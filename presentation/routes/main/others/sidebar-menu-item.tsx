import Link from "next/link";
import { ReactNode } from "react";

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/presentation/ui/sidebar";

interface MainSidebarMenuItemProps {
  label: string;
  href: string;
  icon: ReactNode
}

export function MainSidebarMenuItem({
  label,
  href,
  icon
}: MainSidebarMenuItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton>
        <Link className="flex flex-row w-full gap-2 items-center" href={href}>{icon}{label}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
