"use client"

import { EntityAddAnotherDialog } from "@/presentation/parts/dialogs/entity-add-another"

import { BENCHMARK_HISTORY_DIALOG } from "../settings/labels.settings"

/**
 * Props for the record rate add-another dialog.
 */
export interface BenchmarkHistoryAddAnotherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onAddAnother: () => void
}

/**
 * @summary
 * Renders the record rate add-another prompt dialog.
 *
 * @remarks
 * Wires the shared add-another dialog with the history copy
 * and the back/add-another handlers.
 *
 * @param props - Props of the add-another dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.onBack - Back-to-table handler.
 * @param props.onAddAnother - Add-another handler.
 *
 * @returns The record rate add-another prompt dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function BenchmarkHistoryAddAnotherDialog({
  open,
  onOpenChange,
  onBack,
  onAddAnother,
}: BenchmarkHistoryAddAnotherDialogProps) {
  return (
    <EntityAddAnotherDialog
      open={open}
      onOpenChange={onOpenChange}
      title={BENCHMARK_HISTORY_DIALOG.ADD_ANOTHER_TITLE}
      description={
        BENCHMARK_HISTORY_DIALOG.ADD_ANOTHER_DESCRIPTION
      }
      backLabel={BENCHMARK_HISTORY_DIALOG.ADD_ANOTHER_BACK_LABEL}
      anotherLabel={
        BENCHMARK_HISTORY_DIALOG.ADD_ANOTHER_ANOTHER_LABEL
      }
      onBack={onBack}
      onAddAnother={onAddAnother}
    />
  )
}

export { BenchmarkHistoryAddAnotherDialog }
