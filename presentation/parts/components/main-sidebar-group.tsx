import { ReactNode } from "react";

import {
  SidebarGroup as SidebarGroupPrimitive,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/presentation/ui/sidebar"

import { MainSidebarMenuItem } from "@/presentation/parts/components/main-sidebar-menu-item"

interface SidebarGroupItem {
  label: string
  href: string
  icon: ReactNode
}

interface MainSidebarGroupProps {
  label: string
  items: SidebarGroupItem[]
  defaultOpen?: boolean
}

/**
 * @summary
 * Renders a collapsible sidebar navigation group.
 *
 * @remarks
 * Uses **React** state via **Collapsible** primitive to
 * toggle visibility of nested menu items.
 *
 * @explanation
 * Use this component in the main sidebar to group related
 * navigation links under a single collapsible heading.
 * It simplifies the sidebar structure and saves vertical
 * layout space.
 *
 * @param props - Component properties.
 * @param props.icon - Decorative icon element.
 * @param props.label - Group heading text.
 * @param props.items - List of child navigation links.
 * @param props.defaultOpen - Initial expanded state of the
 *                            group.
 *
 * @returns The rendered collapsible navigation group.
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
  defaultOpen = true,
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
