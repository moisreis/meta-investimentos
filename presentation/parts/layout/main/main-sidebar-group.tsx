import { ReactNode } from "react"

import {
  SidebarGroup as SidebarGroupPrimitive,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/presentation/ui/sidebar"

import { MainSidebarMenuItem } from "./main-sidebar-menu-item"

interface SidebarGroupItem {
  label: string
  href: string
  icon: ReactNode
}

interface MainSidebarGroupProps {
  label: string
  items: SidebarGroupItem[]
}

/**
 * @summary
 * Renders a sidebar navigation group.
 *
 * @remarks
 * Renders the group heading followed by one menu item per
 * navigation link.
 *
 * @explanation
 * Use this component in the main sidebar to group related
 * navigation links under a single heading.
 *
 * @param props - Component properties.
 * @param props.label - Group heading text.
 * @param props.items - List of child navigation links.
 *
 * @returns The rendered navigation group.
 *
 * @example
 * const ITEMS = [
 *   { label: "Dashboard", href: "/dashboard" }
 * ];
 *
 * const NAV = (
 *   <MainSidebarGroup
 *     label="Main"
 *     items={ITEMS}
 *   />
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export function MainSidebarGroup({
  label,
  items,
}: MainSidebarGroupProps) {
  return (
    <SidebarGroupPrimitive>
      <SidebarGroupLabel className="flex flex-row justify-start gap-2">
        {label}
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <MainSidebarMenuItem
              icon={item.icon}
              key={item.href}
              label={item.label}
              href={item.href}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroupPrimitive>
  )
}
