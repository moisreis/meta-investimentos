import { NotificationsDropdown } from "./main-notifications-dropdown"

/**
 * @summary
 * Mounts the notifications bell in the header.
 *
 * @remarks
 * A thin wrapper so the header names the slot rather than the
 * dropdown it happens to render today.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function MainNotificationsToggle() {
  return <NotificationsDropdown />
}

export { MainNotificationsToggle }
