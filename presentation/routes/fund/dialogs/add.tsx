"use client"

import { EntityAddDialog } from "@/presentation/parts/dialogs/entity-add"
import { EntityAddToast } from "@/presentation/parts/toasts/entity-add-toast"
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import type { EntityAddDialogModel } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { AddFundForm } from "@/presentation/routes/fund/forms/add"
import {
  FUND_DIALOG,
  FUND_FORM,
} from "@/presentation/routes/fund/settings/labels.settings"

import type { FundSelectOptions } from "../types/fund-list.types"
import { FundAddAnotherDialog } from "./add-another"

/**
 * Props for the fund add dialog.
 */
export interface FundAddDialogProps {
  dialog: EntityAddDialogModel
  options: FundSelectOptions
}

/**
 * @summary
 * Renders the fund add dialog flow.
 *
 * @remarks
 * Composes the shared add dialog with the add form and
 * the add-another prompt. On success the add-another
 * prompt opens so the user can return to the table or
 * add another fund. The result toast fires on both
 * outcomes.
 *
 * @param props - Props of the fund add dialog.
 * @param props.dialog - The add dialog flow state.
 * @param props.options - The registry options.
 *
 * @returns The fund add dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function FundAddDialog({ dialog, options }: FundAddDialogProps) {
  return (
    <>
      <EntityAddDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={FUND_DIALOG.ADD_TITLE}
        description={FUND_DIALOG.ADD_DESCRIPTION}
      >
        <AddFundForm
          key={dialog.formKey}
          options={options}
          onStatusChange={dialog.handleStatusChange}
        />
      </EntityAddDialog>

      <FundAddAnotherDialog
        open={dialog.anotherOpen}
        onOpenChange={dialog.handleBackToTable}
        onBack={dialog.handleBackToTable}
        onAddAnother={dialog.handleAddAnother}
      />

      <EntityAddToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={FUND_FORM.CREATE_SUCCESS_TITLE}
        successDescription={FUND_FORM.CREATE_SUCCESS_DESCRIPTION}
        errorTitle={FUND_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { FundAddDialog }
