"use client"

import { EntityConfirmReverseDialog } from "@/presentation/parts/dialogs/entity-confirm-reverse"
import { EntityReverseToast } from "@/presentation/parts/toasts/entity-reverse-toast"
import { FormatPositionLookup } from "@/presentation/presenters/lookup.presenter"
import { FormatReversePortfolioActivityDescription } from "@/presentation/routes/portfolio/settings/labels.settings"
import { PORTFOLIO_ACTIVITY } from "@/presentation/routes/portfolio/settings/labels.settings"

import type { PortfolioActivityRowActionsModel } from "../hooks/use-portfolio-activity-row-actions.hook"

/**
 * Props for the portfolio activity confirm-reverse dialog.
 */
export interface PortfolioActivityConfirmReverseDialogProps {
  dialog: PortfolioActivityRowActionsModel
}

/**
 * @summary
 * Renders the portfolio activity confirm-reverse dialog flow.
 *
 * @remarks
 * Composes the shared confirm-reverse dialog with the
 * portfolio activity copy and the reverse result toast.
 * The description resolves the target fund and portfolio
 * names through the lookup presenter when possible.
 *
 * @param props - Props of the confirm-reverse dialog.
 * @param props.dialog - The row actions flow state.
 *
 * @returns The portfolio activity confirm-reverse dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-21
 */
function PortfolioActivityConfirmReverseDialog({
  dialog,
}: PortfolioActivityConfirmReverseDialogProps) {
  const TARGET = dialog.reverseTarget

  const LOOKUP_LABEL = TARGET
    ? FormatPositionLookup({
        fundName: TARGET.fundName,
      })
    : ""

  return (
    <>
      <EntityConfirmReverseDialog
        open={dialog.reverseOpen}
        onOpenChange={dialog.setReverseOpen}
        title={PORTFOLIO_ACTIVITY.REVERSE_TITLE}
        description={
          LOOKUP_LABEL
            ? FormatReversePortfolioActivityDescription(
                LOOKUP_LABEL
              )
            : ""
        }
        confirmLabel={PORTFOLIO_ACTIVITY.REVERSE_CONFIRM_LABEL}
        cancelLabel={PORTFOLIO_ACTIVITY.REVERSE_CANCEL_LABEL}
        pending={dialog.reversePending}
        onConfirm={dialog.handleConfirmReverse}
      />

      <EntityReverseToast
        status={dialog.reverseStatus}
        errorMessage={dialog.reverseError}
        successTitle={PORTFOLIO_ACTIVITY.REVERSE_SUCCESS_TITLE}
        successDescription={
          PORTFOLIO_ACTIVITY.REVERSE_SUCCESS_DESCRIPTION
        }
        errorTitle={PORTFOLIO_ACTIVITY.REVERSE_ERROR_TITLE}
      />
    </>
  )
}

export { PortfolioActivityConfirmReverseDialog }
