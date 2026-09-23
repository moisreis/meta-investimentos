"use client"

import * as React from "react"

import { toast } from "@/presentation/ui/toast"

export interface SharedErrorBulkDeleteToastProps {
  /** When true, fires the error toast once. */
  show?: boolean
}

/**
 * @summary
 * Shows a toast when the selected items could not be removed.
 *
 * @remarks
 * Fires an error toast through the global toast manager when
 * `show` becomes true. Domain agnostic and reusable across
 * entity bulk delete flows.
 *
 * @explanation
 * Render inside a bulk-delete dialog flow and set `show` to true
 * when the removal callback fails. The component renders no
 * visible output.
 *
 * @param props - Component configuration props.
 * @param props.show - Whether to fire the error toast.
 *
 * @returns A toast-triggering component without visible output.
 *
 * @example
 * <SharedErrorBulkDeleteToast show={hasError} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function SharedErrorBulkDeleteToast({
  show,
}: SharedErrorBulkDeleteToastProps) {
  React.useEffect(() => {
    if (!show) {
      return
    }

    toast.add({
      type: "error",
      title: "Não foi possível remover os itens.",
      description: "Tente novamente.",
    })
  }, [show])

  return null
}

export { SharedErrorBulkDeleteToast }