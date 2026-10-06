import Link from "next/link"
import { cn } from "cn"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/presentation/ui/avatar"
import { EntityFallbackCell } from "./entity-fallback-cell"

/**
 * Props for the two-line entity lookup cell.
 */
export interface EntityLookupCellProps {
  // Primary text, rendered above the secondary line.
  title: string | null | undefined

  // Secondary text, rendered below the primary line. The
  // line is skipped when the value is nil or blank.
  subtitle?: string | null

  // Draws the leading avatar. Off by default, because an
  // avatar is only legible for a person: on a fund, a bank or
  // a portfolio it is an initials badge beside a name the
  // reader already has, which costs horizontal room in every
  // row and says nothing the name does not.
  showAvatar?: boolean

  // Avatar image URL. Only read when `showAvatar` is set;
  // without it the avatar falls back to the initials of the
  // title, which is what carries a person with no picture.
  image?: string | null

  // Route the cell opens. Absent leaves the cell inert, for a
  // relation the user reads but cannot enter.
  href?: string

  // Extra classes applied to the root element.
  className?: string
}

/**
 * @summary
 * Renders a related entity as a title above a subtitle.
 *
 * @remarks
 * The primary line carries the entity name at a medium
 * weight and the secondary line carries the qualifier, such
 * as a portfolio acronym or a masked CNPJ, in a smaller
 * muted weight. Both lines are truncated so wide values
 * never spill into the neighboring columns of a fluid
 * column. A nil or blank title renders the presenter
 * fallback instead of an empty cell. Passing `href` makes the
 * whole cell the link to the relation, so both lines stay one
 * target instead of only the first line being clickable.
 *
 * The avatar is opt-in through `showAvatar` and stays off for
 * every relation that is not a person. This cell is the one
 * the `Fundo`, `Banco` and `Carteira` columns are built from,
 * and those three are records rather than people: an
 * initials badge beside "Banco do Brasil" repeats the name in
 * a shape nobody reads, so it is dropped and the two lines
 * take the room the avatar was holding. The `Usuários` column
 * is the case that asks for one.
 *
 * @explanation
 * Use this cell for the relation columns of a datatable, such
 * as a `Fundo` or `Carteira` column, so every route resolves
 * and formats its relations the same way. Set `showAvatar`
 * only where the relation is a person.
 *
 * @param props - The lookup lines of the cell.
 * @param props.title - The entity name rendered on top.
 * @param props.subtitle - The qualifier rendered below.
 * @param props.showAvatar - Draws the leading avatar.
 * @param props.image - Optional avatar image URL.
 * @param props.href - Route the cell opens, when it is one.
 * @param props.className - Extra classes for the root.
 *
 * @returns The two-line lookup cell.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function EntityLookupCell({
  title,
  subtitle,
  showAvatar = false,
  image,
  href,
  className,
}: EntityLookupCellProps) {
  const TITLE = title?.trim() ?? ""
  const SUBTITLE = subtitle?.trim() ?? ""

  if (!TITLE) {
    return <EntityFallbackCell />
  }

  const INITIALS = TITLE.split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const LINES = (
    <>
      <p className="truncate font-medium">{TITLE}</p>
      {SUBTITLE ? (
        <p className="truncate text-xs font-normal text-muted-foreground">
          {SUBTITLE}
        </p>
      ) : null}
    </>
  )

  // Built only for a person. Every other relation renders the
  // two lines alone, so the avatar costs nothing when the
  // column is not about somebody.
  const AVATAR = showAvatar ? (
    <Avatar
      size="sm"
      className="shrink-0"
      style={{ width: "1.25rem", height: "1.25rem" }}
    >
      {image ? (
        <AvatarImage src={image} alt={TITLE} />
      ) : (
        <AvatarFallback>{INITIALS || "?"}</AvatarFallback>
      )}
    </Avatar>
  ) : null

  // A lookup cell is usually a destination as well as a
  // reading: the fund column leads to the fund. When the route
  // is given, the whole cell becomes the link to the relation,
  // so the two lines stay one target instead of two lines with a
  // link only on the first.
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "flex w-full min-w-0 items-center gap-2",
          className
        )}
      >
        {AVATAR}
        <div className="min-w-0">{LINES}</div>
      </Link>
    )
  }

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        className
      )}
    >
      {AVATAR}
      <div className="min-w-0">{LINES}</div>
    </div>
  )
}

export { EntityLookupCell }
