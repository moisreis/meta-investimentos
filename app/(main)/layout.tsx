import type { ReactNode } from "react"

import { MainShell } from "@/presentation/routes/(main)/layout/shell"

export default function MainRouteLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return <MainShell>{children}</MainShell>
}
