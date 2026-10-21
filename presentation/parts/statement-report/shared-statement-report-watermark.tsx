import { View, Image } from "@react-pdf/renderer"
import type { ReactElement } from "react"
import { readFileSync } from "node:fs"

import { tw } from "./shared-statement-report-styles.constants"

// Alpha of the watermark mark. The logo paints its own vector
// fills, and **react-pdf** does not push a group `opacity` down
// onto an inline SVG, so the wrapper opacity never reaches the
// mark. The alpha therefore rides on the SVG markup, one
// `fill-opacity` per painted fill, which is the only alpha the
// renderer honors for this asset.
const WATERMARK_OPACITY = 0.03

/**
 * @summary
 * Loads the brand logo with a faded fill.
 *
 * @remarks
 * Reads the logo from `public/` and stamps a `fill-opacity` on
 * every painted fill, so the mark renders as a faint watermark
 * instead of a solid logo. The fill list also covers the two
 * gradient references of the mark.
 *
 * @returns The faded SVG source as a buffer.
 */
function LoadWatermarkSource(): Buffer {
  const SVG = readFileSync("public/logo.svg", "utf8")
  const FADED = SVG.replace(
    /fill="([^"]*)"/g,
    `fill="$1" fill-opacity="${WATERMARK_OPACITY}"`
  )
  return Buffer.from(FADED)
}

/**
 * @summary
 * Renders a faint centered watermark of the brand logo.
 *
 * @remarks
 * Pins the mark to the center of the page at a low alpha, so it
 * prints under the content without competing with it. The cover
 * intentionally omits the watermark.
 *
 * @explanation
 * Use this component on every page after the cover of the
 * statement document.
 *
 * @returns The watermark layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-15
 */
export function Watermark(): ReactElement {
  return (
    <View
      fixed
      style={tw(
        "absolute inset-0 flex items-center justify-center"
      )}
    >
      {/* The logo is a decorative brand mark with no readable text. */}
      {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop. */}
      <Image
        src={LoadWatermarkSource()}
        style={{
          width: 260,
          height: 220,
          transform: "rotate(0deg)",
        }}
      />
    </View>
  )
}
