import Link from "next/link"

import {
  Card,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card"

import { MAIN_NAVIGATION } from "@/presentation/parts/navigation/main-navigation.settings"

// Copy of the shell home, which orients the person
// instead of reporting anything.
const COPY = {
  // Screen heading.
  TITLE: "Painel",

  // One line of direction below the heading.
  INTRO: "Escolha uma área para abrir.",

  // The home does not link to itself.
  HOME_HREF: "/main",
} as const

/**
 * @summary
 * Renders the home of the main shell.
 *
 * @remarks
 * The home is the landing screen of the authenticated
 * shell. It holds no data of its own: it reads the
 * navigation registry and lays the areas out as a grid
 * of links, so the destinations cannot drift from the
 * sidebar. The dashboard entry is dropped because a link
 * back to the current screen tells the person nothing.
 *
 * @returns The home screen of the main shell.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function MainHome() {
  const GROUPS = MAIN_NAVIGATION.map((group) => ({
    label: group.label,
    items: group.items.filter(
      (item) => item.href !== COPY.HOME_HREF
    ),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6">
        <header className="flex flex-col gap-1">
          <h1 className="font-heading text-base font-medium">
            {COPY.TITLE}
          </h1>
          <p className="text-sm text-muted-foreground">
            {COPY.INTRO}
          </p>
        </header>

        {GROUPS.map((group) => (
          <section
            key={group.label}
            className="flex flex-col gap-3"
          >
            <h2 className="text-xs font-medium text-muted-foreground">
              {group.label}
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Card className="h-full transition-colors hover:bg-accent/50">
                    <CardHeader>
                      <CardTitle>{item.label}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export { MainHome }
