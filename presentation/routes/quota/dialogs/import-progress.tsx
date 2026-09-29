"use client"

import {
  IconAlertCircle,
  IconCircleCheck,
  IconLoader,
} from "@tabler/icons-react"

import { FormatCount } from "@/presentation/presenters/count.presenter"
import { Button } from "@/presentation/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/presentation/ui/dialog"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@/presentation/ui/marker"
import {
  Progress,
  ProgressValue,
} from "@/presentation/ui/progress"

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

  const PERCENT =
    job && job.monthsTotal > 0
      ? Math.round((job.monthsDone / job.monthsTotal) * 100)
      : 0

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && RUNNING) return
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              <Progress
                value={PERCENT}
                aria-label="Progresso da importação"
              >
                <ProgressValue>
                  {(_formattedValue, value) =>
                    `${job.monthsDone}/${job.monthsTotal} · ${
                      value ?? 0
                    }%`
                  }
                </ProgressValue>
              </Progress>
            ) : null}

            <Marker role="status">
              <MarkerIcon>
                <IconLoader className="animate-spin" />
              </MarkerIcon>
              <MarkerContent>
                {QUOTA_IMPORT.PROGRESS_RUNNING_LABEL}
              </MarkerContent>
            </Marker>
          </>
        ) : FAILED ? (
          <>
            <Marker>
              <MarkerIcon>
                <IconAlertCircle className="text-destructive" />
              </MarkerIcon>
              <MarkerContent>
                {job?.error ?? QUOTA_IMPORT.ERROR_DESCRIPTION}
              </MarkerContent>
            </Marker>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onDone}>
                {QUOTA_IMPORT.CLOSE_BUTTON}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Marker>
              <MarkerIcon>
                <IconCircleCheck className="text-primary" />
              </MarkerIcon>
              <MarkerContent>
                {QUOTA_IMPORT.SUCCESS_DESCRIPTION}
              </MarkerContent>
            </Marker>

            <Marker>
              <MarkerContent>
                {FormatCount(job?.rowsImported ?? 0)}{" "}
                {QUOTA_IMPORT.ROWS_IMPORTED_LABEL} ·{" "}
                {FormatCount(job?.skipped ?? 0)}{" "}
                {QUOTA_IMPORT.SKIPPED_LABEL}
              </MarkerContent>
            </Marker>

            <div className="flex justify-end gap-2">
              <Button onClick={onDone}>
                {QUOTA_IMPORT.DONE_BUTTON}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { QuotaImportProgressDialog }
