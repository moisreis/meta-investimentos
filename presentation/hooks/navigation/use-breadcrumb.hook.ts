"use client";

import { usePathname } from "next/navigation";
import { SIDEBAR_NAV } from "@/presentation/components/routes/main/navigation/sidebar.nav";

/**
 * A single level of the header breadcrumb trail.
 */
export interface BreadcrumbSegment {
  /**
   * The label shown for the level.
   */
  label: string;

  /**
   * The route the level links to, when the level is a link.
   */
  href?: string;
}

/**
 * Resolves the breadcrumb trail for the shell header.
 *
 * The trail is derived from the single source of truth of the sidebar
 * navigation: given the active tab, the current pathname is matched
 * against the tab's menu items. When a menu item matches, the trail
 * shows the tab as the root level and the item as the current page;
 * otherwise the trail collapses to the active tab label.
 *
 * @param activeTab - The value of the tab currently open in the shell.
 * @returns The ordered breadcrumb segments, root first.
 */
export function useBreadcrumb(activeTab: string): BreadcrumbSegment[] {
  const PATHNAME = usePathname();
  const TAB = SIDEBAR_NAV.find((tab) => tab.value === activeTab);

  if (TAB) {
    for (const GROUP of TAB.groups) {
      const ITEM = GROUP.items.find((item) => item.href === PATHNAME);
      if (ITEM) {
        return [
          { label: TAB.label, href: ITEM.href },
          { label: GROUP.label },
          { label: ITEM.label },
        ];
      }
    }
  }

  return [{ label: TAB?.label ?? "Início" }];
}
