"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

/**
 * @summary
 * Provides theme state and theme keyboard controls.
 *
 * @remarks
 * The provider uses **NextThemesProvider** for theme state.
 * It also renders **ThemeHotkey** for keyboard theme changes.
 *
 * @explanation
 * This provider centralizes theme behavior for the application.
 * It passes theme options to **NextThemesProvider** and renders
 * the keyboard shortcut alongside the application children.
 * Use it near the application root for shared theme behavior.
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
 * @date 2026-09-13
 */
function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const scriptProps =
    typeof window === "undefined"
      ? undefined
      : { type: "application/json" as const }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={scriptProps}
      {...props}
    >
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  );
}

/**
 * @summary
 * Checks if an event target accepts text input.
 *
 * @remarks
 * Editable elements must not trigger the theme shortcut.
 * Non-HTML targets return `false`.
 *
 * @explanation
 * This function prevents shortcuts during text entry.
 * It checks common form elements and editable elements.
 * Use it before handling global keyboard shortcuts.
 *
 * @param target - Event target to check.
 * @returns `true` for typing targets.
 *
 * @example
 * const CAN_TYPE = isTypingTarget(event.target);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
function isTypingTarget(target: EventTarget | null) {
  // Rejects targets that are not HTML elements.
  if (!(target instanceof HTMLElement)) {
    return false
  }

  // Checks whether the target accepts editable content.
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

/**
 * @summary
 * Toggles the theme with the `D` keyboard shortcut.
 *
 * @remarks
 * The shortcut ignores typing targets and modified keys.
 * It also ignores repeated and already handled keyboard events.
 *
 * @explanation
 * This component provides a fast theme switching shortcut.
 * It listens for keyboard events and updates the active theme.
 * Use it inside **NextThemesProvider** for global theme control.
 *
 * @returns No rendered content.
 *
 * @example
 * <NextThemesProvider>
 *   <ThemeHotkey />
 * </NextThemesProvider>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
function ThemeHotkey() {
  // Stores the currently resolved theme.
  // Stores the function that changes the active theme.
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    // Handles keyboard events for the theme shortcut.
    function onKeyDown(event: KeyboardEvent) {
      // Ignores handled and repeated keyboard events.
      if (event.defaultPrevented || event.repeat) {
        return
      }

      // Ignores shortcuts with modifier keys.
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      // Accepts only the lowercase `D` key.
      if (event.key.toLowerCase() !== "d") {
        return
      }

      // Ignores keyboard events from typing targets.
      if (isTypingTarget(event.target)) {
        return
      }

      // Switches between the light and dark themes.
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    // Registers the global keyboard event listener.
    window.addEventListener("keydown", onKeyDown)

    return () => {
      // Removes the keyboard event listener on cleanup.
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

/**
 * @summary
 * Exports the application theme provider.
 *
 * @remarks
 * The provider combines theme state with the theme shortcut.
 *
 * @explanation
 * This export provides shared theme behavior to the application.
 * It wraps **NextThemesProvider** and renders **ThemeHotkey**.
 * Use it at the root of the application to manage themes.
 *
 * @returns The configured theme provider.
 *
 * @example
 * <ThemeProvider>{children}</ThemeProvider>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export { ThemeProvider }
