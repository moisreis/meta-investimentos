"use client"

import * as React from "react"

import type { CvmImportWindow } from "@/lib/quota/cvm-import-window"
import { Button } from "@/presentation/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/presentation/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/presentation/ui/field"

import { QuotaImportWindowCombobox } from "../forms/import-window-combobox"

import {
  QUOTA_IMPORT,
  QUOTA_IMPORT_WINDOWS,
} from "../settings/labels.settings"

interface QuotaConfirmImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  window: CvmImportWindow
  onWindowChange: (window: CvmImportWindow) => void
  pending: boolean
  error: string | null
  onConfirm: () => void
}

/**
 * @summary
 * Renders the quota confirm-import dialog.
 *
 * @remarks
 * Prompts for the import period through a searchable
 * combobox before the import starts. The confirm button
 * stays pending while the start action resolves; a start
 * error renders below the field.
 *
 * @explanation
 * Use as the submit target of the single-row delete
 * flow of the quota datatable.
 *
 * @param props - Props of the confirm-import dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.window - The selected import window.
 * @param props.onWindowChange - Reports the next window.
 * @param props.pending - Locks the form while starting.
 * @param props.error - The start error message, if any.
 * @param props.onConfirm - Starts the import.
 *
 * @returns The quota confirm-import dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function QuotaConfirmImportDialog({
  open,
  onOpenChange,
  window,
  onWindowChange,
  pending,
  error,
  onConfirm,
}: QuotaConfirmImportDialogProps) {
  const items = React.useMemo(
    () =>
      QUOTA_IMPORT_WINDOWS.map((option) => ({
        id: option.value,
        name: option.label,
      })),
    []
  )

  const handleWindowChange = React.useCallback(
    (value: string) => onWindowChange((value ?? QUOTA_IMPORT_WINDOWS[0].value) as CvmImportWindow),
    [onWindowChange]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{QUOTA_IMPORT.CONFIRM_TITLE}</DialogTitle>
          <DialogDescription>
            {QUOTA_IMPORT.CONFIRM_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor="quota-import-window">
            {QUOTA_IMPORT.FIELD_WINDOW}
          </FieldLabel>

          <FieldContent>
            <QuotaImportWindowCombobox
              id="quota-import-window"
              name="window"
              value={window}
              onValueChange={handleWindowChange}
              placeholder={QUOTA_IMPORT.FIELD_WINDOW}
              items={items}
              disabled={pending}
            />

            <FieldDescription>
              {QUOTA_IMPORT.FIELD_WINDOW_DESCRIPTION}
            </FieldDescription>

            {error ? <FieldError>{error}</FieldError> : null}
          </FieldContent>
        </Field>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            {QUOTA_IMPORT.CANCEL_BUTTON}
          </Button>

          <Button disabled={pending} onClick={onConfirm}>
            {pending
              ? QUOTA_IMPORT.CONFIRM_PENDING_BUTTON
              : QUOTA_IMPORT.CONFIRM_BUTTON}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { QuotaConfirmImportDialog }