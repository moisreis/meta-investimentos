import type { ReactNode } from "react"

import { MainShell } from "@/presentation/parts/layout/main/main-shell"
import type { MainBreadcrumbResolvers } from "@/presentation/parts/navigation/main-breadcrumb-resolvers.types"
import { getPortfolioNameAction } from "@/presentation/routes/portfolio/actions/get-portfolio-name.action"
import { getPositionNameAction } from "@/presentation/routes/position/actions/get-position-name.action"

// Name resolvers of the dynamic breadcrumb segments, keyed
// by the parent href of the segment. The layout is the one
// place that may import the routes, so it builds the map
// here and the shell receives it as a prop.
const BREADCRUMB_RESOLVERS: MainBreadcrumbResolvers = {
  "/portfolio": getPortfolioNameAction,
  "/position": getPositionNameAction,
}

/**
 * @summary
 * Chrome shared by every authenticated screen: the
 * shell that hosts the header and the sidebar.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export default function MainRouteLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <MainShell breadcrumbResolvers={BREADCRUMB_RESOLVERS}>
      {children}
    </MainShell>
  )
}
