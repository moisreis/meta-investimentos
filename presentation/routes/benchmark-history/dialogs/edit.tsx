"use client"

import { EntityEditDialog } from "@/presentation/parts/dialogs/entity-edit"
import type { EntityEditDialogModel } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import { EntityEditToast } from "@/presentation/parts/toasts/entity-edit-toast"
import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

import { EditBenchmarkHistoryForm } from "../forms/edit"
import {
  BENCHMARK_HISTORY_DIALOG,
  BENCHMARK_HISTORY_FORM,
} from "../settings/labels.settings"

/**
 * Props for the edit rate dialog.
 */
export interface BenchmarkHistoryEditDialogProps {
  dialog: EntityEditDialogModel<BenchmarkHistoryRow>
  benchmarks: BenchmarkRow[]
}

/**
 * @summary
 * Renders the edit rate dialog flow.
 *
 * @remarks
 * Composes the shared edit dialog with the edit form seeded
 * from the target row, and the edit result toast. The indices
 * come from the list itself, so re-opening a row for an edit
 * costs no extra query.
 *
 * @explanation
 * Use as the correction flow of the index history screen, so a
 * rate recorded against the wrong index, the wrong month or a
 * mistyped figure is corrected in place.
 *
 * @param props - Props of the edit rate dialog.
 * @param props.dialog - The edit dialog flow state.
 * @param props.benchmarks - Options of the index field.
 *
 * @returns The edit rate dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function BenchmarkHistoryEditDialog({
  dialog,
  benchmarks,
}: BenchmarkHistoryEditDialogProps) {
  return (
    <>
      <EntityEditDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={BENCHMARK_HISTORY_DIALOG.EDIT_TITLE}
        description={BENCHMARK_HISTORY_DIALOG.EDIT_DESCRIPTION}
      >
        {dialog.target ? (
          <EditBenchmarkHistoryForm
            entry={dialog.target}
            benchmarks={benchmarks}
            onStatusChange={dialog.handleStatusChange}
          />
        ) : null}
      </EntityEditDialog>

      <EntityEditToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={
          BENCHMARK_HISTORY_FORM.UPDATE_SUCCESS_TITLE
        }
        successDescription={
          BENCHMARK_HISTORY_FORM.UPDATE_SUCCESS_DESCRIPTION
        }
        errorTitle={BENCHMARK_HISTORY_FORM.UPDATE_ERROR_TITLE}
      />
    </>
  )
}

export { BenchmarkHistoryEditDialog }
