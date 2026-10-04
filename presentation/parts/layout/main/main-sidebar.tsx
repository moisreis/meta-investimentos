import type { ReactNode } from "react"

import {
  IconBook2,
  IconBuildingBank,
  IconCategory,
  IconChartDonut,
  IconChartPie,
  IconCircleArrowDown,
  IconCircleArrowUp,
  IconCoin,
  IconCreditCard,
  IconFileAnalytics,
  IconHistory,
  IconLogs,
  IconPigMoney,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react"

import { Sidebar, SidebarRail } from "@/presentation/ui/sidebar"

import { MainSidebarGroup } from "./main-sidebar-group"
import { MainUserActions } from "./main-user-actions"
import { MainSidebarHeader } from "./main-sidebar-header"
import { MainSidebarContent } from "./main-sidebar-content"
import {
  MAIN_NAVIGATION,
  type MainNavigationItem,
} from "@/presentation/parts/navigation/main-navigation.settings"

// Icons resolved per navigation href.
const SIDEBAR_ICONS: Record<string, ReactNode> = {
  "/portfolio": <IconWallet />,
  "/position": <IconChartDonut />,
  "/application": <IconCircleArrowUp />,
  "/withdrawal": <IconCircleArrowDown />,
  "/statement": <IconFileAnalytics />,
  "/portfolio-performance": <IconWallet />,
  "/position-performance": <IconCoin />,
  "/benchmark": <IconBook2 />,
  "/norm": <IconCategory />,
  "/benchmark-history": <IconHistory />,
  "/bank": <IconBuildingBank />,
  "/bank-account": <IconPigMoney />,
  "/checking-account": <IconCreditCard />,
  "/fund": <IconCoin />,
  "/category": <IconCategory />,
  "/quota": <IconChartPie />,
  "/user": <IconUsers />,
  "/audit-log": <IconLogs />,
}

/**
 * @summary
 * Resolves the sidebar icon of a navigation item.
 *
 * @remarks
 * Falls back to null when the href has no icon so the
 * group item still renders without breaking.
 *
 * @param item - The navigation item.
 *
 * @returns The icon element or `null`.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function SidebarIconFor(item: MainNavigationItem): ReactNode {
  return SIDEBAR_ICONS[item.href] ?? null
}

function MainSidebar() {
  return (
    <Sidebar>
      <MainSidebarHeader>
        <MainUserActions />
      </MainSidebarHeader>

      <MainSidebarContent>
        {MAIN_NAVIGATION.map((group) => (
          <MainSidebarGroup
            key={group.label}
            label={group.label}
            items={group.items.map((item) => ({
              label: item.label,
              href: item.href,
              icon: SidebarIconFor(item),
            }))}
          />
        ))}
      </MainSidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export { MainSidebar }
