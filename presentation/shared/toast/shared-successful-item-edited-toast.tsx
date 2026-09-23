"use client"

import * as React from "react"

import { toast } from "@/presentation/ui/toast"

export interface SharedSuccessfulItemEditedToastProps {
  /** When true, fires the success toast once. */
  show?: boolean
}

/**
 * @summary
 * Shows a toast confirming an item was edited.
 *
 * @remarks
 * Fires a success toast through the global toast manager when
 * `show` becomes true. Domain agnostic and reusable across
 * entity edit flows.
 *
 * @explanation
 * Render inside an edit-dialog flow and set `show` to true after
 * a successful edit. The component renders no visible output.
 *
 * @param props - Component configuration props.
 * @param props.show - Whether to fire the success toast.
 *
 * @returns A toast-triggering component without visible output.
 *
 * @example
 * <SharedSuccessfulItemEditedToast show={hasEdited} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function SharedSuccessfulItemEditedToast({
  show,
}: SharedSuccessfulItemEditedToastProps) {
  React.useEffect(() => {
    if (!show) {
      return
    }

    toast.add({
      type: "success",
      title: "Item editado com sucesso!",
      description: "O item foi atualizado na tabela.",
    })
  }, [show])

  return null
}

export { SharedSuccessfulItemEditedToast }