"use client"

import type { DateRange } from "react-day-picker"

import { EntityDateRangeFilter } from "@/presentation/parts/filters/date-range"
import { Button } from "@/presentation/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/presentation/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/presentation/ui/field"
import { NativeSelect } from "@/presentation/ui/native-select"

import {
  POSITION_PERFORMANCE_ALL_POSITIONS_VALUE,
  POSITION_PERFORMANCE_CALCULATE,
  POSITION_PERFORMANCE_DATATABLE,
} from "../settings/labels.settings"

interface PositionPerformanceCalculateConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  positionOptions: { value: string; label: string }[]
  positionId: string
  onPositionChange: (value: string) => void
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  pending: boolean
  error: string | null
  onConfirm: () => void
}

/**
 * @summary
 * Renders the position performance confirm dialog.
 *
 * @remarks
 * Prompts for the target position through a native
 * select offering every position or the aggregated
 * option, and for the calculation period through the
 * shared date range filter. The confirm button stays
 * pending while the start action resolves; a start error
 * renders below the period field.
 *
 * @param props - Props of the confirm dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.positionOptions - The position options.
 * @param props.positionId - The selected position id.
 * @param props.onPositionChange - Reports the position.
 * @param props.dateRange - The selected period.
 * @param props.onDateRangeChange - Reports the period.
 * @param props.pending - Locks the form while starting.
 * @param props.error - The start error message, if any.
 * @param props.onConfirm - Starts the calculation.
 *
 * @returns The confirm dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PositionPerformanceCalculateConfirmDialog({
  open,
  onOpenChange,
  positionOptions,
  positionId,
  onPositionChange,
  dateRange,
  onDateRangeChange,
  pending,
  error,
  onConfirm,
}: PositionPerformanceCalculateConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {POSITION_PERFORMANCE_CALCULATE.CONFIRM_TITLE}
          </DialogTitle>
          <DialogDescription>
            {POSITION_PERFORMANCE_CALCULATE.CONFIRM_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor="performance-calculate-position">
            {POSITION_PERFORMANCE_CALCULATE.FIELD_POSITION}
          </FieldLabel>

          <FieldContent>
            <NativeSelect
              id="performance-calculate-position"
              name="position"
              value={positionId}
              disabled={pending}
              onChange={(event) =>
                onPositionChange(event.target.value)
              }
            >
              <option
                value={POSITION_PERFORMANCE_ALL_POSITIONS_VALUE}
              >
                {
                  POSITION_PERFORMANCE_CALCULATE.ALL_POSITIONS_LABEL
                }
              </option>

              {positionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>

            <FieldDescription>
              {
                POSITION_PERFORMANCE_CALCULATE.FIELD_POSITION_DESCRIPTION
              }
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>
            {POSITION_PERFORMANCE_CALCULATE.FIELD_DATE_RANGE}
          </FieldLabel>

          <FieldContent>
            <EntityDateRangeFilter
              value={dateRange}
              onChange={onDateRangeChange}
              placeholder={
                POSITION_PERFORMANCE_DATATABLE.FILTER_DATE_PLACEHOLDER
              }
            />

            {error ? <FieldError>{error}</FieldError> : null}
          </FieldContent>
        </Field>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            {POSITION_PERFORMANCE_CALCULATE.CANCEL_BUTTON}
          </Button>

          <Button disabled={pending} onClick={onConfirm}>
            {pending
              ? POSITION_PERFORMANCE_CALCULATE.CONFIRM_PENDING_BUTTON
              : POSITION_PERFORMANCE_CALCULATE.CONFIRM_BUTTON}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { PositionPerformanceCalculateConfirmDialog }
