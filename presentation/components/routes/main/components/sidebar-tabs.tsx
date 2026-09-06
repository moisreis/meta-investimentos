import {
  AppleStocksIcon,
  Atm01Icon,
  BankIcon,
  CircleGaugeIcon,
  Legal01Icon,
  LogsIcon,
  NewOfficeIcon,
  Search01Icon,
  Settings02Icon,
  TrendingDownIcon,
  UserMultipleIcon,
  WalletCardsIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/presentation/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/presentation/components/ui/tooltip";
import { useCurrentUser } from "@/presentation/hooks/auth/use-current-user.hook";
import Logo from "@/public/Logo.svg";
import { SIDEBAR_NAV } from "../navigation/sidebar.nav";
import CommandMenu from "./command-menu";

const TAB_ICONS: Record<string, typeof WalletCardsIcon> = {
  portfolio: WalletCardsIcon,
  performance: CircleGaugeIcon,
  bank: BankIcon,
  benchmarks: TrendingDownIcon,
  quotas: AppleStocksIcon,
  "cash-flow": Atm01Icon,
  fund: NewOfficeIcon,
  users: UserMultipleIcon,
  logs: LogsIcon,
  normas: Legal01Icon,
  dados: Settings02Icon,
};

type SidebarTabsProps = {
  activeTab: string;
  onActiveTabChange: (value: string) => void;
};

export default function SidebarTabs({
  activeTab,
  onActiveTabChange,
}: SidebarTabsProps) {
  const [commandOpen, setCommandOpen] = useState(false);
  const { IS_MANAGER } = useCurrentUser();
  const VISIBLE_TABS = SIDEBAR_NAV.filter(
    (tab) => !tab.managerOnly || IS_MANAGER,
  );

  return (
    <aside className="col-span-1 flex flex-col items-center justify-start gap-4 bg-sidebar border-r border-border min-h-screen">
      <div className="w-11 h-11 flex items-center justify-center">
        <Image
          src={Logo}
          alt="Logo"
          className="w-7 h-7"
        />
      </div>
      <Button
        variant="outline"
        size="xs"
        onClick={() => setCommandOpen(true)}
      >
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          aria-hidden="true"
          className="!w-4 !h-4"
        />
      </Button>
      <Tabs
        value={activeTab}
        onValueChange={onActiveTabChange}
        orientation="vertical"
      >
        <TabsList className="bg-transparent p-0 gap-2">
          {VISIBLE_TABS.map((tab) => {
            const Icon = TAB_ICONS[tab.value] ?? WalletCardsIcon;
            const LABEL = tab.groups[0]?.label ?? tab.value;
            return (
              <Tooltip key={tab.value}>
                <TooltipTrigger>
                  <TabsTrigger value={tab.value}>
                    <HugeiconsIcon
                      icon={Icon}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{LABEL}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TabsList>
      </Tabs>
      <CommandMenu
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />
    </aside>
  );
}
