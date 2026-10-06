import {
  FindMainNavigationItem,
  type MainNavigationItem,
} from "./main-navigation.settings"

// Href of the page every other page hangs off, which makes
// its registry item the first crumb of every trail.
const DASHBOARD_HREF = "/portfolio"

// Label the dashboard crumb falls back to. The label actually
// rendered is read from the navigation registry so it cannot
// drift from the sidebar; this only holds the line if the
// dashboard is ever dropped from that registry.
const DASHBOARD_LABEL = "Carteiras"

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
 * Reduces a pathname to the one spelling the trail compares.
 *
 * @remarks
 * `/portfolio` and `/portfolio/` are the same page, so every
 * comparison below has to be made on one of them. Left
 * unnormalized, a single trailing slash is enough to make the
 * dashboard compare unequal to itself, which is what puts a
 * second copy of the same crumb in the trail. A pathname that
 * is nothing but slashes keeps one, so the root path stays a
 * path instead of becoming an empty string.
 *
 * @param pathname - The current application path.
 *
 * @returns The path without its trailing slashes.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function NormalizePathname(pathname: string): string {
  const TRIMMED = pathname.replace(/\/+$/, "")

  return TRIMMED === "" ? "/" : TRIMMED
}

/**
 * @summary
 * Reads the crumb every trail opens with.
 *
 * @remarks
 * The label comes from the navigation registry rather than a
 * second copy of it, so renaming the dashboard in the sidebar
 * renames it in the breadcrumb too.
 *
 * @returns The dashboard crumb, as an ancestor link.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function ReadDashboardCrumb(): MainBreadcrumbCrumb {
  const ITEM = FindMainNavigationItem(DASHBOARD_HREF)

  return {
    label: ITEM?.label ?? DASHBOARD_LABEL,
    href: DASHBOARD_HREF,
    isCurrent: false,
  }
}

/**
 * @summary
 * Reads the id of a detail row out of the path below a
 * registry item.
 *
 * @remarks
 * Everything past the matched href is the detail segment, so
 * an empty remainder means the path *is* the registry item and
 * holds no id.
 *
 * @param match - The registry item the path belongs to.
 * @param pathname - The normalized application path.
 *
 * @returns The dynamic id, or `null` on a registry page.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function ReadDynamicId(
  match: MainNavigationItem,
  pathname: string
): string | null {
  const REMAINDER = pathname.slice(match.href.length + 1)

  return REMAINDER.split("/")[0] || null
}

/**
 * @summary
 * Builds the breadcrumb trail of a pathname.
 *
 * @remarks
 * Every page hangs off the dashboard, so the dashboard crumb
 * opens the trail and links back to it. A registry page then
 * ends the trail on itself, and a detail page adds one dynamic
 * crumb whose entity name the shell resolves.
 *
 * The dashboard is itself a registry item, which is the one
 * case where the opening crumb and the matched item describe
 * the same page. Emitting both puts the identical crumb in the
 * trail twice — the `Carteiras / Carteiras` a reader sees — so
 * when the two coincide the trail carries the crumb once and
 * marks it current, rather than opening with one copy and
 * closing with another.
 *
 * @example
 * const TRAIL = BuildMainBreadcrumbTrail("/portfolio/id-1");
 * // [Carteiras (link), dynamic crumb]
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
  const PATH = NormalizePathname(pathname)
  const DASHBOARD = ReadDashboardCrumb()
  const MATCH: MainNavigationItem | null =
    FindMainNavigationItem(PATH)

  // A path the registry does not own has no place in the
  // trail, so the dashboard stands alone as the current page
  // instead of linking onward to a page that is not there.
  if (!MATCH) return [{ ...DASHBOARD, isCurrent: true }]

  const IS_DASHBOARD = MATCH.href === DASHBOARD.href
  const DYNAMIC_ID = ReadDynamicId(MATCH, PATH)

  // The reader is on the registry item itself, so that item is
  // the current page. The dashboard opening crumb already says
  // so when the two are the same page, and repeating it would
  // be the duplicate this trail exists to avoid.
  if (DYNAMIC_ID === null) {
    return IS_DASHBOARD
      ? [{ ...DASHBOARD, isCurrent: true }]
      : [DASHBOARD, { label: MATCH.label, isCurrent: true }]
  }

  // Below a registry item, both the dashboard and that item are
  // ancestors. They are the same link when the item is the
  // dashboard, so only one of them is emitted.
  const ANCESTORS: MainBreadcrumbCrumb[] = IS_DASHBOARD
    ? [DASHBOARD]
    : [
        DASHBOARD,
        {
          label: MATCH.label,
          href: MATCH.href,
          isCurrent: false,
        },
      ]

  return [
    ...ANCESTORS,
    {
      label: MATCH.label,
      isCurrent: true,
      dynamicId: DYNAMIC_ID,
      dynamicParentHref: MATCH.href,
    },
  ]
}
