import { Font } from "@react-pdf/renderer"

/**
 * @summary
 * Registers the **Schibsted Grotesk** files with **react-pdf**.
 *
 * @remarks
 * `next/font/google` only feeds the browser: it emits CSS
 * variables the DOM consumes, and a PDF renderer never reads
 * CSS. **react-pdf** embeds a typeface only when it is handed
 * the font file itself, so the same face is shipped twice — once
 * through `next/font` for the interface, and once here from the
 * vendored files under `public/fonts` for the printed pages.
 *
 * The four static instances cover every weight and slant the
 * report draws: the roman scan of the page titles, the medium
 * of the cover title, the bold bitmap of both levels, and the
 * italic of the subtitles. The path is read at render time, the
 * same way the cover reads `public/logo.svg`.
 *
 * @explanation
 * Import this module for its side effect before a document
 * renders, and use `STATEMENT_REPORT_FONT_FAMILY` as the
 * `fontFamily` of any `Text` that should print in it.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-15
 */
Font.register({
  family: "Schibsted Grotesk",
  fonts: [
    {
      src: "public/fonts/SchibstedGrotesk-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "public/fonts/SchibstedGrotesk-Medium.ttf",
      fontWeight: 500,
    },
    {
      src: "public/fonts/SchibstedGrotesk-Bold.ttf",
      fontWeight: 700,
    },
    {
      src: "public/fonts/SchibstedGrotesk-BoldItalic.ttf",
      fontWeight: 700,
      fontStyle: "italic",
    },
  ],
})

/**
 * @summary
 * The family name **react-pdf** knows the display face by.
 *
 * @remarks
 * The string must stay identical to the `family` passed to
 * `Font.register` above, because a `Text` resolves its
 * `fontFamily` by exact match against that registry key.
 *
 * @explanation
 * Spread this into the `fontFamily` slot of any **react-pdf**
 * style, as the page title and the section title styles do.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-15
 */
export const STATEMENT_REPORT_FONT_FAMILY =
  "Schibsted Grotesk" as const
