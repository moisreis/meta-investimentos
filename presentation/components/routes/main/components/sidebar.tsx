import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuButtonGroup,
  SidebarMenuLabel,
} from "@/presentation/components/ui/sidebar-menu";
import { useCurrentUser } from "@/presentation/hooks/auth/use-current-user.hook";
import { SIDEBAR_NAV } from "../navigation/sidebar.nav";
import ComposedAvatar from "./composed-avatar";

type SidebarProps = {
  activeTab: string;
};

export default function Sidebar({ activeTab }: SidebarProps) {
  const { IS_MANAGER } = useCurrentUser();
  const ACTIVE_NAV = SIDEBAR_NAV.find((tab) => tab.value === activeTab);
  const GROUPS =
    ACTIVE_NAV?.groups.filter((group) => !group.managerOnly || IS_MANAGER) ??
    [];

  return (
    <aside className="col-span-4 flex flex-col items-center justify-start gap-4 border-r border-border min-h-screen">
      <div className="h-11 w-full border-b border-border">
        <ComposedAvatar />
      </div>
      <nav className="flex flex-col items-start justify-start w-full gap-6 px-3 py-1">
        {GROUPS.map((group) => (
          <SidebarMenu key={group.label}>
            <SidebarMenuLabel label={group.label} />
            <SidebarMenuButtonGroup>
              {group.items.map((item) => (
                <SidebarMenuButton
                  key={item.href}
                  label={item.label}
                  link={item.href}
                  icon={item.icon}
                />
              ))}
            </SidebarMenuButtonGroup>
          </SidebarMenu>
        ))}
      </nav>
    </aside>
  );
}
