"use client"

import { EntityAddDialog } from "@/presentation/parts/dialogs/entity-add"
import type { EntityAddDialogModel } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { EntityAddToast } from "@/presentation/parts/toasts/entity-add-toast"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

import { AddBenchmarkHistoryForm } from "../forms/add"
import {
  BENCHMARK_HISTORY_DIALOG,
  BENCHMARK_HISTORY_FORM,
} from "../settings/labels.settings"

import { BenchmarkHistoryAddAnotherDialog } from "./add-another"

/**
 * Props for the record rate dialog.
 */
export interface BenchmarkHistoryAddDialogProps {
  dialog: EntityAddDialogModel
  benchmarks: BenchmarkRow[]
}

/**
 * @summary
 * Renders the record rate dialog flow.
 *
 * @remarks
 * Composes the shared add dialog with the record form and the
 * add-another prompt. On success the add-another prompt opens
 * so the user can return to the table or record the next
 * month, which is how a rate series is usually filled in. The
 * result toast fires on both outcomes.
 *
 * @param props - Props of the record rate dialog.
 * @param props.dialog - The add dialog flow state.
 * @param props.benchmarks - Options of the index field.
 *
 * @returns The record rate dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function BenchmarkHistoryAddDialog({
  dialog,
  benchmarks,
}: BenchmarkHistoryAddDialogProps) {
  return (
    <>
      <EntityAddDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={BENCHMARK_HISTORY_DIALOG.ADD_TITLE}
        description={BENCHMARK_HISTORY_DIALOG.ADD_DESCRIPTION}
      >
        <AddBenchmarkHistoryForm
          key={dialog.formKey}
          benchmarks={benchmarks}
          onStatusChange={dialog.handleStatusChange}
        />
      </EntityAddDialog>

      <BenchmarkHistoryAddAnotherDialog
        open={dialog.anotherOpen}
        onOpenChange={dialog.handleBackToTable}
        onBack={dialog.handleBackToTable}
        onAddAnother={dialog.handleAddAnother}
      />

      <EntityAddToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={
          BENCHMARK_HISTORY_FORM.CREATE_SUCCESS_TITLE
        }
        successDescription={
          BENCHMARK_HISTORY_FORM.CREATE_SUCCESS_DESCRIPTION
        }
        errorTitle={BENCHMARK_HISTORY_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { BenchmarkHistoryAddDialog }
