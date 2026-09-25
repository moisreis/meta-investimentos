"use client"

import { EntityEditDialog } from "@/presentation/parts/dialogs/entity-edit"
import { EntityEditToast } from "@/presentation/parts/toasts/entity-edit-toast"
import { EditFundForm } from "@/presentation/routes/fund/forms/edit"
import { useFundEditDialog } from "@/presentation/routes/fund/hooks/use-fund-edit-dialog.hook"
import {
  FUND_DIALOG,
  FUND_FORM,
} from "@/presentation/routes/fund/settings/labels.settings"

import type { FundSelectOptions } from "../types/fund-list.types"

/**
 * Props for the fund edit dialog.
 */
export interface FundEditDialogProps {
  dialog: ReturnType<typeof useFundEditDialog>
  options: FundSelectOptions
}

/**
 * @summary
 * Renders the fund edit dialog flow.
 *
 * @remarks
 * Composes the shared edit dialog with the edit form
 * seeded from the target row. The result toast fires
 * on success or error; on success the dialog closes
 * and the server data refreshes.
 *
 * @param props - Props of the fund edit dialog.
 * @param props.dialog - The edit dialog flow state.
 * @param props.options - The registry options.
 *
 * @returns The fund edit dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function FundEditDialog({
  dialog,
  options,
}: FundEditDialogProps) {
  return (
    <>
      <EntityEditDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={FUND_DIALOG.EDIT_TITLE}
        description={FUND_DIALOG.EDIT_DESCRIPTION}
      >
        {dialog.target ? (
          <EditFundForm
            fund={dialog.target}
            options={options}
            onStatusChange={dialog.handleStatusChange}
          />
        ) : null}
      </EntityEditDialog>

      <EntityEditToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={FUND_FORM.UPDATE_SUCCESS_TITLE}
        successDescription={FUND_FORM.UPDATE_SUCCESS_DESCRIPTION}
        errorTitle={FUND_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { FundEditDialog }
