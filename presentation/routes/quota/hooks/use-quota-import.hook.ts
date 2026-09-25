"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import type { CvmImportWindow } from "@/services/quota/use-cases/import-fund-valuations.use-case"

import { getQuotaImportProgressAction } from "../actions/get-quota-import-progress.action"
import { startQuotaImportAction } from "../actions/start-quota-import.action"
import type { QuotaImportProgress } from "../types/quota-list.types"

// Polling interval between progress snapshots.
const IMPORT_POLL_INTERVAL_MS = 750

/**
 * @summary
 * Coordinates the quota import flow.
 *
 * @remarks
 * Owns the confirm dialog state, the selected window, the
 * start action request and the progress polling loop that
 * reads the job snapshot until it reaches a terminal
 * status. Refreshes the router after a successful import
 * so the datatable reflects the new rows.
 *
 * @explanation
 * Use as the single source of truth for the quota import
 * dialogs rendered at the list page level.
 *
 * @returns The import flow state and handlers.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useQuotaImport() {
  const ROUTER = useRouter()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [importWindow, setImportWindow] =
    useState<CvmImportWindow>("month")
  const [starting, setStarting] = useState(false)
  const [startError, setStartError] = useState<string | null>(
    null
  )

  const [jobId, setJobId] = useState<string | null>(null)
  const [job, setJob] = useState<QuotaImportProgress | null>(
    null
  )
  const [progressOpen, setProgressOpen] = useState(false)

  const handleOpenConfirm = useCallback(() => {
    setImportWindow("month")
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

  const handleWindowChange = useCallback(
    (nextWindow: CvmImportWindow) => {
      setImportWindow(nextWindow)
      setStartError(null)
    },
    []
  )

  const handleConfirm = useCallback(async () => {
    setStartError(null)
    setStarting(true)

    try {
      const RESULT = await startQuotaImportAction({
        window: importWindow,
      })

      if (RESULT.error || !RESULT.jobId) {
        setStartError(
          RESULT.error ??
            "Não foi possível iniciar a importação."
        )
        return
      }

      setJobId(RESULT.jobId)
      setJob(null)
      setConfirmOpen(false)
      setProgressOpen(true)
    } finally {
      setStarting(false)
    }
  }, [importWindow])

  useEffect(() => {
    if (!jobId) return

    let active = true
    let timer: number | null = null

    const TICK = async () => {
      const NEXT = await getQuotaImportProgressAction({ jobId })

      if (!active) return

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
      IMPORT_POLL_INTERVAL_MS
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
    window: importWindow,
    handleWindowChange,
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

export { useQuotaImport }
