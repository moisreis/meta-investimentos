"use client"

import { IconCalculator } from "@tabler/icons-react"
import type { JSX } from "react"

import { EntityDatatableGhostButton } from "@/presentation/parts/components/entity-datatable-ghost-button"

import { PORTFOLIO_PERFORMANCE_CALCULATE } from "../settings/labels.settings"

export interface PortfolioPerformanceCalculateButtonProps {
  onClick?: () => void
}

/**
 * @summary
 * Renders the portfolio performance calculate action
 * button.
 *
 * @remarks
 * Replaces the add-item button of the shared datatable
 * kit, since performances are calculated instead of
 * created manually. Ghost styled with the calculator
 * icon and the calculation copy.
 *
 * @explanation
 * Use wherever a calculation can be started: the
 * performance list toolbar, or the portfolio detail
 * toolbar of the portfolio the run defaults to.
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
function PortfolioPerformanceCalculateButton(
  props: PortfolioPerformanceCalculateButtonProps
): JSX.Element {
  const { onClick } = props

  return (
    <EntityDatatableGhostButton
      icon={IconCalculator}
      label={PORTFOLIO_PERFORMANCE_CALCULATE.BUTTON_LABEL}
      onClick={onClick}
    />
  )
}

export { PortfolioPerformanceCalculateButton }
