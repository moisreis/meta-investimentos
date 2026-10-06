"use client"

import { EntityConfirmDeleteDialog } from "@/presentation/parts/dialogs/entity-confirm-delete"
import { EntityDeleteToast } from "@/presentation/parts/toasts/entity-delete-toast"

import { useBenchmarkHistoryRowActions } from "../hooks/use-benchmark-history-row-actions.hook"
import {
  BENCHMARK_HISTORY_DATATABLE,
  FormatDeleteBenchmarkHistoryDescription,
} from "../settings/labels.settings"

/**
 * Props for the index rate confirm-delete dialog.
 */
export interface BenchmarkHistoryConfirmDeleteDialogProps {
  dialog: ReturnType<typeof useBenchmarkHistoryRowActions>
}

/**
 * @summary
 * Renders the index rate confirm-delete dialog flow.
 *
 * @remarks
 * Composes the shared confirm-delete dialog with the index
 * history copy and the delete result toast. The description
 * names the entry by its index and its month, which is the pair
 * that makes an entry unique.
 *
 * @param props - Props of the confirm-delete dialog.
 * @param props.dialog - The row actions flow state.
 *
 * @returns The index rate confirm-delete dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function BenchmarkHistoryConfirmDeleteDialog({
  dialog,
}: BenchmarkHistoryConfirmDeleteDialogProps) {
  return (
    <>
      <EntityConfirmDeleteDialog
        open={dialog.deleteOpen}
        onOpenChange={dialog.setDeleteOpen}
        title={BENCHMARK_HISTORY_DATATABLE.DELETE_TITLE}
        description={
          dialog.deleteTarget
            ? FormatDeleteBenchmarkHistoryDescription(
                dialog.deleteTarget.benchmarkAcronym,
                dialog.deleteTarget.date
              )
            : ""
        }
        confirmLabel={
          BENCHMARK_HISTORY_DATATABLE.DELETE_CONFIRM_LABEL
        }
        cancelLabel={
          BENCHMARK_HISTORY_DATATABLE.DELETE_CANCEL_LABEL
        }
        pending={dialog.deletePending}
        onConfirm={dialog.handleConfirmDelete}
      />

      <EntityDeleteToast
        status={dialog.deleteStatus}
        errorMessage={dialog.deleteError}
        successTitle={
          BENCHMARK_HISTORY_DATATABLE.DELETE_SUCCESS_TITLE
        }
        successDescription={
          BENCHMARK_HISTORY_DATATABLE.DELETE_SUCCESS_DESCRIPTION
        }
        errorTitle={
          BENCHMARK_HISTORY_DATATABLE.DELETE_ERROR_TITLE
        }
      />
    </>
  )
}

export { BenchmarkHistoryConfirmDeleteDialog }
