import { IconPlus } from "@tabler/icons-react"
import type { JSX } from "react"

import { EntityDatatableGhostButton } from "./entity-datatable-ghost-button"

// Copy shown when the caller does not provide a label.
const DEFAULT_LABEL = "Adicionar Item"

export interface EntityDatatableAddItemButtonProps {
  onClick?: () => void
  label?: string
}

export function EntityDatatableAddItemButton(
  props: EntityDatatableAddItemButtonProps
): JSX.Element {
  const { onClick, label = DEFAULT_LABEL } = props

  return (
    <EntityDatatableGhostButton
      icon={IconPlus}
      label={label}
      onClick={onClick}
    />
  )
}
