"use client"

import { EntityAddDialog } from "@/presentation/parts/dialogs/entity-add"
import { EntityAddToast } from "@/presentation/parts/toasts/entity-add-toast"
import type { EntityAddDialogModel } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { AddBenchmarkForm } from "@/presentation/routes/benchmark/forms/add"
import {
  BENCHMARK_DIALOG,
  BENCHMARK_FORM,
} from "@/presentation/routes/benchmark/settings/labels.settings"

import { BenchmarkAddAnotherDialog } from "./add-another"

/**
 * Props for the benchmark add dialog.
 */
export interface BenchmarkAddDialogProps {
  dialog: EntityAddDialogModel
}

/**
 * @summary
 * Renders the benchmark add dialog flow.
 *
 * @remarks
 * Composes the shared add dialog with the add form and
 * the add-another prompt. On success the add-another
 * prompt opens so the user can return to the table or
 * add another benchmark. The result toast fires on both
 * outcomes.
 *
 * @param props - Props of the benchmark add dialog.
 * @param props.dialog - The add dialog flow state.
 *
 * @returns The benchmark add dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BenchmarkAddDialog({
  dialog,
}: BenchmarkAddDialogProps) {
  return (
    <>
      <EntityAddDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={BENCHMARK_DIALOG.ADD_TITLE}
        description={BENCHMARK_DIALOG.ADD_DESCRIPTION}
      >
        <AddBenchmarkForm
          key={dialog.formKey}
          onStatusChange={dialog.handleStatusChange}
        />
      </EntityAddDialog>

      <BenchmarkAddAnotherDialog
        open={dialog.anotherOpen}
        onOpenChange={dialog.handleBackToTable}
        onBack={dialog.handleBackToTable}
        onAddAnother={dialog.handleAddAnother}
      />

      <EntityAddToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={BENCHMARK_FORM.CREATE_SUCCESS_TITLE}
        successDescription={
          BENCHMARK_FORM.CREATE_SUCCESS_DESCRIPTION
        }
        errorTitle={BENCHMARK_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { BenchmarkAddDialog }
