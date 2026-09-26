import type { ReactNode } from "react"

import {
  IconArrowDownCircle,
  IconArrowUpCircle,
  IconBuildingBank,
  IconCash,
  IconCategory,
  IconChartDonut,
  IconChartHistogram,
  IconChartPie,
  IconCoin,
  IconCreditCard,
  IconFileAnalytics,
  IconLayoutDashboard,
  IconLogs,
  IconPigMoney,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react"

import { Sidebar, SidebarRail } from "@/presentation/ui/sidebar"

import { MainSidebarGroup } from "@/presentation/parts/components/main-sidebar-group"
import { MainUserActions } from "@/presentation/parts/components/main-user-actions"
import { MainSidebarHeader } from "@/presentation/parts/components/main-sidebar-header"
import { MainSidebarContent } from "@/presentation/parts/components/main-sidebar-content"
import {
  MAIN_NAVIGATION,
  type MainNavigationItem,
} from "@/presentation/parts/navigation/main-navigation"

// Icons resolved per navigation href.
const SIDEBAR_ICONS: Record<string, ReactNode> = {
  "/main": <IconLayoutDashboard />,
  "/portfolio": <IconWallet />,
  "/position": <IconChartDonut />,
  "/application": <IconArrowUpCircle />,
  "/withdrawal": <IconArrowDownCircle />,
  "/transaction": <IconCash />,
  "/statement": <IconFileAnalytics />,
  "/portfolio-performance": <IconWallet />,
  "/position-performance": <IconCoin />,
  "/bank": <IconBuildingBank />,
  "/bank-account": <IconPigMoney />,
  "/checking-account": <IconCreditCard />,
  "/benchmark-history": <IconChartHistogram />,
  "/fund": <IconCoin />,
  "/category": <IconCategory />,
  "/quota": <IconChartPie />,
  "/users": <IconUsers />,
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
