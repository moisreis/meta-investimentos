import {
  Activity02Icon,
  AppleStocksIcon,
  ArrowDownLeft01Icon,
  ArrowUpRight01Icon,
  BankIcon,
  BanknoteIcon,
  Calendar01Icon,
  ChartHistogramIcon,
  ChartLineIcon,
  Clock01Icon,
  CloudDownloadIcon,
  DatabaseIcon,
  DatabaseImportIcon,
  FileDownloadIcon,
  FileManagementIcon,
  FileTextIcon,
  GavelIcon,
  LayerIcon,
  LayoutDashboardIcon,
  Legal01Icon,
  ListChecksIcon,
  LogsIcon,
  NewOfficeIcon,
  PiggyBankIcon,
  Settings02Icon,
  ShieldCheckIcon,
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
  {
    value: "portfolio",
    groups: [
      {
        label: "Inventários",
        items: [
          {
            label: "Carteiras",
            href: "/main/portfolios",
            icon: WalletCardsIcon,
          },
          { label: "Posições", href: "/main/positions", icon: LayerIcon },
          {
            label: "Movimentações",
            href: "/main/transactions",
            icon: BanknoteIcon,
          },
          {
            label: "Conformidade",
            href: "/main/compliance",
            icon: ShieldCheckIcon,
          },
          {
            label: "Relatórios",
            href: "/main/statements",
            icon: FileDownloadIcon,
          },
        ],
      },
    ],
  },
  {
    value: "performance",
    groups: [
      {
        label: "Desempenho",
        items: [
          {
            label: "Visão geral",
            href: "/main/performance/overview",
            icon: LayoutDashboardIcon,
          },
          {
            label: "Carteira",
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
          {
            label: "Recálculo",
            href: "/main/performance/recalculate",
            icon: Settings02Icon,
          },
        ],
      },
    ],
  },
  {
    value: "bank",
    groups: [
      {
        label: "Dados bancários",
        items: [
          { label: "Bancos", href: "/main/bank/institutions", icon: BankIcon },
          {
            label: "Contas correntes",
            href: "/main/bank/accounts",
            icon: PiggyBankIcon,
          },
          {
            label: "Extratos",
            href: "/main/bank/statements",
            icon: FileTextIcon,
          },
        ],
      },
    ],
  },
  {
    value: "benchmarks",
    managerOnly: true,
    groups: [
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
    ],
  },
  {
    value: "quotas",
    managerOnly: true,
    groups: [
      {
        label: "Cotas",
        items: [
          {
            label: "Cotação dos fundos",
            href: "/main/quotas/prices",
            icon: AppleStocksIcon,
          },
          {
            label: "Importação CVM",
            href: "/main/quotas/import",
            icon: DatabaseImportIcon,
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
    value: "fund",
    managerOnly: true,
    groups: [
      {
        label: "Fundos",
        items: [
          { label: "Fundos", href: "/main/funds/catalog", icon: NewOfficeIcon },
          {
            label: "Categorias",
            href: "/main/funds/categories",
            icon: ListChecksIcon,
          },
          {
            label: "Credenciamentos",
            href: "/main/funds/accreditations",
            icon: FileManagementIcon,
          },
        ],
      },
    ],
  },
  {
    value: "cash-flow",
    groups: [
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
    ],
  },
  {
    value: "users",
    managerOnly: true,
    groups: [
      {
        label: "Usuários",
        items: [
          {
            label: "Todos os usuários",
            href: "/main/users/all",
            icon: UsersIcon,
          },
          {
            label: "Administradores",
            href: "/main/users/admins",
            icon: UserShield01Icon,
          },
          {
            label: "Acessos a carteiras",
            href: "/main/users/access",
            icon: UserMultipleIcon,
          },
        ],
      },
    ],
  },
  {
    value: "logs",
    groups: [
      {
        label: "Atividade",
        items: [
          { label: "Auditoria", href: "/main/logs/audit", icon: LogsIcon },
          { label: "Eventos", href: "/main/logs/events", icon: Activity02Icon },
        ],
      },
    ],
  },
  {
    value: "normas",
    managerOnly: true,
    groups: [
      {
        label: "Normas",
        items: [
          { label: "Normas", href: "/main/norms/registry", icon: Legal01Icon },
          {
            label: "Aplicação por carteira",
            href: "/main/norms/portfolios",
            icon: GavelIcon,
          },
        ],
      },
    ],
  },
  {
    value: "dados",
    managerOnly: true,
    groups: [
      {
        label: "Manutenção",
        items: [
          {
            label: "Importações CVM",
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
