import { STATEMENT_REPORT_PALETTE } from "./shared-statement-report.settings"
import { STATEMENT_REPORT_FONT_FAMILY } from "./shared-statement-report-fonts.constants"

/**
 * @summary
 * The single source of the section subtitle style of the report.
 *
 * @remarks
 * Every head that titles a block inside a page draws from this
 * one object: `Índices acumulados`, `Enquadramento da
 * carteira`, `Rendimento por índice de referência`, and the
 * titles of every chart. Sharing one object keeps the subtitle
 * level visually identical across the tables, the dashboard and
 * the charts, whatever page it lands on.
 *
 * The size sits below the `text-2xl` page heading, so the two
 * levels read apart without a second rule: the heading titles
 * the page, and a subtitle titles the block it sits above.
 *
 * The copy is italic on purpose, because a subtitle reads as a
 * caption of the page above it rather than as a heading of its
 * own, and the weight keeps it legible at print size.
 *
 * @explanation
 * Use this object instead of a local font size in every section
 * and chart, so a change to the subtitle scale lands in a
 * single source.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-15
 */
export const STATEMENT_REPORT_SECTION_TITLE_STYLE = {
  fontFamily: STATEMENT_REPORT_FONT_FAMILY,
  fontSize: 10,
  fontWeight: 700,
  fontStyle: "italic",
  color: STATEMENT_REPORT_PALETTE.foreground,
} as const
