import type { ComponentType, JSX } from "react"

import { Button } from "@/presentation/ui/button"

/**
 * Props for the entity datatable ghost action button.
 */
export interface EntityDatatableGhostButtonProps {
  // Icon rendered before the label.
  icon: ComponentType<{ size?: number; stroke?: number }>
  // Button content.
  label: string
  // Opens the flow behind the button.
  onClick?: () => void
}

/**
 * @summary
 * Renders the quiet action button a datatable toolbar
 * carries beside its filters.
 *
 * @remarks
 * Ghost styled, so the toolbar keeps its filters as the thing
 * the eye lands on and the action reads as a way out rather
 * than another filter. The icon leads and the label follows,
 * which is what keeps a row legible when several of them sit
 * next to each other.
 *
 * Most entities add with `EntityDatatableAddItemButton`. This
 * is the same button for the actions that are not an add:
 * importing a file, running a calculation, generating a
 * report.
 *
 * @explanation
 * Use in a datatable toolbar for any primary action. Pass the
 * action's icon and its copy, and the button owns the styling
 * so every toolbar action looks the same.
 *
 * @param props - Props of the ghost action button.
 * @param props.icon - Icon rendered before the label.
 * @param props.label - Button content.
 * @param props.onClick - Opens the flow behind the button.
 *
 * @returns The ghost action button.
 *
 * @example
 * <EntityDatatableGhostButton
 *   icon={IconDownload}
 *   label={QUOTA_DATATABLE.IMPORT_BUTTON_LABEL}
 *   onClick={openDialog}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function EntityDatatableGhostButton({
  icon: Icon,
  label,
  onClick,
}: EntityDatatableGhostButtonProps): JSX.Element {
  return (
    <Button
      type="button"
      variant="ghost"
      className="font-normal text-muted-foreground"
      onClick={onClick}
    >
      <Icon />
      <span>{label}</span>
    </Button>
  )
}

export { EntityDatatableGhostButton }
