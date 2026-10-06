"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import type { EntityReverseToastStatus } from "@/presentation/parts/toasts/entity-reverse-toast"
import type { ActionResult } from "@/presentation/presenters/action-result.presenter"
import { reverseApplicationAction } from "@/presentation/routes/application/actions/reverse-application.action"
import { reverseWithdrawalAction } from "@/presentation/routes/withdrawal/actions/reverse-withdrawal.action"
import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"

/**
 * View model of the row actions for portfolio activity.
 */
export interface PortfolioActivityRowActionsModel {
  handleReverse: (row: PortfolioActivityRow) => void
  handleConfirmReverse: () => Promise<void>
  reverseTarget: PortfolioActivityRow | null
  reverseOpen: boolean
  reversePending: boolean
  reverseStatus: EntityReverseToastStatus
  reverseError: string | null
  setReverseOpen: (open: boolean) => void
}

/**
 * @summary
 * Manages the reverse row action for portfolio activity.
 *
 * @remarks
 * Handles both application and withdrawal reversals by
 * dispatching to the appropriate server action based on
 * the movement kind. Owns the confirm dialog state and
 * the reverse result toast status.
 *
 * @returns The row actions and the dialog state.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-04
 */
export function usePortfolioActivityRowActions(): PortfolioActivityRowActionsModel {
  const ROUTER = useRouter()
  const [REVERSE_TARGET, setReverseTarget] =
    useState<PortfolioActivityRow | null>(null)
  const [REVERSE_PENDING, setReversePending] = useState(false)
  const [REVERSE_STATUS, setReverseStatus] =
    useState<EntityReverseToastStatus>("idle")
  const [REVERSE_ERROR, setReverseError] = useState<
    string | null
  >(null)

  const HandleReverse = useCallback(
    (row: PortfolioActivityRow) => {
      setReverseTarget(row)
      setReverseStatus("idle")
      setReverseError(null)
    },
    []
  )

  const HandleConfirmReverse = useCallback(async () => {
    if (!REVERSE_TARGET) return

    setReversePending(true)
    const RESULT: ActionResult<undefined> =
      REVERSE_TARGET.kind === "application"
        ? await reverseApplicationAction({
            applicationId: REVERSE_TARGET.id,
          })
        : await reverseWithdrawalAction({
            withdrawalId: REVERSE_TARGET.id,
          })
    setReversePending(false)

    if (!RESULT.success) {
      setReverseError(RESULT.error)
      setReverseStatus("error")
      setReverseTarget(null)
      return
    }

    setReverseStatus("success")
    setReverseTarget(null)
    ROUTER.refresh()
  }, [REVERSE_TARGET, ROUTER])

  const UpdateReverseOpen = useCallback((open: boolean) => {
    if (!open) {
      setReverseTarget(null)
      setReverseStatus("idle")
      setReverseError(null)
    }
  }, [])

  return {
    handleReverse: HandleReverse,
    handleConfirmReverse: HandleConfirmReverse,
    reverseTarget: REVERSE_TARGET,
    reverseOpen: REVERSE_TARGET !== null,
    reversePending: REVERSE_PENDING,
    reverseStatus: REVERSE_STATUS,
    reverseError: REVERSE_ERROR,
    setReverseOpen: UpdateReverseOpen,
  }
}
