"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeHotkey } from "./theme-hotkey"

/**
 * @summary
 * Provides theme state and theme keyboard controls.
 *
 * @remarks
 * The provider uses **NextThemesProvider** for theme state.
 * It also renders **ThemeHotkey** for keyboard theme changes.
 *
 * @explanation
 * This provider centralizes theme behavior for the
 * application. It passes theme options to
 * **NextThemesProvider** and renders the keyboard shortcut
 * alongside the application children. Use it near the
 * application root for shared theme behavior.
 *
 * @param props - Props accepted by **NextThemesProvider**.
 * @param props.children - Application content to render.
 * @returns The configured theme provider.
 *
 * @example
 * <ThemeProvider>{children}</ThemeProvider>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const SCRIPT_PROPS =
    typeof window === "undefined"
      ? undefined
      : { type: "application/json" as const }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={SCRIPT_PROPS}
      {...props}
    >
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

export { ThemeProvider }
