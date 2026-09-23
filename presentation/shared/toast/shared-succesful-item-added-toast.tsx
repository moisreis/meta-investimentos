"use client"

import * as React from "react"

import { toast } from "@/presentation/ui/toast"

export interface SharedSuccessfulItemAddedToastProps {
  /** When true, fires the success toast once. */
  show?: boolean
}

/**
 * @summary
 * Shows a toast confirming an item was added.
 *
 * @remarks
 * Fires a success toast through the global toast manager when
 * `show` becomes true. Domain agnostic and reusable across
 * entity add flows.
 *
 * @explanation
 * Render inside an add-dialog flow and set `show` to true after
 * a successful add. The component renders no visible output.
 *
 * @param props - Component configuration props.
 * @param props.show - Whether to fire the success toast.
 *
 * @returns A toast-triggering component without visible output.
 *
 * @example
 * <SharedSuccessfulItemAddedToast show={hasAdded} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function SharedSuccessfulItemAddedToast({
  show,
}: SharedSuccessfulItemAddedToastProps) {
  React.useEffect(() => {
    if (!show) {
      return
    }

    toast.add({
      type: "success",
      title: "Item adicionado com sucesso!",
      description: "O item foi adicionado à tabela.",
    })
  }, [show])

  return null
}

export { SharedSuccessfulItemAddedToast }