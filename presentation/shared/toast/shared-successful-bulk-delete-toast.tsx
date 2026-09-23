"use client"

import * as React from "react"

import { toast } from "@/presentation/ui/toast"

export interface SharedSuccessfulBulkDeleteToastProps {
  /** When true, fires the success toast once. */
  show?: boolean
}

/**
 * @summary
 * Shows a toast confirming selected items were removed.
 *
 * @remarks
 * Fires a success toast through the global toast manager when
 * `show` becomes true. Domain agnostic and reusable across
 * entity bulk delete flows.
 *
 * @explanation
 * Render inside a bulk-delete dialog flow and set `show` to true
 * after a successful removal. The component renders no visible
 * output.
 *
 * @param props - Component configuration props.
 * @param props.show - Whether to fire the success toast.
 *
 * @returns A toast-triggering component without visible output.
 *
 * @example
 * <SharedSuccessfulBulkDeleteToast show={hasRemoved} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function SharedSuccessfulBulkDeleteToast({
  show,
}: SharedSuccessfulBulkDeleteToastProps) {
  React.useEffect(() => {
    if (!show) {
      return
    }

    toast.add({
      type: "success",
      title: "Itens removidos com sucesso!",
      description: "Os itens selecionados foram removidos da tabela.",
    })
  }, [show])

  return null
}

export { SharedSuccessfulBulkDeleteToast }