"use client"

import { IconDownload } from "@tabler/icons-react"
import type { JSX } from "react"

import { EntityDatatableGhostButton } from "@/presentation/parts/components/entity-datatable-ghost-button"

import { QUOTA_DATATABLE } from "../settings/labels.settings"

export interface QuotaImportButtonProps {
  onClick?: () => void
}

/**
 * @summary
 * Renders the quota import action button.
 *
 * @remarks
 * Replaces the add-item button of the shared datatable
 * kit, since quotas are never added manually. Ghost
 * styled with the download icon and the quota copy.
 *
 * @param props - The click handler.
 * @param props.onClick - Opens the confirm-import dialog.
 *
 * @returns The quota import button.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function QuotaImportButton(
  props: QuotaImportButtonProps
): JSX.Element {
  const { onClick } = props

  return (
    <EntityDatatableGhostButton
      icon={IconDownload}
      label={QUOTA_DATATABLE.IMPORT_BUTTON_LABEL}
      onClick={onClick}
    />
  )
}

export { QuotaImportButton }
