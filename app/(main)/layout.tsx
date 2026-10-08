import type { ReactNode } from "react"

import { MainShell } from "@/presentation/parts/layout/main/main-shell"
import type { MainBreadcrumbResolvers } from "@/presentation/parts/navigation/main-breadcrumb-resolvers.types"
import { LoadSessionUser } from "@/presentation/routes/user/helpers/load-session-user.helper"
import { getPortfolioNameAction } from "@/presentation/routes/portfolio/actions/get-portfolio-name.action"
import { getPositionNameAction } from "@/presentation/routes/position/actions/get-position-name.action"

// Every authenticated screen resolves the session from request
// headers and reads the database to render, so the whole group
// must be rendered per request. Never let the build statically
// prerender these pages: there is no session at build time and
// no database to answer it.
export const dynamic = "force-dynamic"

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
 * @remarks
 * The layout is the one place every authenticated screen
 * passes through, so it resolves the signed-in user once and
 * hands the identity to the shell. Reading the profile here
 * rather than in the sidebar keeps the account name off the
 * client fetch path: it arrives with the first render, and a
 * screen that opens the account menu never waits for it.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export default async function MainRouteLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const USER = await LoadSessionUser()

  return (
    <MainShell
      breadcrumbResolvers={BREADCRUMB_RESOLVERS}
      user={USER}
    >
      {children}
    </MainShell>
  )
}
