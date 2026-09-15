import { SidebarTrigger } from "@/presentation/ui/sidebar";

function MainHeader() {
  return (
    <header className="h-11 w-full bg-sidebar border-b border-border">
      <SidebarTrigger />
    </header>
  )
}

export { MainHeader }
