"use client"

import { IconCalculator } from "@tabler/icons-react"
import type { JSX } from "react"

import { Button } from "@/presentation/ui/button"

import { POSITION_PERFORMANCE_CALCULATE } from "../settings/labels.settings"

export interface PositionPerformanceCalculateButtonProps {
  onClick?: () => void
}

/**
 * @summary
 * Renders the position performance calculate action
 * button.
 *
 * @remarks
 * Replaces the add-item button of the shared datatable
 * kit, since performances are calculated instead of
 * created manually. Ghost styled with the calculator
 * icon and the calculation copy.
 *
 * @param props - The click handler.
 * @param props.onClick - Opens the confirm dialog.
 *
 * @returns The calculate button.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PositionPerformanceCalculateButton(
  props: PositionPerformanceCalculateButtonProps
): JSX.Element {
  const { onClick } = props

  return (
    <Button
      variant="ghost"
      className="font-normal text-muted-foreground"
      onClick={onClick}
    >
      <IconCalculator />
      <span>{POSITION_PERFORMANCE_CALCULATE.BUTTON_LABEL}</span>
    </Button>
  )
}

export { PositionPerformanceCalculateButton }
