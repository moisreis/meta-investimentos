"use client"

import type { CvmImportWindow } from "@/lib/quota/cvm-import-window"

import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"

import {
  QUOTA_IMPORT_WINDOWS,
  type QuotaImportWindowOption,
} from "../settings/labels.settings"

interface UseQuotaImportWindowOptions {
  // The window currently chosen.
  window: CvmImportWindow
  // Reports the next window to the parent.
  onWindowChange: (window: CvmImportWindow) => void
}

/**
 * @summary
 * Owns the import-window picker of the confirm dialog.
 *
 * @remarks
 * The dialog receives a typed `CvmImportWindow` and renders a
 * generic picker, which speaks plain strings. Bridging the two
 * is the same work in every dialog that offers a fixed set of
 * options, so it lives here instead of in the dialog body: the
 * options are projected once, and clearing the field falls back
 * to the first window rather than leaving the form without a
 * value.
 *
 * The window label is the only text rendered per option. The
 * option's explanatory `description` is deliberately left out,
 * because the picker shows a single line here and the
 * description repeats what the label already says.
 *
 * @explanation
 * Use in `QuotaConfirmImportDialog`. Call it once with the
 * dialog's `window` and `onWindowChange` props, and give the
 * picker the `items` it returns.
 *
 * @param options - The current window and the change callback.
 * @param options.window - The window currently chosen.
 * @param options.onWindowChange - Reports the next window.
 *
 * @returns The picker options and the change handler.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useQuotaImportWindow({
  window,
  onWindowChange,
}: UseQuotaImportWindowOptions) {
  const items: EntityComboboxItem[] = QUOTA_IMPORT_WINDOWS.map(
    (option: QuotaImportWindowOption) => ({
      id: option.value,
      name: option.label,
    })
  )

  const handleWindowChange = (value: string) =>
    onWindowChange(
      (value || QUOTA_IMPORT_WINDOWS[0].value) as CvmImportWindow
    )

  return { window, items, handleWindowChange }
}

export { useQuotaImportWindow }
