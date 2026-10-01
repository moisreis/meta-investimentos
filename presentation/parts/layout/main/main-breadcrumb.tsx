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

import { BuildMainBreadcrumbTrail } from "@/presentation/parts/navigation/main-breadcrumb-trail.helper"
import type { MainBreadcrumbResolvers } from "@/presentation/parts/navigation/main-breadcrumb-resolvers.types"

interface MainBreadcrumbProps {
  resolvers: MainBreadcrumbResolvers
}

/**
 * @summary
 * Renders the breadcrumb trail of the current route.
 *
 * @remarks
 * Derives the trail from the current pathname through
 * the shared navigation registry. The last crumb is the
 * current page; ancestors link back to their routes.
 * Dynamic detail segments resolve their entity name
 * through the resolvers handed in by the layout, so the
 * shell stays free of the routes it points at.
 *
 * @param props - Props of the breadcrumb.
 * @param props.resolvers - Name resolvers keyed by the
 * parent href of a dynamic segment.
 *
 * @returns The main breadcrumb trail.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function MainBreadcrumb({ resolvers }: MainBreadcrumbProps) {
  const PATHNAME = usePathname()
  const TRAIL = BuildMainBreadcrumbTrail(PATHNAME)
  const CURRENT = TRAIL.at(-1) ?? null

  // Name resolved for a dynamic crumb, tagged with the crumb
  // it belongs to. Tagging is what removes the need to clear
  // the state on every navigation: a label is only read when
  // its tag matches the crumb on screen, so a stale answer can
  // never surface under a different entity.
  const [RESOLVED, setResolved] = useState<{
    key: string
    name: string | null
  } | null>(null)

  const RESOLVER = CURRENT?.dynamicParentHref
    ? (resolvers[CURRENT.dynamicParentHref] ?? null)
    : null

  const RESOLVE_KEY =
    RESOLVER && CURRENT?.dynamicId
      ? `${CURRENT.dynamicParentHref}:${CURRENT.dynamicId}`
      : null

  useEffect(() => {
    if (!RESOLVE_KEY || !RESOLVER || !CURRENT?.dynamicId) return

    let ACTIVE = true

    RESOLVER(CURRENT.dynamicId).then((result) => {
      if (ACTIVE) {
        setResolved({
          key: RESOLVE_KEY,
          name: result.success ? (result.data ?? null) : null,
        })
      }
    })

    return () => {
      ACTIVE = false
    }
  }, [CURRENT?.dynamicId, RESOLVE_KEY, RESOLVER])

  const CURRENT_LABEL =
    RESOLVED?.key === RESOLVE_KEY ? RESOLVED.name : null

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
