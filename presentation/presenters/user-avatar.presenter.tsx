import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar"
import type { JSX } from "react"
import { cn } from "cn"

/**
 * Props of the **UserAvatar** presenter component.
 */
export interface UserAvatarProps {
  // First name of the user.
  firstName: string

  // Last name of the user.
  lastName: string

  // Optional avatar image URL.
  image?: string | null

  // Extra classes applied to the root element.
  className?: string
}

/**
 * @summary
 * Renders a small avatar followed by the user's full name.
 *
 * @remarks
 * Shows the avatar image when available; otherwise initials.
 * Forces a fixed size-5 (20px) avatar with inline dimensions.
 *
 * @explanation
 * Use this component to identify users in lists, headers,
 * or comment sections. It composes the UI avatar with the
 * user's image or initials and renders the full name next
 * to it. The avatar keeps a fixed small size for density.
 *
 * @param props - Props of the component.
 * @param props.firstName - First name of the user.
 * @param props.lastName - Last name of the user.
 * @param props.image - Avatar image URL when present.
 * @param props.className - Extra classes for the root.
 * @returns Initials avatar with the full name.
 *
 * @example
 * <UserAvatar firstName="Maria" lastName="Silva" />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export function UserAvatar({
  firstName,
  lastName,
  image,
  className,
}: UserAvatarProps): JSX.Element {
  const FULL_NAME = `${firstName} ${lastName}`.trim()
  const INITIALS =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Avatar
        size="sm"
        className="shrink-0"
        style={{ width: "1.25rem", height: "1.25rem" }}
      >
        {image ? (
          <AvatarImage src={image} alt={FULL_NAME} />
        ) : (
          <AvatarFallback>{INITIALS || "?"}</AvatarFallback>
        )}
      </Avatar>
      <span className="text-sm font-normal">
        {FULL_NAME || "-"}
      </span>
    </div>
  )
}
