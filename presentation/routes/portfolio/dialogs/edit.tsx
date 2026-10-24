"use client"

import { useRouter } from "next/navigation"

import { EntityEditDialog } from "@/presentation/parts/dialogs/entity-edit"
import { EntityEditToast } from "@/presentation/parts/toasts/entity-edit-toast"
import type { EntityEditDialogModel } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import { EditPortfolioForm } from "@/presentation/routes/portfolio/forms/edit"
import {
  PORTFOLIO_DIALOG,
  PORTFOLIO_FORM,
} from "@/presentation/routes/portfolio/settings/labels.settings"
import type { NormOptionRegistry } from "@/presentation/types/norms-portfolio.types"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

/**
 * Props for the portfolio edit dialog.
 */
export interface PortfolioEditDialogProps {
  dialog: EntityEditDialogModel<PortfolioRow>
  norms: NormOptionRegistry | null
}

/**
 * @summary
 * Renders the portfolio edit dialog flow.
 *
 * @remarks
 * Composes the shared edit dialog with the edit form
 * seeded from the target row. The result toast fires on
 * success or error; on success the dialog closes and the
 * server data refreshes. The success toast carries a view
 * action that opens the page of the edited portfolio.
 *
 * The bounds already stored for the target row are seeded
 * into the form from the same registry that supplies the
 * picker, so submitting without touching the norms leaves
 * the relations as they were. A missing registry keeps the
 * stored relations out of the payload instead of claiming
 * the portfolio has no norms.
 *
 * @param props - Props of the portfolio edit dialog.
 * @param props.dialog - The edit dialog flow state.
 * @param props.norms - The norms the form may attach, and
 *                      the bounds stored per portfolio.
 *
 * @returns The portfolio edit dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioEditDialog({
  dialog,
  norms,
}: PortfolioEditDialogProps) {
  const ROUTER = useRouter()

  const TARGET_ID = dialog.target?.id

  const UPDATED_ID = (
    dialog.result as PortfolioResponseDTO | null
  )?.id

  const SUCCESS_ACTION = UPDATED_ID
    ? {
        label: PORTFOLIO_FORM.VIEW_ACTION,
        onClick: () => ROUTER.push(`/portfolio/${UPDATED_ID}`),
      }
    : null

  return (
    <>
      <EntityEditDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={PORTFOLIO_DIALOG.EDIT_TITLE}
        description={PORTFOLIO_DIALOG.EDIT_DESCRIPTION}
      >
        {dialog.target && TARGET_ID ? (
          <EditPortfolioForm
            key={TARGET_ID}
            portfolio={dialog.target}
            onStatusChange={dialog.handleStatusChange}
            normRegistry={norms}
          />
        ) : null}
      </EntityEditDialog>

      <EntityEditToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={PORTFOLIO_FORM.UPDATE_SUCCESS_TITLE}
        successDescription={
          PORTFOLIO_FORM.UPDATE_SUCCESS_DESCRIPTION
        }
        errorTitle={PORTFOLIO_FORM.ERROR_TITLE}
        successAction={SUCCESS_ACTION}
      />
    </>
  )
}

export { PortfolioEditDialog }
