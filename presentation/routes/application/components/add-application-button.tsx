"use client"

import { EntityDatatableAddItemButton } from "@/presentation/parts/components/entity-datatable-add-item-button"
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { ApplicationAddDialog } from "@/presentation/routes/application/dialogs/add"
import { APPLICATION_ADD_BUTTON } from "@/presentation/routes/application/settings/labels.settings"

import type { ApplicationAddOptions } from "../types/application-add.types"

/**
 * Props for the add application button.
 */
export interface AddApplicationButtonProps {
  portfolioId: string
  options: ApplicationAddOptions
}

/**
 * @summary
 * Renders the entry point of the add application flow.
 *
 * @remarks
 * Owns the application add dialog flow and renders the
 * toolbar button that opens it. The button is never
 * disabled: a portfolio that does not hold the chosen
 * fund yet simply opens its position on submit.
 *
 * @explanation
 * Use on the portfolio detail screen next to the other
 * entry points of the screen. Pass the options loaded for
 * the portfolio; the dialog is rendered by this
 * component, so the screen only needs the button.
 *
 * @param props - Props of the add application button.
 * @param props.portfolioId - Portfolio receiving the
 * application.
 * @param props.options - The fund options.
 *
 * @returns The add application button and its dialog.
 *
 * @example
 * <AddApplicationButton
 *   portfolioId={PORTFOLIO_ID}
 *   options={APPLICATION_OPTIONS}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AddApplicationButton({
  portfolioId,
  options,
}: AddApplicationButtonProps) {
  const dialog = useEntityAddDialog()

  return (
    <>
      <EntityDatatableAddItemButton
        label={APPLICATION_ADD_BUTTON}
        onClick={dialog.handleOpen}
      />

      <ApplicationAddDialog
        dialog={dialog}
        portfolioId={portfolioId}
        options={options}
      />
    </>
  )
}

export { AddApplicationButton }
