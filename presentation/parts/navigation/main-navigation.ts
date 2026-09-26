// Shared navigation registry of the main application
// shell. Both the sidebar and the breadcrumb consume
// this constant so labels and hrefs never drift.
export interface MainNavigationItem {
  label: string
  href: string
}

// A collapsible sidebar group holding navigation items.
export interface MainNavigationGroup {
  label: string
  items: MainNavigationItem[]
}

// The navigation groups of the main shell, ordered as
// they appear in the sidebar.
export const MAIN_NAVIGATION: MainNavigationGroup[] = [
  {
    label: "Visão Geral",
    items: [{ label: "Painel", href: "/main" }],
  },
  {
    label: "Carteiras",
    items: [
      { label: "Carteiras", href: "/portfolio" },
      { label: "Posições", href: "/position" },
      { label: "Aplicações", href: "/application" },
      { label: "Resgates", href: "/withdrawal" },
      { label: "Transações", href: "/transaction" },
      { label: "Relatórios", href: "/statement" },
    ],
  },
  {
    label: "Performances",
    items: [
      { label: "Carteiras", href: "/portfolio-performance" },
      { label: "Fundos", href: "/position-performance" },
    ],
  },
  {
    label: "Instituições bancárias",
    items: [
      { label: "Bancos", href: "/bank" },
      { label: "Contas bancárias", href: "/bank-account" },
      { label: "Contas correntes", href: "/checking-account" },
    ],
  },
  {
    label: "Ìndices econômicos",
    items: [
      {
        label: "Histórico de registros",
        href: "/benchmark-history",
      },
    ],
  },
  {
    label: "Fundos de investimento",
    items: [
      { label: "Fundos credenciados", href: "/fund" },
      { label: "Categorias", href: "/category" },
      { label: "Registros de cotas", href: "/quota" },
    ],
  },
  {
    label: "Administração",
    items: [
      { label: "Usuários", href: "/users" },
      { label: "Atividades do sistema", href: "/audit-log" },
    ],
  },
]

/**
 * @summary
 * Finds the navigation item matching a pathname.
 *
 * @remarks
 * Prefers an exact href match and falls back to a
 * segment-prefix match so dynamic detail routes such as
 * `/portfolio/[id]` resolve to their registry item.
 *
 * @param pathname - The current application path.
 *
 * @returns The matching item or `null`.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function FindMainNavigationItem(
  pathname: string
): MainNavigationItem | null {
  for (const GROUP of MAIN_NAVIGATION) {
    for (const ITEM of GROUP.items) {
      if (ITEM.href === pathname) return ITEM
      if (pathname.startsWith(`${ITEM.href}/`)) return ITEM
    }
  }

  return null
}
