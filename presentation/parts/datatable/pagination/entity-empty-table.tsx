"use client"

import type { ComponentType } from "react"

import { Button } from "@/presentation/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/presentation/ui/empty"

/**
 * Props for the entity empty table placeholder.
 */
export interface EntityEmptyTableProps {
  icon?: ComponentType<{ size?: number; stroke?: number }>
  title: string
  description?: string
  primaryActionLabel?: string
  onPrimaryAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
}

/**
 * @summary
 * Renders the empty state placeholder of an entity table.
 *
 * @remarks
 * Props-driven wrapper around the shared `Empty` primitive.
 * Shows an optional icon, a title, an optional description
 * and up to two actions wired to the route callbacks. Stays
 * generic so every route composes its own copy through the
 * settings files.
 *
 * @explanation
 * Use as the shared empty state of the entity datatable kit.
 * Render it whenever a route has no rows to display, so the
 * user sees a friendly prompt instead of a bare table.
 *
 * @param props - Props of the entity empty table.
 * @param props.icon - Optional icon rendered in the media.
 * @param props.title - The empty state title.
 * @param props.description - The empty state description.
 * @param props.primaryActionLabel - Primary action label.
 * @param props.onPrimaryAction - Primary action handler.
 * @param props.secondaryActionLabel - Secondary action label.
 * @param props.onSecondaryAction - Secondary action handler.
 *
 * @returns The entity empty table placeholder.
 *
 * @example
 * <EntityEmptyTable icon={IconWallet} title="Novidades"
 *   description="Nenhum item por aqui."
 *   primaryActionLabel="Criar"
 *   onPrimaryAction={handleCreate} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EntityEmptyTable({
  icon: Icon,
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EntityEmptyTableProps) {
  const HAS_ACTIONS = Boolean(
    primaryActionLabel || secondaryActionLabel
  )

  return (
    <Empty>
      <EmptyHeader>
        {Icon ? (
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
        ) : null}
        <EmptyTitle>{title}</EmptyTitle>
        {description ? (
          <EmptyDescription>{description}</EmptyDescription>
        ) : null}
      </EmptyHeader>

      {HAS_ACTIONS ? (
        <EmptyContent className="flex-row justify-center gap-2">
          {primaryActionLabel && onPrimaryAction ? (
            <Button onClick={onPrimaryAction}>
              {primaryActionLabel}
            </Button>
          ) : null}
          {secondaryActionLabel && onSecondaryAction ? (
            <Button
              variant="outline"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
          ) : null}
        </EmptyContent>
      ) : null}
    </Empty>
  )
}

export { EntityEmptyTable }
