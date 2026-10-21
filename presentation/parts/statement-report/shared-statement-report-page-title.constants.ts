import { STATEMENT_REPORT_FONT_FAMILY } from "./shared-statement-report-fonts.constants"
import { STATEMENT_REPORT_PALETTE } from "./shared-statement-report.settings"

/**
 * @summary
 * The single source of the page title style of the report.
 *
 * @remarks
 * Every page of the statement opens with a title drawn from this
 * one object, so the heading level stays identical from the
 * cover down to the closing page. The title is deliberately
 * larger and roman, while the subtitle below it is smaller and
 * italic, which is what tells the two levels apart without a
 * rule between them.
 *
 * The size matches the `text-2xl` utility the page headings
 * used before the display font landed, so adding the typeface
 * leaves the page geometry untouched.
 *
 * @explanation
 * Use this object on the opening `Text` of every page instead of
 * a local font size, so a change to the title scale lands in a
 * single source.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-15
 */
export const STATEMENT_REPORT_PAGE_TITLE_STYLE = {
  fontFamily: STATEMENT_REPORT_FONT_FAMILY,
  fontSize: 18,
  lineHeight: 2,
  fontWeight: 700,
  color: STATEMENT_REPORT_PALETTE.foreground,
} as const
