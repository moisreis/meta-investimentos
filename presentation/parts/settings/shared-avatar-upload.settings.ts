// Largest avatar accepted, in bytes. The picked image travels
// as a data URL inside the record itself, so this ceiling is
// what keeps a row from carrying a photo-sized blob.
const AVATAR_UPLOAD_MAX_BYTES = 2 * 1024 * 1024

// Longest data URL the picker can produce: the base64 of the
// ceiling plus room for the data URL prefix. The action
// refuses anything longer, so a hand-crafted request cannot
// stuff a photo into a text column either.
const AVATAR_UPLOAD_MAX_DATA_URL_LENGTH =
  Math.ceil((AVATAR_UPLOAD_MAX_BYTES * 4) / 3) + 128

// Image types an avatar may be. A data URL keeps the MIME type
// it was read with, so this one list is both the picker's
// filter and the check a file has to pass, which is what keeps
// the dialog from offering a choice the form then refuses.
const AVATAR_UPLOAD_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const

// Short labels the attachment shows next to the file size,
// keyed by the MIME type each one stands for.
const AVATAR_UPLOAD_TYPE_LABELS = {
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/webp": "WEBP",
} as const

// The `accept` value of the file input, derived from the
// allowed types so the two cannot drift apart.
const AVATAR_UPLOAD_ACCEPT = AVATAR_UPLOAD_MIME_TYPES.join(",")

/**
 * @summary
 * Tells whether a picked file is one of the accepted images.
 *
 * @remarks
 * The browser is free to hand over any file it likes, so the
 * dialog's `accept` filter is a convenience rather than a
 * guarantee. This is the check that actually decides.
 *
 * @param mimeType - MIME type reported by the picked file.
 *
 * @returns Whether the file is an accepted image.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function IsAllowedAvatarMimeType(mimeType: string): boolean {
  return AVATAR_UPLOAD_MIME_TYPES.some(
    (allowed) => allowed === mimeType
  )
}

/**
 * @summary
 * Reads the short label of a MIME type.
 *
 * @remarks
 * Falls back to the raw MIME type, so a file the accepted
 * list does not know yet still reads as something rather
 * than as nothing.
 *
 * @param mimeType - MIME type reported by the picked file.
 *
 * @returns The short label, or the raw MIME type.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function ReadAvatarUploadTypeLabel(mimeType: string): string {
  const LABELS: Record<string, string> =
    AVATAR_UPLOAD_TYPE_LABELS

  return LABELS[mimeType] ?? mimeType
}

/**
 * @summary
 * Formats a byte count the way the attachment shows it.
 *
 * @remarks
 * Switches to megabytes at the kilobyte boundary rather than
 * at a round number, because an attachment whose label reads
 * `2048 KB` is a number nobody can act on.
 *
 * @param bytes - The size to format.
 *
 * @returns The size as a short label.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function FormatAvatarUploadSizeLabel(bytes: number): string {
  const KILOBYTES = bytes / 1024

  if (KILOBYTES < 1024) {
    return `${Math.round(KILOBYTES)} KB`
  }

  return `${(KILOBYTES / 1024).toFixed(1)} MB`
}

/**
 * @summary
 * Formats the meta line of an attachment for a picked file.
 *
 * @remarks
 * Reads as `<TYPE> · <SIZE>`, the same shape a file of any
 * other kind would show, so the avatar reads as an attachment
 * rather than as a special case.
 *
 * @param file - The picked file.
 *
 * @returns The formatted meta line.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function FormatAvatarUploadFileMeta(file: File): string {
  const TYPE_LABEL = ReadAvatarUploadTypeLabel(file.type)

  return `${TYPE_LABEL} · ${FormatAvatarUploadSizeLabel(file.size)}`
}

/**
 * @summary
 * Formats the size ceiling as the hint the user reads.
 *
 * @explanation
 * Use in the copy of the picker, so the number the user is
 * held to is the same number the check enforces.
 *
 * @returns The ceiling as a short label.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function FormatAvatarUploadMaxBytesLabel(): string {
  const MEGABYTES = AVATAR_UPLOAD_MAX_BYTES / (1024 * 1024)

  return `${MEGABYTES} MB`
}

export {
  AVATAR_UPLOAD_ACCEPT,
  AVATAR_UPLOAD_MAX_BYTES,
  AVATAR_UPLOAD_MAX_DATA_URL_LENGTH,
  FormatAvatarUploadFileMeta,
  FormatAvatarUploadMaxBytesLabel,
  FormatAvatarUploadSizeLabel,
  IsAllowedAvatarMimeType,
  ReadAvatarUploadTypeLabel,
}
