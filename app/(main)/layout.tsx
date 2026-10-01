import type { ReactNode } from "react"

import { MainShell } from "@/presentation/parts/layout/main/main-shell"

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
  return <MainShell>{children}</MainShell>
}
