"use client"

import { EntityDatatableAddItemButton } from "@/presentation/parts/components/entity-datatable-add-item-button"
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { WithdrawalAddDialog } from "@/presentation/routes/withdrawal/dialogs/add"
import { WITHDRAWAL_ADD_BUTTON } from "@/presentation/routes/withdrawal/settings/labels.settings"

import type { WithdrawalAddOptions } from "../types/withdrawal-add.types"

/**
 * Props for the add withdrawal button.
 */
export interface AddWithdrawalButtonProps {
  options: WithdrawalAddOptions
}

/**
 * @summary
 * Renders the entry point of the add withdrawal flow.
 *
 * @remarks
 * Owns the withdrawal add dialog flow and renders the
 * toolbar button that opens it. The button is never
 * disabled: when the portfolio holds no position yet the
 * combobox reports it through its own empty copy.
 *
 * @explanation
 * Use on the portfolio detail screen next to the add
 * application button. Pass the positions loaded for the
 * portfolio; the dialog is rendered by this component, so
 * the screen only needs the button.
 *
 * @param props - Props of the add withdrawal button.
 * @param props.options - The position options.
 *
 * @returns The add withdrawal button and its dialog.
 *
 * @example
 * <AddWithdrawalButton options={WITHDRAWAL_OPTIONS} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AddWithdrawalButton({
  options,
}: AddWithdrawalButtonProps) {
  const dialog = useEntityAddDialog()

  return (
    <>
      <EntityDatatableAddItemButton
        label={WITHDRAWAL_ADD_BUTTON}
        onClick={dialog.handleOpen}
      />

      <WithdrawalAddDialog dialog={dialog} options={options} />
    </>
  )
}

export { AddWithdrawalButton }
