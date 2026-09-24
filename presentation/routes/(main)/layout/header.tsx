"use client"

import { SidebarTrigger } from "@/presentation/ui/sidebar"

import { MainModeToggle } from "@/presentation/parts/components/main-mode-toggle"
import { MainNotificationsToggle } from "@/presentation/parts/components/main-notifications-toggle"
import { MainBreadcrumb } from "@/presentation/parts/components/main-breadcrumb"
import { MainCommandTrigger } from "@/presentation/parts/components/main-command-trigger"
import { MainHeaderWrapper } from "@/presentation/parts/components/main-header-wrapper"
import { MainHeaderSection } from "@/presentation/parts/components/main-header-section"

function MainHeader() {
  return (
    <MainHeaderWrapper>
      <MainHeaderSection side="left">
        <SidebarTrigger />
        <MainBreadcrumb />
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
