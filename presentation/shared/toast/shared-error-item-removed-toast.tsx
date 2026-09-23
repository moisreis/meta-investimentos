"use client"

import * as React from "react"

import { toast } from "@/presentation/ui/toast"

export interface SharedErrorItemRemovedToastProps {
  /** When true, fires the error toast once. */
  show?: boolean
}

/**
 * @summary
 * Shows a toast when an item could not be removed.
 *
 * @remarks
 * Fires an error toast through the global toast manager when
 * `show` becomes true. Domain agnostic and reusable across
 * entity delete flows.
 *
 * @explanation
 * Render inside a delete-dialog flow and set `show` to true when
 * the removal callback fails. The component renders no visible
 * output.
 *
 * @param props - Component configuration props.
 * @param props.show - Whether to fire the error toast.
 *
 * @returns A toast-triggering component without visible output.
 *
 * @example
 * <SharedErrorItemRemovedToast show={hasError} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function SharedErrorItemRemovedToast({
  show,
}: SharedErrorItemRemovedToastProps) {
  React.useEffect(() => {
    if (!show) {
      return
    }

    toast.add({
      type: "error",
      title: "Não foi possível remover o item.",
      description: "Tente novamente.",
    })
  }, [show])

  return null
}

export { SharedErrorItemRemovedToast }