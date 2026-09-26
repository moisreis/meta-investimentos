"use client"

import { Fragment } from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/presentation/ui/breadcrumb"

import { BuildMainBreadcrumbTrail } from "@/presentation/parts/navigation/build-main-breadcrumb-trail"
import { MAIN_BREADCRUMB_RESOLVERS } from "@/presentation/parts/navigation/main-breadcrumb-resolvers"

/**
 * @summary
 * Renders the breadcrumb trail of the current route.
 *
 * @remarks
 * Derives the trail from the current pathname through
 * the shared navigation registry. The last crumb is the
 * current page; ancestors link back to their routes.
 * Dynamic detail segments resolve their entity name
 * through the registered breadcrumb resolvers.
 *
 * @returns The main breadcrumb trail.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function MainBreadcrumb() {
  const PATHNAME = usePathname()
  const TRAIL = BuildMainBreadcrumbTrail(PATHNAME)
  const CURRENT = TRAIL.at(-1) ?? null

  const [CURRENT_LABEL, setCurrentLabel] = useState<
    string | null
  >(null)

  const RESOLVER = CURRENT?.dynamicParentHref
    ? (MAIN_BREADCRUMB_RESOLVERS[CURRENT.dynamicParentHref] ??
      null)
    : null

  useEffect(() => {
    if (!CURRENT?.dynamicId || !RESOLVER) return

    let ACTIVE = true
    setCurrentLabel(null)

    RESOLVER(CURRENT.dynamicId).then((result) => {
      if (ACTIVE && result.name) setCurrentLabel(result.name)
    })

    return () => {
      ACTIVE = false
    }
  }, [CURRENT?.dynamicId, RESOLVER])

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {TRAIL.map((crumb, index) => {
          const IS_LAST = index === TRAIL.length - 1

          return (
            <Fragment
              key={
                crumb.dynamicId ??
                crumb.href ??
                `${crumb.label}-${index}`
              }
            >
              <BreadcrumbItem>
                {crumb.isCurrent ? (
                  <BreadcrumbPage>
                    {crumb.dynamicId
                      ? (CURRENT_LABEL ?? crumb.label)
                      : crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={
                      <Link href={crumb.href ?? "#"}>
                        {crumb.label}
                      </Link>
                    }
                  />
                )}
              </BreadcrumbItem>

              {!IS_LAST ? <BreadcrumbSeparator /> : null}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export { MainBreadcrumb }
