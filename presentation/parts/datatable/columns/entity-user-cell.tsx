import { SharedUserAvatar } from "@/presentation/parts/components/shared-user-avatar"

import { EntityFallbackCell } from "./entity-fallback-cell"

/**
 * A user a row attributes an action to.
 */
export interface EntityUserCellUser {
  // First name of the user.
  firstName: string

  // Last name of the user.
  lastName: string

  // Optional avatar image URL.
  image?: string | null
}

/**
 * Props for the entity user cell.
 */
export interface EntityUserCellProps {
  // The user behind the row, or null when the row records no
  // one.
  user: EntityUserCellUser | null | undefined
}

/**
 * @summary
 * Renders the user a datatable row attributes an action to.
 *
 * @remarks
 * A row that records an action usually records who took it:
 * the owner of a portfolio, the account that generated a
 * statement. The cell is the avatar and the name, or the quiet
 * fallback when the row attributes the action to no one, since
 * a system-generated row is the exception rather than an
 * error.
 *
 * Taking the nullable user whole is what keeps the route from
 * spelling out the branch, so every attributed column resolves
 * a missing user the same way.
 *
 * @explanation
 * Use for a column that names the user behind a row, instead
 * of repeating the null check around the shared avatar.
 *
 * @param props - Props of the user cell.
 * @param props.user - The user behind the row, or null.
 *
 * @returns The user cell.
 *
 * @example
 * <EntityUserCell user={options.summaryFor(row.id)?.owner} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function EntityUserCell({ user }: EntityUserCellProps) {
  if (!user) {
    return <EntityFallbackCell />
  }

  return (
    <SharedUserAvatar
      firstName={user.firstName}
      lastName={user.lastName}
      image={user.image}
    />
  )
}

export { EntityUserCell }
