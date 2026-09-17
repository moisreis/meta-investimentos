import type { ReactNode } from "react"
import { MainLayout } from "@/presentation/routes/main/layout/main-layout"

export default function MainRouteLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return <MainLayout>{children}</MainLayout>
}
