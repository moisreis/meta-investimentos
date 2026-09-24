import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/presentation/ui/button"
import type { JSX } from "react"

export interface EntityDatatableAddItemButtonProps {
  onClick?: () => void
}

export function EntityDatatableAddItemButton(
  props: EntityDatatableAddItemButtonProps
): JSX.Element {
  const { onClick } = props

  return (
    <Button
      variant="ghost"
      className="font-normal text-muted-foreground"
      onClick={onClick}
    >
      <IconPlus />
      <span>Adicionar Item</span>
    </Button>
  )
}
