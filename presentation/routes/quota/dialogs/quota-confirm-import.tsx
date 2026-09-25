"use client"

import type { CvmImportWindow } from "@/services/quota/use-cases/import-fund-valuations.use-case"
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
import { NativeSelect } from "@/presentation/ui/native-select"

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
 * Prompts for the import period through a native select
 * before the import starts. The confirm button stays
 * pending while the start action resolves; a start error
 * renders below the field.
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
 * @date 2026-09-25
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
            <NativeSelect
              id="quota-import-window"
              name="window"
              value={window}
              disabled={pending}
              onChange={(event) =>
                onWindowChange(
                  event.target.value as CvmImportWindow
                )
              }
            >
              {QUOTA_IMPORT_WINDOWS.map((OPTION) => (
                <option key={OPTION.value} value={OPTION.value}>
                  {OPTION.label}
                </option>
              ))}
            </NativeSelect>

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
