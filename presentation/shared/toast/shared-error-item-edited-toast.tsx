"use client"

import * as React from "react"

import { toast } from "@/presentation/ui/toast"

export interface SharedErrorItemEditedToastProps {
  /** When true, fires the error toast once. */
  show?: boolean
}

/**
 * @summary
 * Shows a toast when an item could not be edited.
 *
 * @remarks
 * Fires an error toast through the global toast manager when
 * `show` becomes true. Domain agnostic and reusable across
 * entity edit flows.
 *
 * @explanation
 * Render inside an edit-dialog flow and set `show` to true when
 * the persistence callback fails. The component renders no
 * visible output.
 *
 * @param props - Component configuration props.
 * @param props.show - Whether to fire the error toast.
 *
 * @returns A toast-triggering component without visible output.
 *
 * @example
 * <SharedErrorItemEditedToast show={hasError} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function SharedErrorItemEditedToast({
  show,
}: SharedErrorItemEditedToastProps) {
  React.useEffect(() => {
    if (!show) {
      return
    }

    toast.add({
      type: "error",
      title: "Não foi possível editar o item.",
      description: "Verifique os dados e tente novamente.",
    })
  }, [show])

  return null
}

export { SharedErrorItemEditedToast }