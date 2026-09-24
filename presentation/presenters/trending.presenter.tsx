import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import type { JSX } from "react"
import { cn } from "cn"
import { formatCurrency } from "./currency.presenter"
import { formatPercentage } from "./percentage.presenter"

// Kind of value displayed by the trending presenter.
export type TrendingKind = "currency" | "percentage"

// Direction rendered by the trending icon.
export type TrendingDirection = "up" | "down"

/**
 * Props of the **TrendingValue** component.
 */
export interface TrendingValueProps {
  // Raw value formatted for display.
  value: string | number | null | undefined

  // Kind of formatting applied to the value.
  kind: TrendingKind

  // Icon direction; derived from the sign when omitted.
  direction?: TrendingDirection

  // Extra classes applied to the root element.
  className?: string
}

/**
 * @summary
 * Renders a currency or percentage with a trending icon.
 *
 * @remarks
 * Uses **Tabler** icons that point up or down. Direction is
 * derived from the value sign unless explicitly provided.
 *
 * @explanation
 * Use this component to show a value with its movement
 * direction in tables and dashboards. It formats the value
 * with the currency or percentage presenter and places an
 * icon before the text. Default direction comes from the
 * sign of the number when no direction is given.
 *
 * @param props - Props of the component.
 * @param props.value - Raw value to format and display.
 * @param props.kind - Kind of value; currency or percentage.
 * @param props.direction - Icon direction; auto when omitted.
 * @param props.className - Extra classes for the root.
 * @returns Value with the trending icon.
 *
 * @example
 * <TrendingValue value={-3.5} kind="percentage" />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export function TrendingValue({
  value,
  kind,
  direction,
  className,
}: TrendingValueProps): JSX.Element {
  const isDown = (direction ?? deriveDirection(value)) === "down"
  const Icon = isDown ? IconTrendingDown : IconTrendingUp
  const text =
    kind === "currency" ? formatCurrency(value) : formatPercentage(value)

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Icon aria-hidden="true" className="size-4" />
      <span>{text}</span>
    </span>
  )
}

/**
 * @summary
 * Derives the trending direction from the value sign.
 *
 * @remarks
 * Negative values trend down; all others trend up.
 *
 * @explanation
 * Helper that picks the icon direction when none is given.
 * It parses string values and checks the numeric sign.
 *
 * @param value - Raw value to inspect.
 * @returns The derived trending direction.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function deriveDirection(
  value: string | number | null | undefined
): TrendingDirection {
  const parsed = typeof value === "string" ? Number.parseFloat(value) : value
  return typeof parsed === "number" && parsed < 0 ? "down" : "up"
}