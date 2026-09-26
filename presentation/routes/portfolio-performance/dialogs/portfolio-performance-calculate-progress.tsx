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

  const UNITS_TOTAL = job
    ? job.portfolioCount * job.daysTotal
    : 0

  const PERCENT =
    job && UNITS_TOTAL > 0
      ? Math.round((job.calculated / UNITS_TOTAL) * 100)
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
              <Progress
                value={PERCENT}
                aria-label="Progresso do cálculo"
              >
                <ProgressValue>
                  {(_formattedValue, value) =>
                    `${job.calculated}/${UNITS_TOTAL} · ${
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
                {
                  PORTFOLIO_PERFORMANCE_CALCULATE.PROGRESS_RUNNING_LABEL
                }
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
                {job?.error ??
                  PORTFOLIO_PERFORMANCE_CALCULATE.ERROR_DESCRIPTION}
              </MarkerContent>
            </Marker>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onDone}>
                {PORTFOLIO_PERFORMANCE_CALCULATE.CLOSE_BUTTON}
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
                {
                  PORTFOLIO_PERFORMANCE_CALCULATE.SUCCESS_DESCRIPTION
                }
              </MarkerContent>
            </Marker>

            <Marker>
              <MarkerContent>
                {FormatCount(job?.calculated ?? 0)}{" "}
                {
                  PORTFOLIO_PERFORMANCE_CALCULATE.CALCULATED_LABEL
                }{" "}
                · {FormatCount(job?.portfolioCount ?? 0)}{" "}
                {
                  PORTFOLIO_PERFORMANCE_CALCULATE.PORTFOLIOS_LABEL
                }
              </MarkerContent>
            </Marker>

            <div className="flex justify-end gap-2">
              <Button onClick={onDone}>
                {PORTFOLIO_PERFORMANCE_CALCULATE.DONE_BUTTON}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { PortfolioPerformanceCalculateProgressDialog }
