import {
  FindMainNavigationItem,
  type MainNavigationItem,
} from "./main-navigation"

// Fixed href of the dashboard crumb.
const DASHBOARD_HREF = "/main"

// Fixed label of the dashboard crumb.
const DASHBOARD_LABEL = "Painel"

// A single breadcrumb trail segment.
export interface MainBreadcrumbCrumb {
  // Label rendered for the segment.
  label: string

  // Optional href making the segment a link.
  href?: string

  // Whether the segment is the current page.
  isCurrent: boolean

  // Id of a dynamic detail row when the segment is a
  // detail page such as `/portfolio/[id]`.
  dynamicId?: string

  // Parent href used to look up the resolver of a
  // dynamic segment.
  dynamicParentHref?: string
}

/**
 * @summary
 * Builds the breadcrumb trail of a pathname.
 *
 * @remarks
 * Always starts with the dashboard crumb. Registry pages
 * resolve to `Painel` plus their label; dynamic detail
 * routes add the parent item as a link and emit a
 * dynamic crumb for the entity name. Unmatched paths
 * fall back to the dashboard crumb alone.
 *
 * @example
 * const TRAIL = BuildMainBreadcrumbTrail("/portfolio/id-1");
 * // [Painel, Carteiras (link), dynamic crumb]
 *
 * @param pathname - The current application path.
 *
 * @returns The breadcrumb trail segments.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildMainBreadcrumbTrail(
  pathname: string
): MainBreadcrumbCrumb[] {
  if (pathname === DASHBOARD_HREF) {
    return [{ label: DASHBOARD_LABEL, isCurrent: true }]
  }

  const TRAIL: MainBreadcrumbCrumb[] = [
    {
      label: DASHBOARD_LABEL,
      href: DASHBOARD_HREF,
      isCurrent: false,
    },
  ]

  const MATCH: MainNavigationItem | null =
    FindMainNavigationItem(pathname)

  if (!MATCH) return TRAIL

  if (MATCH.href === pathname) {
    TRAIL.push({ label: MATCH.label, isCurrent: true })
    return TRAIL
  }

  const REMAINING = pathname.slice(MATCH.href.length + 1)
  const DYNAMIC_ID = REMAINING.split("/")[0] ?? null

  TRAIL.push({
    label: MATCH.label,
    href: MATCH.href,
    isCurrent: false,
  })

  if (DYNAMIC_ID) {
    TRAIL.push({
      label: MATCH.label,
      isCurrent: true,
      dynamicId: DYNAMIC_ID,
      dynamicParentHref: MATCH.href,
    })
  }

  return TRAIL
}
