import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/presentation/ui/button"
import type { JSX } from "react"

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
    <Button
      variant="ghost"
      className="font-normal text-muted-foreground"
      onClick={onClick}
    >
      <IconPlus />
      <span>{label}</span>
    </Button>
  )
}
