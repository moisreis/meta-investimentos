"use client"

import { Button } from "@/presentation/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/ui/dialog"

import { EntityJobProgressBar } from "@/presentation/parts/dialogs/entity-job-progress-bar"
import { EntityJobProgressSummary } from "@/presentation/parts/dialogs/entity-job-progress-summary"
import { EntityStatusMarker } from "@/presentation/parts/dialogs/entity-status-marker"

import { FormatCount } from "@/presentation/presenters/count.presenter"

import { QUOTA_IMPORT } from "../settings/labels.settings"
import type { QuotaImportProgress } from "../types/quota-list.types"

interface QuotaImportProgressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job: QuotaImportProgress | null
  onDone: () => void
}

/**
 * @summary
 * Renders the quota import progress dialog.
 *
 * @remarks
 * While the import runs, shows a determinate progress
 * bar fed by the polled job snapshot plus a status
 * marker with a spinner. On success, shows the
 * aggregated counts; on error, the failure message.
 * The dialog never closes while the import is running.
 *
 * @param props - Props of the progress dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.job - The polled job snapshot, or null.
 * @param props.onDone - Finishes and closes the flow.
 *
 * @returns The quota import progress dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function QuotaImportProgressDialog({
  open,
  onOpenChange,
  job,
  onDone,
}: QuotaImportProgressDialogProps) {
  const RUNNING = job === null || job.status === "running"
  const FAILED = job?.status === "error"

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen || !RUNNING) onOpenChange(nextOpen)
      }}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {RUNNING
              ? QUOTA_IMPORT.PROGRESS_TITLE
              : FAILED
                ? QUOTA_IMPORT.ERROR_TITLE
                : QUOTA_IMPORT.SUCCESS_TITLE}
          </DialogTitle>

          <DialogDescription>
            {RUNNING
              ? QUOTA_IMPORT.PROGRESS_DESCRIPTION
              : FAILED
                ? QUOTA_IMPORT.ERROR_DESCRIPTION
                : QUOTA_IMPORT.SUCCESS_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>

        {RUNNING ? (
          <>
            {job ? (
              <EntityJobProgressBar
                label={QUOTA_IMPORT.PROGRESS_LABEL}
                done={job.monthsDone}
                total={job.monthsTotal}
              />
            ) : null}

            <EntityStatusMarker tone="running" role="status">
              {QUOTA_IMPORT.PROGRESS_RUNNING_LABEL}
            </EntityStatusMarker>
          </>
        ) : FAILED ? (
          <>
            <EntityStatusMarker tone="error">
              {job?.error ?? QUOTA_IMPORT.ERROR_DESCRIPTION}
            </EntityStatusMarker>

            <DialogFooter>
              <Button variant="outline" onClick={onDone}>
                {QUOTA_IMPORT.CLOSE_BUTTON}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <EntityStatusMarker tone="success">
              {QUOTA_IMPORT.SUCCESS_DESCRIPTION}
            </EntityStatusMarker>

            <EntityJobProgressSummary
              counts={[
                {
                  value: FormatCount(job?.rowsImported ?? 0),
                  label: QUOTA_IMPORT.ROWS_IMPORTED_LABEL,
                },
                {
                  value: FormatCount(job?.skipped ?? 0),
                  label: QUOTA_IMPORT.SKIPPED_LABEL,
                },
              ]}
            />

            <DialogFooter>
              <Button onClick={onDone}>
                {QUOTA_IMPORT.DONE_BUTTON}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { QuotaImportProgressDialog }
