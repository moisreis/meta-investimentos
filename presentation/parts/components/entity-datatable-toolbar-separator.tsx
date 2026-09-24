import type { JSX } from "react"

export interface EntityDatatableToolbarSeparatorProps {
  className?: string
}

export function EntityDatatableToolbarSeparator(
  props: EntityDatatableToolbarSeparatorProps
): JSX.Element {
  const { className } = props

  return <div className={className ?? "h-5 w-px bg-border"} />
}
