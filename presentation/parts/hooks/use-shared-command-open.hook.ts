"use client"

import * as React from "react"
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"

import { MAIN_COMMAND_PARAM } from "@/presentation/parts/layout/main/main-command.settings"
import type { MainCommandId } from "@/presentation/parts/layout/main/main-command.settings"

/**
 * @summary
 * Opens a screen's dialog when the shell dispatches the
 * command that stands for it.
 *
 * @remarks
 * The shell reaches a route it may not import by pushing that
 * route's own path with `?command=<id>`. The screen owning the
 * dialog calls this hook naming the id it answers to; the hook
 * matches the param, invokes the open handler once and strips
 * the param with a replace, so a reload or a back navigation
 * does not reopen a dialog the user already dismissed.
 *
 * The handler is read through a ref and the param is compared
 * by value, so the effect fires on the commit that carries the
 * command and stays quiet for every later render that merely
 * rebuilt the callback.
 *
 * @explanation
 * Use beside the dialog model a route hook owns, naming the
 * same id the command registry lists for that route. Keeping
 * the call next to the dialog is what lets the shell stay
 * ignorant of which screen answers which command.
 *
 * @param commandId - The command this screen answers for.
 * @param onOpen - Opens the dialog the command stands for.
 *
 * @returns Nothing; the command is consumed as a side effect.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
function useSharedCommandOpen(
  commandId: MainCommandId,
  onOpen: () => void
) {
  const ROUTER = useRouter()
  const PATHNAME = usePathname()
  const SEARCH_PARAMS = useSearchParams()
  const PENDING = SEARCH_PARAMS.get(MAIN_COMMAND_PARAM)
  const ON_OPEN = React.useRef(onOpen)

  // Keep the ref on the current handler, so the command effect
  // below may fire on the commit that carries the param even
  // when the caller rebuilt the callback since last render.
  React.useEffect(() => {
    ON_OPEN.current = onOpen
  })

  React.useEffect(() => {
    if (PENDING !== commandId) return

    ON_OPEN.current()

    // Replace rather than push, and keep whatever else the URL
    // already carried: consuming a command is not a
    // navigation, it is the tail of the one that brought it.
    const NEXT = new URLSearchParams(SEARCH_PARAMS.toString())
    NEXT.delete(MAIN_COMMAND_PARAM)
    const QUERY = NEXT.toString()

    ROUTER.replace(QUERY ? `${PATHNAME}?${QUERY}` : PATHNAME, {
      scroll: false,
    })
  }, [PENDING, commandId, PATHNAME, ROUTER, SEARCH_PARAMS])
}

export { useSharedCommandOpen }
