"use client"

import { SidebarTrigger } from "@/presentation/ui/sidebar"
import type { MainBreadcrumbResolvers } from "@/presentation/parts/navigation/main-breadcrumb-resolvers.types"

import { MainModeToggle } from "./main-mode-toggle"
import { MainNotificationsToggle } from "./main-notifications-toggle"
import { MainBreadcrumb } from "./main-breadcrumb"
import { MainCommandTrigger } from "./main-command-trigger"
import { MainHeaderWrapper } from "./main-header-wrapper"
import { MainHeaderSection } from "./main-header-section"

interface MainHeaderProps {
  breadcrumbResolvers: MainBreadcrumbResolvers
}

function MainHeader({ breadcrumbResolvers }: MainHeaderProps) {
  return (
    <MainHeaderWrapper>
      <MainHeaderSection side="left">
        <SidebarTrigger />
        <MainBreadcrumb resolvers={breadcrumbResolvers} />
      </MainHeaderSection>
      <MainHeaderSection side="right">
        <MainCommandTrigger />
        <MainNotificationsToggle />
        <MainModeToggle />
      </MainHeaderSection>
    </MainHeaderWrapper>
  )
}

export { MainHeader }
