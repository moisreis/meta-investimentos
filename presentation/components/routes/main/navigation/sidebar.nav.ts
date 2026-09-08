import {
  Activity02Icon,
  AppleStocksIcon,
  ArrowDownLeft01Icon,
  ArrowUpRight01Icon,
  BankIcon,
  Calendar01Icon,
  ChartHistogramIcon,
  ChartLineIcon,
  Clock01Icon,
  CloudDownloadIcon,
  DatabaseIcon,
  DatabaseImportIcon,
  FileDownloadIcon,
  FileTextIcon,
  LayerIcon,
  LogsIcon,
  NewOfficeIcon,
  PiggyBankIcon,
  TrendingDownIcon,
  UndoIcon,
  UserMultipleIcon,
  UserShield01Icon,
  UsersIcon,
  WalletCardsIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export type SidebarMenuItem = {
  label: string;
  href: string;
  icon: IconSvgElement;
};

export type SidebarMenuGroup = {
  label: string;
  managerOnly?: boolean;
  items: SidebarMenuItem[];
};

export type SidebarNavTab = {
  value: string;
  label: string;
  managerOnly?: boolean;
  groups: SidebarMenuGroup[];
};

/**
 * Central source of truth for the main shell sidebar.
 *
 * Each `/main` tab declares the labelled groups and their navigation items.
 * Items are placeholders for now (routes point at pages delivered step by
 * step); items and groups marked `managerOnly` are only shown to `MANAGER`s.
 */
export const SIDEBAR_NAV: SidebarNavTab[] = [
  // Portfolio
  {
    value: "portfolio",
    label: "Carteiras",
    groups: [
      {
        label: "Inventários",
        items: [
          {
            label: "Carteiras",
            href: "/main/portfolios",
            icon: WalletCardsIcon,
          },
          {
            label: "Posições",
            href: "/main/positions",
            icon: LayerIcon,
          },
        ],
      },
      {
        label: "Movimentações",
        items: [
          {
            label: "Aportes",
            href: "/main/cash-flow/applications",
            icon: ArrowUpRight01Icon,
          },
          {
            label: "Resgates",
            href: "/main/cash-flow/withdrawals",
            icon: ArrowDownLeft01Icon,
          },
          {
            label: "Estornos",
            href: "/main/cash-flow/reversals",
            icon: UndoIcon,
          },
        ],
      },
      {
        label: "Desempenho",
        items: [
          {
            label: "Carteiras",
            href: "/main/performance/portfolio",
            icon: ChartLineIcon,
          },
          {
            label: "Posições",
            href: "/main/performance/positions",
            icon: ChartHistogramIcon,
          },
          {
            label: "Histórico",
            href: "/main/performance/history",
            icon: Calendar01Icon,
          },
        ],
      },
      {
        label: "Índices de referência",
        items: [
          {
            label: "Índices",
            href: "/main/benchmarks/index",
            icon: TrendingDownIcon,
          },
          {
            label: "Histórico",
            href: "/main/benchmarks/history",
            icon: ChartLineIcon,
          },
          {
            label: "Atualizar",
            href: "/main/benchmarks/refresh",
            icon: CloudDownloadIcon,
          },
        ],
      },
      {
        label: "Dados de referência",
        items: [
          {
            label: "Relatórios",
            href: "/main/statements",
            icon: FileDownloadIcon,
          },
        ],
      },
    ],
  },
  // References
  {
    value: "Referências",
    label: "Referências",
    groups: [
      {
        label: "Dados bancários",
        items: [
          {
            label: "Bancos",
            href: "/main/bank/institutions",
            icon: BankIcon,
          },
          {
            label: "Contas bancárias",
            href: "/main/bank/statements",
            icon: FileTextIcon,
          },
          {
            label: "Contas correntes",
            href: "/main/bank/accounts",
            icon: PiggyBankIcon,
          },
        ],
      },
      {
        label: "Normas regulatórias",
        items: [
          {
            label: "Categorias",
            href: "/main/benchmarks/index",
            icon: TrendingDownIcon,
          },
          {
            label: "Artigos normativos",
            href: "/main/benchmarks/history",
            icon: ChartLineIcon,
          },
        ],
      },
    ],
  },
  // Management
  {
    value: "quotas",
    label: "Fundos e cotas",
    managerOnly: true,
    groups: [
      {
        label: "Fundos",
        items: [
          {
            label: "Fundos de investimento",
            href: "/main/funds/catalog",
            icon: NewOfficeIcon,
          },
        ],
      },
      {
        label: "Cotas",
        items: [
          {
            label: "Cotação dos fundos",
            href: "/main/quotas/prices",
            icon: AppleStocksIcon,
          },
          {
            label: "Lacunas de dados",
            href: "/main/quotas/gaps",
            icon: Clock01Icon,
          },
          {
            label: "Fundos desatualizados",
            href: "/main/quotas/staleness",
            icon: DatabaseIcon,
          },
        ],
      },
    ],
  },
  {
    value: "system",
    label: "Sistema",
    managerOnly: true,
    groups: [
      {
        label: "Usuários",
        items: [
          {
            label: "Usuários",
            href: "/main/users/all",
            icon: UsersIcon,
          },
          {
            label: "Administradores",
            href: "/main/users/admins",
            icon: UserShield01Icon,
          },
          {
            label: "Acessos á carteiras",
            href: "/main/users/access",
            icon: UserMultipleIcon,
          },
        ],
      },
      {
        label: "Atividade",
        items: [
          { label: "Auditoria", href: "/main/logs/audit", icon: LogsIcon },
          { label: "Eventos", href: "/main/logs/events", icon: Activity02Icon },
        ],
      },
      {
        label: "Manutenção",
        items: [
          {
            label: "Importações de dados",
            href: "/main/data/imports",
            icon: DatabaseImportIcon,
          },
          {
            label: "Tarefas em segundo plano",
            href: "/main/data/jobs",
            icon: Activity02Icon,
          },
        ],
      },
    ],
  },
];

/** The tabs that must be rendered as static triggers in the tab rail. */
export const SIDEBAR_TAB_VALUES = SIDEBAR_NAV.map((tab) => tab.value);
