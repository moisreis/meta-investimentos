"use client"

import * as React from "react"
import { useTheme } from "next-themes"

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
 * const CAN_TYPE = IsTypingTarget(event.target);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function IsTypingTarget(target: EventTarget | null): boolean {
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
 * It also ignores repeated and already handled keyboard
 * events.
 *
 * @explanation
 * This component provides a fast theme switching shortcut.
 * It listens for keyboard events and updates the active
 * theme. Use it inside **NextThemesProvider** for global
 * theme control.
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
 * @date 2026-09-23
 */
function ThemeHotkey() {
  // Stores the currently resolved theme.
  // Stores the function that changes the active theme.
  const { resolvedTheme: RESOLVED_THEME, setTheme } = useTheme()

  React.useEffect(() => {
    // Handles keyboard events for the theme shortcut.
    function HandleKeyDown(event: KeyboardEvent) {
      // Ignores handled and repeated keyboard events.
      if (event.defaultPrevented || event.repeat) {
        return
      }

      // Ignores shortcuts with modifier keys.
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      // Accepts only the lowercase `D` key.
      // Some events (e.g. media key shortcuts) omit the key.
      const KEY = event.key?.toLowerCase()
      if (KEY !== "d") {
        return
      }

      // Ignores keyboard events from typing targets.
      if (IsTypingTarget(event.target)) {
        return
      }

      // Switches between the light and dark themes.
      setTheme(RESOLVED_THEME === "dark" ? "light" : "dark")
    }

    // Registers the global keyboard event listener.
    window.addEventListener("keydown", HandleKeyDown)

    return () => {
      // Removes the keyboard event listener on cleanup.
      window.removeEventListener("keydown", HandleKeyDown)
    }
  }, [RESOLVED_THEME, setTheme])

  return null
}

export { ThemeHotkey }
