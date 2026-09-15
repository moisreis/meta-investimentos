import type { ReactNode } from "react";
import { SidebarProvider } from "@/presentation/ui/sidebar";
import { MainSidebar } from "./sidebar";
import { MainHeader } from "./header";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <MainSidebar />
      <main className="w-full flex flex-col">
        <MainHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}

export { MainLayout };
