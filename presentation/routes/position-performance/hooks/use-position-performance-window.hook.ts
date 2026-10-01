"use client"

import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"

import { POSITION_PERFORMANCE_ALL_POSITIONS_VALUE } from "../settings/labels.settings"
import type { PositionPerformanceCalculationOption } from "../types/position-performance-list.types"

interface UsePositionPerformanceWindowOptions {
  // The positions the user can calculate over.
  positionOptions: PositionPerformanceCalculationOption[]
  // The position currently chosen.
  positionId: string
  // Reports the next position to the parent.
  onPositionChange: (positionId: string) => void
}

/**
 * @summary
 * Owns the position picker of the calculate confirm dialog.
 *
 * @remarks
 * The dialog receives calculation options and renders a
 * generic picker, which speaks plain strings. Translating one
 * into the other is the same work in every dialog that offers a
 * fixed set of options, so it lives here instead of in the
 * dialog body.
 *
 * The portfolio acronym leads the option because the same fund
 * can be held by more than one portfolio: the acronym tells two
 * otherwise identical options apart at a glance, and the fund
 * name below it says which fund is meant.
 *
 * Clearing the field falls back to the "all positions"
 * sentinel, because a calculation with no position is a
 * calculation over every position — that is what the
 * confirmation is asking.
 *
 * @explanation
 * Use in `PositionPerformanceCalculateConfirmDialog`. Call it
 * once with the dialog's `positionOptions`, `positionId` and
 * `onPositionChange` props, and give the picker the `items` it
 * returns.
 *
 * @param options - The position options, the selection, and
 *   the change callback.
 * @param options.positionOptions - The positions on offer.
 * @param options.positionId - The position currently chosen.
 * @param options.onPositionChange - Reports the next position.
 *
 * @returns The picker options and the change handler.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function usePositionPerformanceWindow({
  positionOptions,
  positionId,
  onPositionChange,
}: UsePositionPerformanceWindowOptions) {
  const items: EntityComboboxItem[] = positionOptions.map(
    (option) => ({
      id: option.value,
      name: option.label,
      description: option.description,
    })
  )

  const handlePositionChange = (value: string) =>
    onPositionChange(
      value || POSITION_PERFORMANCE_ALL_POSITIONS_VALUE
    )

  return { positionId, items, handlePositionChange }
}

export { usePositionPerformanceWindow }
