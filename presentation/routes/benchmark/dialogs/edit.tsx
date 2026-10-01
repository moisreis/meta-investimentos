"use client"

import { EntityEditDialog } from "@/presentation/parts/dialogs/entity-edit"
import { EntityEditToast } from "@/presentation/parts/toasts/entity-edit-toast"
import type { EntityEditDialogModel } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"
import { EditBenchmarkForm } from "@/presentation/routes/benchmark/forms/edit"
import {
  BENCHMARK_DIALOG,
  BENCHMARK_FORM,
} from "@/presentation/routes/benchmark/settings/labels.settings"

/**
 * Props for the benchmark edit dialog.
 */
export interface BenchmarkEditDialogProps {
  dialog: EntityEditDialogModel<BenchmarkRow>
}

/**
 * @summary
 * Renders the benchmark edit dialog flow.
 *
 * @remarks
 * Composes the shared edit dialog with the edit form
 * seeded from the target row. The result toast fires on
 * success or error; on success the dialog closes and the
 * server data refreshes.
 *
 * @param props - Props of the benchmark edit dialog.
 * @param props.dialog - The edit dialog flow state.
 *
 * @returns The benchmark edit dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BenchmarkEditDialog({
  dialog,
}: BenchmarkEditDialogProps) {
  return (
    <>
      <EntityEditDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={BENCHMARK_DIALOG.EDIT_TITLE}
        description={BENCHMARK_DIALOG.EDIT_DESCRIPTION}
      >
        {dialog.target ? (
          <EditBenchmarkForm
            benchmark={dialog.target}
            onStatusChange={dialog.handleStatusChange}
          />
        ) : null}
      </EntityEditDialog>

      <EntityEditToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={BENCHMARK_FORM.UPDATE_SUCCESS_TITLE}
        successDescription={
          BENCHMARK_FORM.UPDATE_SUCCESS_DESCRIPTION
        }
        errorTitle={BENCHMARK_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { BenchmarkEditDialog }
