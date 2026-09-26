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
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import {
  PORTFOLIO_PERFORMANCE_ALL_PORTFOLIOS_VALUE,
  PORTFOLIO_PERFORMANCE_CALCULATE,
  PORTFOLIO_PERFORMANCE_DATATABLE,
} from "../settings/labels.settings"

interface PortfolioPerformanceCalculateConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  portfolios: PortfolioResponseDTO[]
  portfolioId: string
  onPortfolioChange: (value: string) => void
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  pending: boolean
  error: string | null
  onConfirm: () => void
}

/**
 * @summary
 * Renders the portfolio performance confirm dialog.
 *
 * @remarks
 * Prompts for the target portfolio through a native
 * select offering every portfolio or the aggregated
 * option, and for the calculation period through the
 * shared date range filter. The confirm button stays
 * pending while the start action resolves; a start error
 * renders below the period field.
 *
 * @param props - Props of the confirm dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.portfolios - The user portfolios.
 * @param props.portfolioId - The selected portfolio id.
 * @param props.onPortfolioChange - Reports the portfolio.
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
function PortfolioPerformanceCalculateConfirmDialog({
  open,
  onOpenChange,
  portfolios,
  portfolioId,
  onPortfolioChange,
  dateRange,
  onDateRangeChange,
  pending,
  error,
  onConfirm,
}: PortfolioPerformanceCalculateConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {PORTFOLIO_PERFORMANCE_CALCULATE.CONFIRM_TITLE}
          </DialogTitle>
          <DialogDescription>
            {PORTFOLIO_PERFORMANCE_CALCULATE.CONFIRM_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor="performance-calculate-portfolio">
            {PORTFOLIO_PERFORMANCE_CALCULATE.FIELD_PORTFOLIO}
          </FieldLabel>

          <FieldContent>
            <NativeSelect
              id="performance-calculate-portfolio"
              name="portfolio"
              value={portfolioId}
              disabled={pending}
              onChange={(event) =>
                onPortfolioChange(event.target.value)
              }
            >
              <option
                value={
                  PORTFOLIO_PERFORMANCE_ALL_PORTFOLIOS_VALUE
                }
              >
                {
                  PORTFOLIO_PERFORMANCE_CALCULATE.ALL_PORTFOLIOS_LABEL
                }
              </option>

              {portfolios.map((portfolio) => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </option>
              ))}
            </NativeSelect>

            <FieldDescription>
              {
                PORTFOLIO_PERFORMANCE_CALCULATE.FIELD_PORTFOLIO_DESCRIPTION
              }
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>
            {PORTFOLIO_PERFORMANCE_CALCULATE.FIELD_DATE_RANGE}
          </FieldLabel>

          <FieldContent>
            <EntityDateRangeFilter
              value={dateRange}
              onChange={onDateRangeChange}
              placeholder={
                PORTFOLIO_PERFORMANCE_DATATABLE.FILTER_DATE_PLACEHOLDER
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
            {PORTFOLIO_PERFORMANCE_CALCULATE.CANCEL_BUTTON}
          </Button>

          <Button disabled={pending} onClick={onConfirm}>
            {pending
              ? PORTFOLIO_PERFORMANCE_CALCULATE.CONFIRM_PENDING_BUTTON
              : PORTFOLIO_PERFORMANCE_CALCULATE.CONFIRM_BUTTON}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { PortfolioPerformanceCalculateConfirmDialog }
