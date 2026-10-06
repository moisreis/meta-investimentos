"use client"

import { useCallback } from "react"

import { useOptionalNotifications } from "@/presentation/parts/layout/main/main-notifications-context"

import type { AuditNotification } from "@/presentation/parts/audit/shared-audit-notification.types"

/**
 * @summary
 * Returns the callback that raises a notification for a
 * completed action.
 *
 * @remarks
 * Every mutation already reports what it recorded in its
 * success result, so this is the one place that turns that
 * report into something the user sees. The shared form, row
 * action and bulk delete hooks call it after a successful
 * submit, which is what puts the notification on screen the
 * instant the action lands rather than on a later refresh.
 *
 * Outside the main shell the provider is absent, and the
 * callback is inert: announcing an action must not decide
 * whether an action runs.
 *
 * @explanation
 * Use in any hook that awaits a mutation action result, so a
 * new place that mutates picks the behaviour up by calling it
 * rather than by rewiring the notification list.
 *
 * @returns A callback taking the audit payload of the action,
 *   which does nothing when there is none.
 *
 * @example
 * const NOTIFY = useSharedAuditNotification();
 * const RESULT = await SUBMIT(VALUES);
 * if (RESULT.success) NOTIFY(RESULT.audit);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function useSharedAuditNotification() {
  const { notify } = useOptionalNotifications()

  return useCallback(
    (audit: AuditNotification | undefined) => {
      if (audit) notify(audit)
    },
    [notify]
  )
}

export { useSharedAuditNotification }
