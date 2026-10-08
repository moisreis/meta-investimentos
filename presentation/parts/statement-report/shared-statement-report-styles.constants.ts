import { createTw } from "@react-pdf/tailwind"

import { STATEMENT_REPORT_PALETTE } from "./shared-statement-report.settings"
/**
 * @summary
 * Converts Tailwind utility classes into **react-pdf**
 * styles wired with the light theme palette.
 *
 * @remarks
 * The converter resolves colors through the first class
 * segment only, so two-part class names like
 * `text-muted-foreground` cannot coexist with their
 * parent token. The palette therefore names each color
 * with a single segment: `surface` mirrors `--muted`,
 * `subdued` mirrors `--muted-foreground` and `onPrimary`
 * mirrors `--primary-foreground`.
 *
 * @explanation
 * Use `tw(...)` for every style in the statement report
 * document. It is the single bridge between the
 * Tailwind class syntax and the **react-pdf** style
 * objects.
 *
 * @example
 * <View style={tw("flex-row gap-2")}>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export const tw = createTw({
  colors: {
    background: STATEMENT_REPORT_PALETTE.background,
    foreground: STATEMENT_REPORT_PALETTE.foreground,
    primary: STATEMENT_REPORT_PALETTE.primary,
    onPrimary: STATEMENT_REPORT_PALETTE.onPrimary,
    surface: STATEMENT_REPORT_PALETTE.surface,
    subdued: STATEMENT_REPORT_PALETTE.subdued,
    border: STATEMENT_REPORT_PALETTE.border,
    positive: STATEMENT_REPORT_PALETTE.positive,
    negative: STATEMENT_REPORT_PALETTE.negative,
    brandBlue: STATEMENT_REPORT_PALETTE.brandBlue,
    brandPurple: STATEMENT_REPORT_PALETTE.brandPurple,
    brandTint: STATEMENT_REPORT_PALETTE.brandTint,
    track: STATEMENT_REPORT_PALETTE.track,
  },
})
