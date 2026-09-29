"use client"

import { IconFileText } from "@tabler/icons-react"
import type { JSX } from "react"

import { Button } from "@/presentation/ui/button"

import { STATEMENT_DATATABLE } from "../settings/labels.settings"

export interface StatementGenerateReportButtonProps {
  onClick?: () => void
}

/**
 * @summary
 * Renders the statement generate-report action button.
 *
 * @remarks
 * Replaces the add-item button of the shared datatable kit,
 * since statements are generated instead of created by hand.
 * Ghost styled with the report icon and the generation copy,
 * matching the calculate button that sits beside it.
 *
 * @explanation
 * Use wherever a report can be generated: the statement list
 * toolbar, or the portfolio detail toolbar of the portfolio
 * the dialog defaults to.
 *
 * @param props - The click handler.
 * @param props.onClick - Opens the generate dialog.
 *
 * @returns The generate-report button.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
function StatementGenerateReportButton(
  props: StatementGenerateReportButtonProps
): JSX.Element {
  const { onClick } = props

  return (
    <Button
      type="button"
      variant="ghost"
      className="font-normal text-muted-foreground"
      onClick={onClick}
    >
      <IconFileText />
      <span>{STATEMENT_DATATABLE.GENERATE_REPORT_LABEL}</span>
    </Button>
  )
}

export { StatementGenerateReportButton }
