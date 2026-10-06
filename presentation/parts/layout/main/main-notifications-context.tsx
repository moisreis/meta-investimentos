"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react"

import { PRESENTER_FALLBACK } from "@/presentation/constants/presenter.constants"
import type { AuditNotification } from "@/presentation/parts/audit/shared-audit-notification.types"
import type { UserIdentity } from "@/presentation/types/user-identity.types"

/**
 * @summary
 * A completed action the header bell reports to the user.
 *
 * @remarks
 * The action and the entity are kept as the recorded tokens
 * rather than as finished sentences, so the notification and
 * the audit log screen resolve them through the same tables
 * and word the same act the same way. The rendering happens
 * when the row is shown, not when it arrives.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export interface Notification {
  id: string
  action: string
  entity: string
  entityName: string
  actor: string
  timestamp: Date
  read: boolean
}

// A notification before the provider stamps who did it, the
// instant it happened and whether it was new.
type NotificationDraft = Omit<
  Notification,
  "id" | "read" | "actor" | "timestamp"
>

type NotificationAction =
  | {
      type: "ADD"
      payload: NotificationDraft & {
        actor: string
        timestamp: Date
      }
    }
  | { type: "REMOVE"; payload: string }
  | { type: "MARK_READ"; payload: string }
  | { type: "CLEAR_ALL" }

/**
 * @summary
 * Folds one notification command into the current list.
 *
 * @remarks
 * A new notification goes to the front, so the bell reads
 * newest first, and it starts unread so the count badge moves
 * the moment an action lands.
 *
 * @param state - The notifications currently listed.
 * @param action - The command to fold in.
 *
 * @returns The next list of notifications.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function notificationReducer(
  state: Notification[],
  action: NotificationAction
): Notification[] {
  switch (action.type) {
    case "ADD":
      return [
        {
          ...action.payload,
          id: crypto.randomUUID(),
          read: false,
        },
        ...state,
      ]
    case "REMOVE":
      return state.filter(
        (notification) => notification.id !== action.payload
      )
    case "MARK_READ":
      return state.map((notification) =>
        notification.id === action.payload
          ? { ...notification, read: true }
          : notification
      )
    case "CLEAR_ALL":
      return []
    default:
      return state
  }
}

interface NotificationContextType {
  notifications: Notification[]
  notify: (notification: AuditNotification) => void
  removeNotification: (id: string) => void
  markAsRead: (id: string) => void
  clearAll: () => void
  unreadCount: number
}

const NotificationContext =
  createContext<NotificationContextType | null>(null)

interface NotificationProviderProps {
  children: ReactNode
  // The signed-in user, resolved once by the route layout. The
  // provider stamps it on every notification, because the
  // acting user is known from the session and asking each
  // action to send it would put a name on the wire for
  // something the browser already has.
  user: UserIdentity | null
}

/**
 * @summary
 * Owns the notifications the header bell lists.
 *
 * @remarks
 * Holds the live list for the signed-in session. Nothing is
 * persisted: these are the acts of the moment, and the audit
 * log screen is the durable history, so a reload starts from
 * an empty list rather than replaying yesterday.
 *
 * @explanation
 * Use once in the main shell so every screen shares the same
 * list, and read it through `useNotifications` or
 * `useSharedAuditNotification`.
 *
 * @param props - The provider props.
 * @param props.children - The subtree that can raise a
 *   notification.
 * @param props.user - The signed-in user naming the actor.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function NotificationProvider({
  children,
  user,
}: NotificationProviderProps) {
  const [notifications, dispatch] = useReducer(
    notificationReducer,
    []
  )

  const ACTOR = useMemo(
    () =>
      user ? `${user.firstName} ${user.lastName}`.trim() : "",
    [user]
  )

  const notify = useCallback(
    (notification: AuditNotification) => {
      dispatch({
        type: "ADD",
        payload: {
          action: notification.action,
          entity: notification.entity,
          entityName: notification.entityName ?? "",
          actor: ACTOR || PRESENTER_FALLBACK,
          timestamp: new Date(notification.at),
        },
      })
    },
    [ACTOR]
  )

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: "REMOVE", payload: id })
  }, [])

  const markAsRead = useCallback((id: string) => {
    dispatch({ type: "MARK_READ", payload: id })
  }, [])

  const clearAll = useCallback(() => {
    dispatch({ type: "CLEAR_ALL" })
  }, [])

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length

  const VALUE = useMemo(
    () => ({
      notifications,
      notify,
      removeNotification,
      markAsRead,
      clearAll,
      unreadCount,
    }),
    [
      notifications,
      notify,
      removeNotification,
      markAsRead,
      clearAll,
      unreadCount,
    ]
  )

  return (
    <NotificationContext.Provider value={VALUE}>
      {children}
    </NotificationContext.Provider>
  )
}

/**
 * @summary
 * Reads the notification list.
 *
 * @remarks
 * Throws outside a provider: the header dropdown is only ever
 * rendered inside the main shell, so a missing provider there
 * is a wiring mistake rather than a state to degrade to. A
 * screen that merely wants to announce an action uses
 * `useSharedAuditNotification` instead, which tolerates the
 * absent provider.
 *
 * @returns The notification list and its handlers.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    )
  }

  return context
}

/**
 * @summary
 * Reads the notification list when a provider may be absent.
 *
 * @remarks
 * The shared submit and row-action hooks announce every
 * audited act, including the ones that run outside the main
 * shell, so they cannot assume the provider is mounted. This
 * reader answers with a no-op instead of throwing, which
 * keeps an announcement from deciding whether a form works.
 *
 * @returns The handlers when a provider is mounted, and inert
 *   ones when it is not.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function useOptionalNotifications(): NotificationContextType {
  return (
    useContext(NotificationContext) ?? {
      notifications: [],
      notify: () => undefined,
      removeNotification: () => undefined,
      markAsRead: () => undefined,
      clearAll: () => undefined,
      unreadCount: 0,
    }
  )
}

export {
  NotificationContext,
  NotificationProvider,
  useNotifications,
  useOptionalNotifications,
}
