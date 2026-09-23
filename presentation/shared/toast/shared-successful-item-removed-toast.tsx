"use client"

import * as React from "react"

import { toast } from "@/presentation/ui/toast"

export interface SharedSuccessfulItemRemovedToastProps {
  /** When true, fires the success toast once. */
  show?: boolean
}

/**
 * @summary
 * Shows a toast confirming an item was removed.
 *
 * @remarks
 * Fires a success toast through the global toast manager when
 * `show` becomes true. Domain agnostic and reusable across
 * entity delete flows.
 *
 * @explanation
 * Render inside a delete-dialog flow and set `show` to true after
 * a successful removal. The component renders no visible output.
 *
 * @param props - Component configuration props.
 * @param props.show - Whether to fire the success toast.
 *
 * @returns A toast-triggering component without visible output.
 *
 * @example
 * <SharedSuccessfulItemRemovedToast show={hasRemoved} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function SharedSuccessfulItemRemovedToast({
  show,
}: SharedSuccessfulItemRemovedToastProps) {
  React.useEffect(() => {
    if (!show) {
      return
    }

    toast.add({
      type: "success",
      title: "Item removido com sucesso!",
      description: "O item foi removido da tabela.",
    })
  }, [show])

  return null
}

export { SharedSuccessfulItemRemovedToast }