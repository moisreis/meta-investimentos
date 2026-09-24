import {
  Sidebar,
  SidebarRail,
} from "@/presentation/ui/sidebar"

import { MainSidebarGroup } from "@/presentation/parts/components/main-sidebar-group"
import { MainUserActions } from "@/presentation/parts/components/main-user-actions"
import { MainSidebarHeader } from "@/presentation/parts/components/main-sidebar-header"
import { MainSidebarContent } from "@/presentation/parts/components/main-sidebar-content"

import {
  IconLayoutDashboard,
  IconLogs,
  IconWallet,
  IconChartDonut,
  IconCash,
  IconBuildingBank,
  IconPigMoney,
  IconCreditCard,
  IconFileAnalytics,
  IconBrandSpeedtest,
  IconChartHistogram,
  IconCoin,
  IconChartPie,
  IconCategory,
  IconUsers,
} from "@tabler/icons-react"

function MainSidebar() {
  return (
    <Sidebar>
      <MainSidebarHeader>
        <MainUserActions />
      </MainSidebarHeader>

      <MainSidebarContent>
        <MainSidebarGroup
          label="Visão Geral"
          items={[
            {
              icon: <IconLayoutDashboard />,
              label: "Painel",
              href: "/main",
            },
          ]}
        />

        <MainSidebarGroup
          label="Carteiras"
          items={[
            {
              icon: <IconWallet />,
              label: "Carteiras",
              href: "/portfolio",
            },
            {
              icon: <IconChartDonut />,
              label: "Posições",
              href: "/position",
            },
            {
              icon: <IconCash />,
              label: "Transações",
              href: "/transaction",
            },
            {
              icon: <IconFileAnalytics />,
              label: "Relatórios",
              href: "/statement",
            },
            {
              icon: <IconBrandSpeedtest />,
              label: "Performance",
              href: "/portfolio-performance",
            },
          ]}
        />

        <MainSidebarGroup
          label="Instituições bancárias"
          items={[
            {
              icon: <IconBuildingBank />,
              label: "Bancos",
              href: "/bank",
            },
            {
              icon: <IconPigMoney />,
              label: "Contas bancárias",
              href: "/bank-account",
            },
            {
              icon: <IconCreditCard />,
              label: "Contas correntes",
              href: "/checking-account",
            },
          ]}
        />

        <MainSidebarGroup
          label="Ìndices econômicos"
          items={[
            {
              icon: <IconChartHistogram />,
              label: "Histórico de registros",
              href: "/benchmark-history",
            },
          ]}
        />

        <MainSidebarGroup
          label="Fundos de investimento"
          items={[
            {
              icon: <IconCoin />,
              label: "Fundos credenciados",
              href: "/fund",
            },
            {
              icon: <IconCategory />,
              label: "Categorias",
              href: "/category",
            },
            {
              icon: <IconChartPie />,
              label: "Registros de cotas",
              href: "/quota",
            },
          ]}
        />

        <MainSidebarGroup
          label="Administração"
          items={[
            {
              icon: <IconUsers />,
              label: "Usuários",
              href: "/users",
            },
            {
              icon: <IconLogs />,
              label: "Atividades do sistema",
              href: "/audit-log",
            },
          ]}
        />
      </MainSidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export { MainSidebar }
