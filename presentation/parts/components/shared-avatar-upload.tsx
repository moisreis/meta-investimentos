"use client"

import * as React from "react"
import {
  IconFileCode,
  IconPhoto,
  IconX,
} from "@tabler/icons-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/presentation/ui/attachment"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/presentation/ui/avatar"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/presentation/ui/field"
import { Spinner } from "@/presentation/ui/spinner"

import { useSharedAvatarUpload } from "@/presentation/parts/hooks/use-shared-avatar-upload.hook"
import { AVATAR_UPLOAD_ACCEPT } from "@/presentation/parts/settings/shared-avatar-upload.settings"

/**
 * The copy the avatar upload shows, in the order the card
 * reads top to bottom.
 */
export interface SharedAvatarUploadLabels {
  // Title shown before a file is picked.
  emptyTitle: string

  // Description shown before a file is picked.
  emptyDescription: string

  // Description shown while the picked file is being read.
  uploadingDescription: string

  // Accessible name of the trigger that opens the picker.
  uploadAction: string

  // Accessible name of the remove action.
  removeAction: string

  // Shown when a pick is not an accepted image.
  invalidTypeError: string

  // Shown when a pick is above the size ceiling.
  tooLargeError: string

  // Shown when a file could not be read.
  readFailedError: string
}

interface SharedAvatarUploadProps {
  // Id of the file input, which the label points at.
  id: string

  // Form name the resolved value is submitted under.
  name: string

  // The persisted image.
  value: string | null

  // Reports the next image.
  onValueChange: (value: string | null) => void

  // Label of the field.
  label: string

  // Hint shown under the card.
  description?: string

  // Message the form reports for this field.
  error?: string

  // Blocks interaction.
  disabled?: boolean

  // Copy the card renders.
  labels: SharedAvatarUploadLabels
}

/**
 * @summary
 * Renders an image picker that reads as an attachment.
 *
 * @remarks
 * The card is an `Attachment` rather than a bare file input,
 * so a picked image is previewed with its type and size and a
 * read in flight shows a spinner instead of a blank box. The
 * whole card is the target: a label laid over it opens the
 * picker, while the remove action sits above it, so replacing
 * and removing are one click away from each other and cannot
 * be confused.
 *
 * The picked file is stored as a data URL, which is why the
 * preview can come from a record that was saved earlier: both
 * are just a source an `img` can read.
 *
 * @explanation
 * Use for any field that takes a single image. Wire `value`
 * and `onValueChange` to the form state and let the part own
 * the pick, so the screen never handles a `File`.
 *
 * @param props - Props of the avatar upload.
 * @param props.id - Id of the file input.
 * @param props.name - Form name of the value.
 * @param props.value - The persisted image.
 * @param props.onValueChange - Reports the next image.
 * @param props.label - Label of the field.
 * @param props.description - Hint shown under the card.
 * @param props.error - Message reported for this field.
 * @param props.disabled - Blocks interaction.
 * @param props.labels - Copy the card renders.
 *
 * @returns The avatar upload field.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function SharedAvatarUpload({
  id,
  name,
  value,
  onValueChange,
  label,
  description,
  error,
  disabled = false,
  labels,
}: SharedAvatarUploadProps) {
  const INPUT_REF = React.useRef<HTMLInputElement>(null)

  const {
    preview,
    fileName,
    fileMeta,
    state,
    error: uploadError,
    handleChange,
    handleClear,
  } = useSharedAvatarUpload({
    value,
    onValueChange,
    errors: {
      invalidType: labels.invalidTypeError,
      tooLarge: labels.tooLargeError,
      readFailed: labels.readFailedError,
    },
  })

  // An image already on the record stays visible even while a
  // new pick is refused, so a rejected pick never blanks the
  // avatar the user already had.
  const SHOWS_IMAGE = preview !== null && state !== "uploading"

  // The preview fills the media slot rather than sitting in a
  // fixed avatar size, and it stays square instead of round:
  // the attachment already owns the rounding of the box, and
  // an avatar inside a rounded square would read as a circle
  // punched into a card.
  const MEDIA =
    state === "uploading" ? (
      <Spinner />
    ) : SHOWS_IMAGE ? (
      <Avatar className="size-full rounded-none">
        <AvatarImage
          src={preview ?? ""}
          alt={label}
          className="rounded-none"
        />
        <AvatarFallback className="rounded-none">
          <IconPhoto />
        </AvatarFallback>
      </Avatar>
    ) : state === "error" ? (
      <IconFileCode />
    ) : (
      <IconPhoto />
    )

  // A refusal replaces the meta line, because it is the one
  // thing the user has to do something about right now.
  const DESCRIPTION =
    state === "uploading"
      ? labels.uploadingDescription
      : (uploadError ?? fileMeta ?? labels.emptyDescription)

  // The card is the click target, so the trigger forwards to
  // the input rather than the input covering the card itself.
  // Keeping the input out of the layout is what lets the
  // attachment own the whole surface.
  function OpenPicker() {
    INPUT_REF.current?.click()
  }

  return (
    <Field data-invalid={error ? "true" : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <FieldContent>
        <Attachment
          state={state}
          orientation="vertical"
          className="w-full"
        >
          <AttachmentMedia
            variant={SHOWS_IMAGE ? "image" : "icon"}
          >
            {MEDIA}
          </AttachmentMedia>

          <AttachmentContent>
            <AttachmentTitle>
              {fileName ?? labels.emptyTitle}
            </AttachmentTitle>

            <AttachmentDescription>
              {DESCRIPTION}
            </AttachmentDescription>
          </AttachmentContent>

          <AttachmentActions>
            <AttachmentAction
              aria-label={labels.removeAction}
              disabled={disabled}
              onClick={handleClear}
            >
              <IconX />
            </AttachmentAction>
          </AttachmentActions>

          <AttachmentTrigger
            type="button"
            aria-label={labels.uploadAction}
            disabled={disabled}
            onClick={OpenPicker}
            className="cursor-pointer"
          />
        </Attachment>

        <input
          ref={INPUT_REF}
          id={id}
          type="file"
          accept={AVATAR_UPLOAD_ACCEPT}
          className="sr-only"
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          onChange={handleChange}
        />

        <input type="hidden" name={name} value={value ?? ""} />

        {description && (
          <FieldDescription>{description}</FieldDescription>
        )}

        <FieldError>{error}</FieldError>
      </FieldContent>
    </Field>
  )
}

export { SharedAvatarUpload }
