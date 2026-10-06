// The commands the main palette runs: one entry per dialog it
// can open, carrying the copy it renders, the shortcut that
// fires it and the route that owns the dialog. The trigger
// binds the shortcuts from here, the palette renders the rows
// from here and a route consumer matches the id it was handed,
// so an id, a path or a shortcut is spelled exactly once.

// Search param a command travels by. The trigger reaches a
// route it may not import by pushing `path?command=<id>`; the
// screen that owns the dialog matches the id, opens once and
// drops the param, which is what keeps the shell and the route
// decoupled.
export const MAIN_COMMAND_PARAM = "command"

/**
 * @summary
 * Identifies one command of the main palette.
 *
 * @remarks
 * Doubles as the value the `command` search param carries, so
 * a route consumer answers for its own dialog without the
 * shell ever naming a dialog it cannot import.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export type MainCommandId =
  | "add-application"
  | "add-withdrawal"
  | "generate-statement"
  | "calculate-performance"
  | "import-quotas"

/**
 * @summary
 * One command as the palette renders it and the trigger fires
 * it.
 *
 * @remarks
 * `path` is the route that owns the dialog rather than a
 * destination on its own: the row navigates there carrying
 * `id`, and the screen opens the dialog when it sees its own
 * id in the param.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export interface MainCommandSetting {
  // Id the route consumer matches against the search param.
  id: MainCommandId
  // Copy the palette row renders.
  label: string
  // Letter pressed with Ctrl or Cmd, lower case.
  shortcutKey: string
  // Shortcut as the palette spells it.
  shortcutLabel: string
  // Route that owns the dialog this command opens.
  path: string
}

// The commands, in the order the palette lists them.
export const MAIN_COMMANDS: readonly MainCommandSetting[] = [
  {
    id: "add-application",
    label: "Registrar aplicação",
    shortcutKey: "a",
    shortcutLabel: "Ctrl + A",
    path: "/application",
  },
  {
    id: "add-withdrawal",
    label: "Registrar resgate",
    shortcutKey: "r",
    shortcutLabel: "Ctrl + R",
    path: "/withdrawal",
  },
  {
    id: "generate-statement",
    label: "Gerar relatório",
    shortcutKey: "s",
    shortcutLabel: "Ctrl + S",
    path: "/statement",
  },
  {
    id: "calculate-performance",
    label: "Recalcular performance",
    shortcutKey: "p",
    shortcutLabel: "Ctrl + P",
    path: "/portfolio-performance",
  },
  {
    id: "import-quotas",
    label: "Importar cotas",
    shortcutKey: "q",
    shortcutLabel: "Ctrl + Q",
    path: "/quota",
  },
]
