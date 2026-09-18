import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/presentation/ui/sidebar"

import { SidebarNavGroup } from "@/presentation/routes/main/components/sidebar-group"

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
import { ComposedAvatar } from "../components/composed-avatar"

function MainSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="h-11 border-b border-border">
        <ComposedAvatar />
      </SidebarHeader>

      <SidebarContent className="scroll-fade">
        <SidebarNavGroup
          label="Visão Geral"
          items={[
            {
              icon: <IconLayoutDashboard />,
              label: "Painel",
              href: "/main",
            },
          ]}
        />

        <SidebarNavGroup
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

        <SidebarNavGroup
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

        <SidebarNavGroup
          label="Ìndices econômicos"
          items={[
            {
              icon: <IconChartHistogram />,
              label: "Histórico de registros",
              href: "/benchmark-history",
            },
          ]}
        />

        <SidebarNavGroup
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

        <SidebarNavGroup
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
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export { MainSidebar }
