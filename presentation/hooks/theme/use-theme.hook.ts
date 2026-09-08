"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * Resolves the initial theme from storage, falling back to the user's
 * system preference and finally to the light theme.
 */
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const STORED = window.localStorage.getItem(STORAGE_KEY);
  if (STORED === "light" || STORED === "dark") return STORED;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Controls the application theme.
 *
 * The dark theme is applied by toggling the `dark` class on the document
 * root, matching the class-based Tailwind dark variant used across the
 * stylesheets. The current theme is persisted in `localStorage` so it
 * survives reloads.
 */
export function useTheme() {
  const [THEME, SET_THEME_STATE] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", THEME === "dark");
    window.localStorage.setItem(STORAGE_KEY, THEME);
  }, [THEME]);

  const SET_THEME = useCallback((theme: Theme) => SET_THEME_STATE(theme), []);

  const TOGGLE_THEME = useCallback(
    () => SET_THEME_STATE((current) => (current === "dark" ? "light" : "dark")),
    [],
  );

  return { THEME, SET_THEME, TOGGLE_THEME };
}
