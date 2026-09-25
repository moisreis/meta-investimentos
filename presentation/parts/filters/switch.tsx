"use client"

import { Label } from "@/presentation/ui/label"
import { Switch } from "@/presentation/ui/switch"

export interface EntitySwitchFilterProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

/**
 * @summary
 * Renders an entity-agnostic boolean switch filter.
 *
 * @remarks
 * Composes the shared switch and label primitives into a
 * single row. The label explains the toggled state and the
 * switch reports every change up to the caller.
 *
 * @param props - The filter contract.
 * @param props.label - Text describing the toggle.
 * @param props.checked - The current boolean state.
 * @param props.onCheckedChange - Reports the next state.
 * @param props.disabled - Locks the toggle.
 *
 * @returns The switch filter.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EntitySwitchFilter({
  label,
  checked,
  onCheckedChange,
  disabled = false,
}: EntitySwitchFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={label}
      />
      <Label className="font-normal text-muted-foreground">
        {label}
      </Label>
    </div>
  )
}

export { EntitySwitchFilter }
