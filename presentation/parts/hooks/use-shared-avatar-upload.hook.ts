"use client"

import * as React from "react"

import {
  AVATAR_UPLOAD_MAX_BYTES,
  FormatAvatarUploadFileMeta,
  IsAllowedAvatarMimeType,
} from "@/presentation/parts/settings/shared-avatar-upload.settings"

// States the attachment card renders, mirroring the
// `Attachment` contract so the UI never has to translate one
// vocabulary into another.
type AvatarUploadState = "idle" | "uploading" | "error" | "done"

interface UseSharedAvatarUploadParams {
  // The persisted image: the data URL of a pick, or whatever
  // the record already carried.
  value: string | null

  // Reports the next persisted image.
  onValueChange: (value: string | null) => void

  // The sentences shown when a pick is refused. Named after
  // the reason rather than after a generic error, because the
  // three refusals call for different corrections.
  errors: UseSharedAvatarUploadErrors
}

// The sentences the hook needs in order to refuse a pick.
interface UseSharedAvatarUploadErrors {
  // Shown for a file that is not an accepted image.
  invalidType: string

  // Shown for an accepted image above the size ceiling.
  tooLarge: string

  // Shown for a file the browser refused to read.
  readFailed: string
}

/**
 * @summary
 * Reads a picked file as a data URL.
 *
 * @remarks
 * A data URL rather than an object URL, because the value
 * this produces is the one that gets persisted: an object URL
 * dies with the tab, and a record cannot carry a dead
 * reference.
 *
 * @param file - The picked file.
 *
 * @returns The file as a data URL.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function ReadFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const READER = new FileReader()

    READER.addEventListener("load", () => {
      resolve(String(READER.result ?? ""))
    })

    READER.addEventListener("error", () => {
      reject(new Error("avatar-read-failed"))
    })

    READER.readAsDataURL(file)
  })
}

/**
 * @summary
 * Manages the state of an image picker that persists its pick
 * as a data URL.
 *
 * @remarks
 * Decides whether a picked file is acceptable, reads it, and
 * reports the result through `onValueChange`. The preview is
 * an object URL of the picked file so the choice shows up the
 * moment it is made, while the value that gets persisted is
 * the data URL the same file is read into; the object URL is
 * revoked as soon as it is replaced or the part unmounts.
 *
 * A read that resolves after the user cleared the field is
 * dropped, so clearing during a read cannot leave a stale
 * image behind.
 *
 * @explanation
 * Use inside the avatar upload part to keep it presentational.
 * Wire the returned `handleChange` to the file input and
 * `handleClear` to the remove action, and render `state`,
 * `preview` and `error`.
 *
 * @param params - Hook arguments.
 * @param params.value - The persisted image.
 * @param params.onValueChange - Reports the next image.
 * @param params.errors - Sentences shown when a pick is refused.
 *
 * @returns The preview, the file meta, the state and the
 * handlers of the picker.
 *
 * @example
 * const { preview, state, handleChange } = useSharedAvatarUpload(
 *   { value, onValueChange, errors: ERRORS }
 * )
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function useSharedAvatarUpload({
  value,
  onValueChange,
  errors,
}: UseSharedAvatarUploadParams) {
  const [FILE, setFile] = React.useState<File | null>(null)
  const [PREVIEW_URL, setPreviewUrl] = React.useState<
    string | null
  >(null)
  const [STATE, setState] =
    React.useState<AvatarUploadState>("idle")
  const [ERROR, setError] = React.useState<string | null>(null)

  // Counts reads, so a read that lands after the field was
  // cleared is recognised as stale and dropped.
  const READ_ID = React.useRef(0)

  // The pick already made wins over the value on the record,
  // because the value is only replaced once the read lands.
  const PREVIEW = PREVIEW_URL ?? value ?? null

  React.useEffect(() => {
    return () => {
      if (PREVIEW_URL) {
        URL.revokeObjectURL(PREVIEW_URL)
      }
    }
  }, [PREVIEW_URL])

  /**
   * @summary
   * Checks a picked file and reads it into the value.
   *
   * @remarks
   * The order matters: a file that is refused never reaches
   * the reader, so a rejected pick leaves the current image
   * alone and only reports why it was refused.
   *
   * @param file - The picked file.
   *
   * @author Moisés Reis
   *
   * @date 2026-10-05
   */
  async function SelectFile(file: File): Promise<void> {
    if (!IsAllowedAvatarMimeType(file.type)) {
      setState("error")
      setError(errors.invalidType)
      return
    }

    if (file.size > AVATAR_UPLOAD_MAX_BYTES) {
      setState("error")
      setError(errors.tooLarge)
      return
    }

    const ID = (READ_ID.current += 1)

    setFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setState("uploading")
    setError(null)

    try {
      const DATA_URL = await ReadFileAsDataUrl(file)

      if (ID !== READ_ID.current) return

      onValueChange(DATA_URL)
      setState("done")
    } catch {
      if (ID !== READ_ID.current) return

      setState("error")
      setError(errors.readFailed)
    }
  }

  /**
   * @summary
   * Handles a pick coming from the file input.
   *
   * @remarks
   * The input is reset on every change, otherwise picking the
   * same file twice in a row fires no event the second time
   * and the field looks stuck.
   *
   * @param event - Change event of the file input.
   *
   * @author Moisés Reis
   *
   * @date 2026-10-05
   */
  function HandleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const PICKED = event.target.files?.[0]

    event.target.value = ""

    if (!PICKED) return

    void SelectFile(PICKED)
  }

  /**
   * @summary
   * Drops the current pick and clears the value.
   *
   * @remarks
   * Bumps the read counter first, so a read still in flight
   * cannot write the image back after the user removed it.
   *
   * @author Moisés Reis
   *
   * @date 2026-10-05
   */
  function HandleClear(): void {
    READ_ID.current += 1

    setFile(null)
    setPreviewUrl(null)
    setState("idle")
    setError(null)
    onValueChange(null)
  }

  return {
    preview: PREVIEW,
    fileName: FILE?.name ?? null,
    fileMeta: FILE ? FormatAvatarUploadFileMeta(FILE) : null,
    state: STATE,
    error: ERROR,
    handleChange: HandleChange,
    handleClear: HandleClear,
  }
}

export { useSharedAvatarUpload, type AvatarUploadState }
