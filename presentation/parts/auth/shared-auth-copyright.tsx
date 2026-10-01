interface SharedAuthCopyrightProps {
  // The full notice, already resolved. The brand name and
  // the year are the caller's to phrase, because they change
  // for reasons this renderer knows nothing about.
  text: string
}

/**
 * @summary
 * Renders the brand copyright notice.
 *
 * @remarks
 * Pins the legal notice to the bottom of the screen and
 * centres it under the card column.
 *
 * The notice arrives as one string rather than as parts to be
 * joined here, so the year and the brand name are worded in
 * the same place as every other line of copy. A renderer that
 * assembled the sentence itself would be the one place in the
 * app where the wording could drift from the settings.
 *
 * @explanation
 * Use at the bottom of an auth screen to present the brand
 * legal information.
 *
 * @param props - Props of the copyright notice.
 * @param props.text - The resolved notice.
 *
 * @returns The copyright notice.
 *
 * @example
 * <SharedAuthCopyright text={AUTH_COPYRIGHT} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function SharedAuthCopyright({
  text,
}: SharedAuthCopyrightProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      <p className="text-center text-xs text-muted-foreground">
        {text}
      </p>
    </div>
  )
}

export { SharedAuthCopyright }
