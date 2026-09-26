"use client"

import { useCallback, useEffect, useState } from "react"
import { endOfDay, startOfDay } from "date-fns"
import { useRouter } from "next/navigation"
import type { DateRange } from "react-day-picker"

import { POSITION_PERFORMANCE_ALL_POSITIONS_VALUE } from "../settings/labels.settings"
import { POSITION_PERFORMANCE_CALCULATE } from "../settings/labels.settings"

import { getPositionPerformanceCalculationProgressAction } from "../actions/get-position-performance-calculation-progress.action"
import { startPositionPerformanceCalculationAction } from "../actions/start-position-performance-calculation.action"
import type { PositionPerformanceCalculationProgress } from "../types/position-performance-list.types"

// Polling interval between progress snapshots.
const CALCULATION_POLL_INTERVAL_MS = 750

/**
 * @summary
 * Coordinates the position performance calculation flow.
 *
 * @remarks
 * Owns the confirm dialog state, the selected position,
 * the selected period, the start action request and the
 * progress polling loop that reads the job snapshot until
 * it reaches a terminal status. Refreshes the router
 * after a successful calculation so the datatable
 * reflects the new rows.
 *
 * @explanation
 * Use as the single source of truth for the calculation
 * dialogs rendered at the list page level.
 *
 * @returns The calculation flow state and handlers.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function usePositionPerformanceCalculation() {
  const ROUTER = useRouter()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [positionId, setPositionId] = useState<string>(
    POSITION_PERFORMANCE_ALL_POSITIONS_VALUE
  )
  const [dateRange, setDateRange] = useState<
    DateRange | undefined
  >(undefined)
  const [starting, setStarting] = useState(false)
  const [startError, setStartError] = useState<string | null>(
    null
  )

  const [jobId, setJobId] = useState<string | null>(null)
  const [job, setJob] =
    useState<PositionPerformanceCalculationProgress | null>(null)
  const [progressOpen, setProgressOpen] = useState(false)

  const handleOpenConfirm = useCallback(() => {
    setPositionId(POSITION_PERFORMANCE_ALL_POSITIONS_VALUE)
    setDateRange(undefined)
    setStartError(null)
    setConfirmOpen(true)
  }, [])

  const handleConfirmOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setStartError(null)
        setConfirmOpen(true)
        return
      }

      setConfirmOpen(false)
    },
    []
  )

  const handlePositionChange = useCallback(
    (nextPositionId: string) => {
      setPositionId(nextPositionId)
      setStartError(null)
    },
    []
  )

  const handleDateRangeChange = useCallback(
    (nextRange: DateRange | undefined) => {
      setDateRange(nextRange)
      setStartError(null)
    },
    []
  )

  const handleConfirm = useCallback(async () => {
    setStartError(null)

    if (!dateRange?.from || !dateRange?.to) {
      setStartError(
        POSITION_PERFORMANCE_CALCULATE.DATE_RANGE_REQUIRED
      )
      return
    }

    setStarting(true)

    try {
      const RESULT =
        await startPositionPerformanceCalculationAction({
          positionId:
            positionId ===
            POSITION_PERFORMANCE_ALL_POSITIONS_VALUE
              ? null
              : positionId,
          from: startOfDay(dateRange.from)
            .toISOString()
            .slice(0, 10),
          to: endOfDay(dateRange.to).toISOString().slice(0, 10),
        })

      if (!RESULT.success) {
        setStartError(RESULT.error)
        return
      }

      setJobId(RESULT.data)
      setJob(null)
      setConfirmOpen(false)
      setProgressOpen(true)
    } finally {
      setStarting(false)
    }
  }, [positionId, dateRange])

  useEffect(() => {
    if (!jobId) return

    let active = true
    let timer: number | null = null

    const TICK = async () => {
      const RESULT =
        await getPositionPerformanceCalculationProgressAction({
          jobId,
        })

      if (!active) return

      if (!RESULT.success) return

      const NEXT = RESULT.data

      if (!NEXT) {
        setJob(null)
        setJobId(null)
        setProgressOpen(false)
        return
      }

      setJob(NEXT)

      if (NEXT.status !== "running") {
        active = false
        if (timer !== null) window.clearInterval(timer)

        if (NEXT.status === "success") {
          ROUTER.refresh()
        }
      }
    }

    void TICK()
    timer = window.setInterval(
      () => void TICK(),
      CALCULATION_POLL_INTERVAL_MS
    )

    return () => {
      active = false
      if (timer !== null) window.clearInterval(timer)
    }
  }, [jobId, ROUTER])

  const handleClose = useCallback(() => {
    setProgressOpen(false)
    setJob(null)
    setJobId(null)
  }, [])

  const handleProgressOpenChange = useCallback(
    (open: boolean) => {
      const RUNNING = job === null || job.status === "running"

      if (!open && RUNNING) return

      handleClose()
    },
    [job, handleClose]
  )

  return {
    confirmOpen,
    handleConfirmOpenChange,
    positionId,
    handlePositionChange,
    dateRange,
    handleDateRangeChange,
    starting,
    startError,
    handleOpenConfirm,
    handleConfirm,
    progressOpen,
    handleProgressOpenChange,
    job,
    handleClose,
  }
}

export { usePositionPerformanceCalculation }
