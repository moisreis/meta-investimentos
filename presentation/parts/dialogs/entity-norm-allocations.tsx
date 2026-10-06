"use client"

import * as React from "react"

import { IconPlus, IconTrash } from "@tabler/icons-react"

import {
  EntityCombobox,
  type EntityComboboxItem,
} from "@/presentation/parts/components/entity-combobox"
import { MaskPercentage } from "@/presentation/masks/percentage.mask"
import { EntityPercentageInput } from "@/presentation/parts/components/entity-percentage-input"
import { Button } from "@/presentation/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/presentation/ui/empty"
import type {
  NormAllocationField,
  NormOption,
  NormPortfolioAllocation,
} from "@/presentation/types/norms-portfolio.types"

/**
 * Copy the norm allocations dialog reads.
 *
 * @remarks
 * A part is rendered by many screens and cannot own a route,
 * so every string reaches it through props. The two
 * formatters are the only copy that depends on a value: the
 * heading of the summary under the trigger, and the bounds
 * of one row.
 */
export interface EntityNormAllocationsCopy {
  // Label of the trigger that opens the dialog.
  TRIGGER_LABEL: string

  // Header of the dialog.
  TITLE: string
  DESCRIPTION: string

  // Picker that chooses the norm to attach next.
  SEARCH_PLACEHOLDER: string
  SEARCH_EMPTY_LABEL: string
  ADD_LABEL: string

  // Copy of the two empty states: nothing picked yet, and
  // every available norm already attached.
  EMPTY_TITLE: string
  EMPTY_DESCRIPTION: string
  EXHAUSTED_LABEL: string

  // Heading of the attached norms inside the dialog.
  ATTACHED_TITLE: (count: number) => string

  // Remove affordance of one attached norm.
  REMOVE_LABEL: string

  // Field labels of the three bounds.
  MIN_LABEL: string
  TARGET_LABEL: string
  MAX_LABEL: string

  // Qualifier shown under the norm name.
  ARTICLE_PREFIX: string

  // Footer actions.
  CANCEL_LABEL: string
  CONFIRM_LABEL: string

  // Heading and row text of the summary under the trigger.
  SUMMARY_TITLE: (count: number) => string
  SUMMARY_BOUNDS: (row: NormPortfolioAllocation) => string
}

/**
 * Props for the norm allocations dialog.
 */
export interface EntityNormAllocationsProps {
  // The norms already attached to the entity, each with
  // its own bounds.
  allocations: NormPortfolioAllocation[]

  // Reports the whole list back, so the owning form keeps
  // the norms in its own state like any other field.
  onAllocationsChange: (
    allocations: NormPortfolioAllocation[]
  ) => void

  // The norms the picker may still offer. A norm already
  // attached is filtered out, so a bound can never be
  // entered twice.
  options: NormOption[]

  // Copy of every string the dialog renders.
  copy: EntityNormAllocationsCopy

  // Message reported by the form schema when the bounds of
  // one norm are out of order.
  error?: string

  // Blocks every interaction while the form is submitting.
  disabled?: boolean
}

/**
 * @summary
 * Renders the trigger that attaches norms to an entity and
 * the dialog that bounds each one.
 *
 * @remarks
 * An entity such as a portfolio is not only a set of fields:
 * it also has to answer "which rules apply to it, and within
 * which range". That is a collection of rows, each with three
 * bounds, so it is its own dialog rather than three more
 * inputs on the form. The trigger states how many norms are
 * attached, and the summary under it lists the bounds the
 * user typed, so the form stays readable without reopening
 * the dialog.
 *
 * The picker only offers the norms that are not attached yet,
 * and a freshly picked norm starts at `0` for all three
 * bounds, which already satisfies min <= target <= max so the
 * user can fill one bound at a time.
 *
 * The dialog owns its open state and the pending pick, which
 * is why the owning form needs no hook of its own: it holds
 * the rows and nothing else.
 *
 * @explanation
 * Use as the norms block of an entity add or edit form.
 * Pass the whole registry as `options`, the current rows as
 * `allocations`, and read the next rows through
 * `onAllocationsChange`.
 *
 * @param props - Props of the norm allocations dialog.
 * @param props.allocations - The attached norms.
 * @param props.onAllocationsChange - Reports the next rows.
 * @param props.options - The norms still available.
 * @param props.copy - Copy of every string rendered.
 * @param props.error - Message shown under the summary.
 * @param props.disabled - Blocks interaction.
 *
 * @returns The trigger, the dialog and the summary.
 *
 * @example
 * <EntityNormAllocations
 *   allocations={norms}
 *   onAllocationsChange={updateNorms}
 *   options={options}
 *   copy={NORM_ALLOCATIONS}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-10-04
 */
function EntityNormAllocations({
  allocations,
  onAllocationsChange,
  options,
  copy,
  error,
  disabled = false,
}: EntityNormAllocationsProps) {
  const [OPEN, setOpen] = React.useState(false)
  const [PICKED, setPicked] = React.useState("")

  const AVAILABLE = options.filter(
    (option) =>
      !allocations.some((row) => row.normId === option.id)
  )

  const ITEMS: EntityComboboxItem[] = AVAILABLE.map(
    (option) => ({
      id: option.id,
      name: option.name,
      description: option.articleNumber,
    })
  )

  /**
   * @summary
   * Attaches the norm the picker is holding.
   *
   * @remarks
   * The new row starts at `0` for every bound, which the
   * entity already accepts, so attaching a norm never blocks
   * a submit before the user typed anything.
   *
   * The norm's own corridor is copied across even though
   * nothing here can edit it, so the row is complete from the
   * moment it exists. A half-populated row would make every
   * reader of the row — the summary today, a comparison chart
   * tomorrow — treat the missing half as a real zero.
   *
   * @explanation
   * Use for the add button of the picker, once a norm is
   * selected.
   *
   * @author Moisés Reis
   *
   * @date 2026-10-04
   */
  function AttachPicked() {
    const OPTION = AVAILABLE.find(
      (option) => option.id === PICKED
    )

    if (!OPTION) return

    onAllocationsChange([
      ...allocations,
      {
        normId: OPTION.id,
        normName: OPTION.name,
        articleNumber: OPTION.articleNumber,
        minAllocation: "0",
        targetAllocation: "0",
        maxAllocation: "0",
        normMinAllocation: MaskPercentage(OPTION.minAllocation),
        normTargetAllocation: MaskPercentage(
          OPTION.targetAllocation
        ),
        normMaxAllocation: MaskPercentage(OPTION.maxAllocation),
      },
    ])

    setPicked("")
  }

  /**
   * @summary
   * Detaches one norm from the entity.
   *
   * @explanation
   * Use for the remove affordance of one attached norm.
   *
   * @param normId - Id of the norm to detach.
   *
   * @author Moisés Reis
   *
   * @date 2026-10-04
   */
  function Detach(normId: string) {
    onAllocationsChange(
      allocations.filter((row) => row.normId !== normId)
    )
  }

  /**
   * @summary
   * Reports one edited bound of one attached norm.
   *
   * @explanation
   * Use for each of the three percentage inputs of a row,
   * so the owning form holds the whole list again.
   *
   * @param normId - Id of the edited norm.
   * @param field - The bound being edited.
   * @param value - The masked value of the bound.
   *
   * @author Moisés Reis
   *
   * @date 2026-10-04
   */
  function Bound(
    normId: string,
    field: NormAllocationField,
    value: string
  ) {
    onAllocationsChange(
      allocations.map((row) =>
        row.normId === normId ? { ...row, [field]: value } : row
      )
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Dialog open={OPEN} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || AVAILABLE.length === 0}
            />
          }
        >
          <IconPlus />
          {copy.TRIGGER_LABEL}
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{copy.TITLE}</DialogTitle>
            <DialogDescription>
              {copy.DESCRIPTION}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2">
            <EntityCombobox
              id="norm-allocations-picker"
              name="normAllocationsPicker"
              value={PICKED}
              onValueChange={setPicked}
              placeholder={copy.SEARCH_PLACEHOLDER}
              items={ITEMS}
              emptyLabel={copy.SEARCH_EMPTY_LABEL}
              clearable
              disabled={disabled}
            />
            <Button
              size="sm"
              disabled={disabled || PICKED === ""}
              onClick={AttachPicked}
            >
              <IconPlus />
              {copy.ADD_LABEL}
            </Button>
          </div>

          {allocations.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>{copy.EMPTY_TITLE}</EmptyTitle>
                <EmptyDescription>
                  {copy.EMPTY_DESCRIPTION}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="flex max-h-72 flex-col gap-3 overflow-y-auto">
              <p className="text-xs text-muted-foreground">
                {copy.ATTACHED_TITLE(allocations.length)}
              </p>

              {allocations.map((row) => (
                <div
                  key={row.normId}
                  data-slot="norm-allocations-row"
                  className="flex flex-col gap-3 rounded-lg border p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col">
                      <p className="truncate font-medium">
                        {row.normName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {copy.ARTICLE_PREFIX} {row.articleNumber}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={copy.REMOVE_LABEL}
                      disabled={disabled}
                      onClick={() => Detach(row.normId)}
                    >
                      <IconTrash />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <label
                      className="flex flex-col gap-1 text-xs text-muted-foreground"
                      htmlFor={`norm-${row.normId}-min`}
                    >
                      {copy.MIN_LABEL}
                      <EntityPercentageInput
                        id={`norm-${row.normId}-min`}
                        value={row.minAllocation}
                        onChange={(value: string) =>
                          Bound(
                            row.normId,
                            "minAllocation",
                            value
                          )
                        }
                        disabled={disabled}
                        aria-invalid={error ? "true" : undefined}
                      />
                    </label>
                    <label
                      className="flex flex-col gap-1 text-xs text-muted-foreground"
                      htmlFor={`norm-${row.normId}-target`}
                    >
                      {copy.TARGET_LABEL}
                      <EntityPercentageInput
                        id={`norm-${row.normId}-target`}
                        value={row.targetAllocation}
                        onChange={(value: string) =>
                          Bound(
                            row.normId,
                            "targetAllocation",
                            value
                          )
                        }
                        disabled={disabled}
                        aria-invalid={error ? "true" : undefined}
                      />
                    </label>
                    <label
                      className="flex flex-col gap-1 text-xs text-muted-foreground"
                      htmlFor={`norm-${row.normId}-max`}
                    >
                      {copy.MAX_LABEL}
                      <EntityPercentageInput
                        id={`norm-${row.normId}-max`}
                        value={row.maxAllocation}
                        onChange={(value: string) =>
                          Bound(
                            row.normId,
                            "maxAllocation",
                            value
                          )
                        }
                        disabled={disabled}
                        aria-invalid={error ? "true" : undefined}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}

          {AVAILABLE.length === 0 && allocations.length > 0 ? (
            <p className="text-xs text-muted-foreground">
              {copy.EXHAUSTED_LABEL}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => setOpen(false)}
            >
              {copy.CANCEL_LABEL}
            </Button>
            <Button
              type="button"
              disabled={disabled}
              onClick={() => setOpen(false)}
            >
              {copy.CONFIRM_LABEL}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {allocations.length > 0 ? (
        <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
          <p className="text-xs font-medium">
            {copy.SUMMARY_TITLE(allocations.length)}
          </p>
          <ul className="flex flex-col gap-1">
            {allocations.map((row) => (
              <li
                key={row.normId}
                data-slot="norm-allocations-summary"
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="truncate">
                  {row.normName} ({copy.ARTICLE_PREFIX}{" "}
                  {row.articleNumber})
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {copy.SUMMARY_BOUNDS(row)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  )
}

export { EntityNormAllocations }
