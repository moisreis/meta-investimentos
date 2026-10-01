"use client"

import { SidebarTrigger } from "@/presentation/ui/sidebar"

import { MainModeToggle } from "./main-mode-toggle"
import { MainNotificationsToggle } from "./main-notifications-toggle"
import { MainBreadcrumb } from "./main-breadcrumb"
import { MainCommandTrigger } from "./main-command-trigger"
import { MainHeaderWrapper } from "./main-header-wrapper"
import { MainHeaderSection } from "./main-header-section"

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
