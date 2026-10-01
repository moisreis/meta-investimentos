"use client"

import { EntityAddAnotherDialog } from "@/presentation/parts/dialogs/entity-add-another"
import { BENCHMARK_DIALOG } from "@/presentation/routes/benchmark/settings/labels.settings"

/**
 * Props for the benchmark add-another dialog.
 */
export interface BenchmarkAddAnotherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onAddAnother: () => void
}

/**
 * @summary
 * Renders the benchmark add-another prompt dialog.
 *
 * @remarks
 * Wires the shared add-another dialog with the benchmark
 * copy and the back/add-another handlers.
 *
 * @param props - Props of the benchmark add-another dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.onBack - Back-to-table handler.
 * @param props.onAddAnother - Add-another handler.
 *
 * @returns The benchmark add-another prompt dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BenchmarkAddAnotherDialog({
  open,
  onOpenChange,
  onBack,
  onAddAnother,
}: BenchmarkAddAnotherDialogProps) {
  return (
    <EntityAddAnotherDialog
      open={open}
      onOpenChange={onOpenChange}
      title={BENCHMARK_DIALOG.ADD_ANOTHER_TITLE}
      description={BENCHMARK_DIALOG.ADD_ANOTHER_DESCRIPTION}
      backLabel={BENCHMARK_DIALOG.ADD_ANOTHER_BACK_LABEL}
      anotherLabel={BENCHMARK_DIALOG.ADD_ANOTHER_ANOTHER_LABEL}
      onBack={onBack}
      onAddAnother={onAddAnother}
    />
  )
}

export { BenchmarkAddAnotherDialog }
