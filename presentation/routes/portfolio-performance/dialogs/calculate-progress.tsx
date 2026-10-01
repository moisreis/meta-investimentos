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

import { usePortfolioPerformanceProgress } from "../hooks/use-portfolio-performance-progress.hook"
import { PORTFOLIO_PERFORMANCE_CALCULATE } from "../settings/labels.settings"
import type { PortfolioPerformanceCalculationProgress } from "../types/portfolio-performance-list.types"

interface PortfolioPerformanceCalculateProgressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job: PortfolioPerformanceCalculationProgress | null
  onDone: () => void
}

/**
 * @summary
 * Renders the portfolio performance calculation progress
 * dialog.
 *
 * @remarks
 * While the calculation runs, shows a determinate
 * progress bar fed by the polled job snapshot plus a
 * status marker with a spinner. On success, shows the
 * aggregated counts; on error, the failure message. The
 * dialog never closes while the calculation is running.
 *
 * @param props - Props of the progress dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.job - The polled job snapshot, or null.
 * @param props.onDone - Finishes and closes the flow.
 *
 * @returns The calculation progress dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioPerformanceCalculateProgressDialog({
  open,
  onOpenChange,
  job,
  onDone,
}: PortfolioPerformanceCalculateProgressDialogProps) {
  const RUNNING = job === null || job.status === "running"
  const FAILED = job?.status === "error"

  const { done, total, summary, warning } =
    usePortfolioPerformanceProgress(job)

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
              ? PORTFOLIO_PERFORMANCE_CALCULATE.PROGRESS_TITLE
              : FAILED
                ? PORTFOLIO_PERFORMANCE_CALCULATE.ERROR_TITLE
                : PORTFOLIO_PERFORMANCE_CALCULATE.SUCCESS_TITLE}
          </DialogTitle>

          <DialogDescription>
            {RUNNING
              ? PORTFOLIO_PERFORMANCE_CALCULATE.PROGRESS_DESCRIPTION
              : FAILED
                ? PORTFOLIO_PERFORMANCE_CALCULATE.ERROR_DESCRIPTION
                : PORTFOLIO_PERFORMANCE_CALCULATE.SUCCESS_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>

        {RUNNING ? (
          <>
            {job ? (
              <EntityJobProgressBar
                label={
                  PORTFOLIO_PERFORMANCE_CALCULATE.PROGRESS_LABEL
                }
                done={done}
                total={total}
              />
            ) : null}

            <EntityStatusMarker tone="running" role="status">
              {
                PORTFOLIO_PERFORMANCE_CALCULATE.PROGRESS_RUNNING_LABEL
              }
            </EntityStatusMarker>
          </>
        ) : FAILED ? (
          <>
            <EntityStatusMarker tone="error">
              {job?.error ??
                PORTFOLIO_PERFORMANCE_CALCULATE.ERROR_DESCRIPTION}
            </EntityStatusMarker>

            <DialogFooter>
              <Button variant="outline" onClick={onDone}>
                {PORTFOLIO_PERFORMANCE_CALCULATE.CLOSE_BUTTON}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <EntityStatusMarker tone="success">
              {
                PORTFOLIO_PERFORMANCE_CALCULATE.SUCCESS_DESCRIPTION
              }
            </EntityStatusMarker>

            <EntityJobProgressSummary counts={summary} />

            {warning ? (
              <EntityStatusMarker tone="warning">
                {warning}
              </EntityStatusMarker>
            ) : null}

            <DialogFooter>
              <Button onClick={onDone}>
                {PORTFOLIO_PERFORMANCE_CALCULATE.DONE_BUTTON}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { PortfolioPerformanceCalculateProgressDialog }
