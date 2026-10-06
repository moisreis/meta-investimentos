"use client"

import { IconBell, IconCheck, IconX } from "@tabler/icons-react"
import { cn } from "cn"

import { PRESENTER_FALLBACK } from "@/presentation/constants/presenter.constants"
import { Badge } from "@/presentation/ui/badge"
import { Button } from "@/presentation/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/presentation/ui/popover"

import { FormatAuditAction } from "@/presentation/parts/audit/shared-format-audit-action.helper"
import { FormatAuditEntity } from "@/presentation/parts/audit/shared-format-audit-entity.helper"

import { useNotifications } from "./main-notifications-context"
import type { Notification } from "./main-notifications-context"

/**
 * @summary
 * Resolves the gutter mark of one notification.
 *
 * @remarks
 * The list lives for the session, so an entry is either from
 * today or from a day that rolled over while the tab stayed
 * open. The clock alone answers the first case, and the day
 * answers the second. No year is ever in play.
 *
 * @param value - When the action finished.
 *
 * @returns The clock for today, the day otherwise.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
function FormatMoment(value: Date): string {
  const NOW = new Date()
  const SAME_DAY =
    value.getFullYear() === NOW.getFullYear() &&
    value.getMonth() === NOW.getMonth() &&
    value.getDate() === NOW.getDate()

  return SAME_DAY
    ? value.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : value.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })
}

interface NotificationRowProps {
  // The entry to render.
  notification: Notification

  // Acknowledges one entry without dropping it.
  onMarkAsRead: (id: string) => void

  // Drops one entry from the session list.
  onRemove: (id: string) => void
}

/**
 * @summary
 * Renders one line of the register.
 *
 * @remarks
 * The line splits into three slots: the gutter carries the
 * moment in tabular figures so the hours stack into a column,
 * the body names what happened, and the actions sit at the
 * right edge where they stay reachable by keyboard without
 * ever being the first thing the eye lands on.
 *
 * An entry still waiting on the user is struck in ink — a
 * margin rule at the left edge and a full-strength record
 * name — while an entry already read drops to the muted
 * tone. The badge keeps its own colour either way, because
 * the audit log screen words the same act with the same
 * badge and neither surface may take it away.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
function NotificationRow({
  notification,
  onMarkAsRead,
  onRemove,
}: NotificationRowProps) {
  const ACTION = FormatAuditAction(notification.action)
  const UNREAD = !notification.read
  const ENTITY = FormatAuditEntity(notification.entity)
  const KNOWN_ACTOR = notification.actor !== PRESENTER_FALLBACK

  return (
    <li className="relative border-b border-border last:border-b-0">
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 w-0.5 transition-colors duration-150",
          UNREAD ? "bg-foreground" : "bg-transparent"
        )}
      />

      <div className="flex items-start gap-2 px-3 py-2.5">
        <time
          dateTime={notification.timestamp.toISOString()}
          className={cn(
            "w-11 shrink-0 text-xs leading-6 tabular-nums",
            "transition-colors duration-150",
            UNREAD ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {FormatMoment(notification.timestamp)}
        </time>

        <div className="min-w-0 flex-1">
          <div className="flex min-h-6 flex-wrap items-center gap-x-1.5 gap-y-1">
            <Badge variant={ACTION.variant}>
              {ACTION.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {ENTITY}
              {notification.entityName ? (
                <span
                  className={cn(
                    "font-medium transition-colors duration-150",
                    UNREAD && "text-foreground"
                  )}
                >
                  {" "}
                  {notification.entityName}
                </span>
              ) : null}
            </span>
          </div>

          {KNOWN_ACTOR ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              por {notification.actor}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-start gap-0.5">
          {UNREAD ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Marcar como lida"
              title="Marcar como lida"
              onClick={() => onMarkAsRead(notification.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <IconCheck aria-hidden="true" />
            </Button>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remover"
            title="Remover"
            onClick={() => onRemove(notification.id)}
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <IconX aria-hidden="true" />
          </Button>
        </div>
      </div>
    </li>
  )
}

/**
 * @summary
 * Renders the header bell and the register of notifications
 * it opens.
 *
 * @remarks
 * The panel reads as a register rather than a stack of cards:
 * a quiet secondary band heads it, a hairline closes it, a
 * time gutter runs down the left in tabular figures, and
 * further hairlines separate the entries. An entry still
 * waiting on the user is struck in ink and one already read
 * sinks to the muted tone, so the eye lands on what is new
 * before it reads a word.
 *
 * There is no colour for "new" in this palette, so unread is
 * carried by weight instead of a tint — the blue the bell
 * used to wear belongs to no token in the system. The count
 * chip answers the bell alone, which keeps the number in one
 * place, while the band holds the title and the single clear
 * control where the old duplicate in the footer used to be.
 *
 * The clear control stays on the ghost variant, but it
 * carries a foreground wash on hover: `muted`, `secondary`
 * and `accent` all resolve to one value in both themes, so
 * the ghost hover would otherwise be the band's own colour
 * and the button would appear not to react at all.
 *
 * The bell used to be toggled by hand through
 * `document.getElementById`, which left the panel with no
 * escape key, no outside click and no expanded state for a
 * screen reader. The popover primitive supplies all three,
 * and lets a row acknowledge or drop itself without closing
 * the panel on top of the next one.
 *
 * @explanation
 * Use in the header. The list lives for the session — these
 * are the acts of the moment — and the audit log screen is
 * the durable history behind them.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
function NotificationsDropdown() {
  const {
    notifications,
    removeNotification,
    markAsRead,
    clearAll,
    unreadCount,
  } = useNotifications()

  const BELL_LABEL =
    unreadCount > 0
      ? `Notificações, ${unreadCount} ${
          unreadCount === 1 ? "não lida" : "não lidas"
        }`
      : "Notificações"

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={BELL_LABEL}
            className="relative"
          />
        }
      >
        <IconBell aria-hidden="true" />

        {unreadCount > 0 ? (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-primary text-[11px] leading-none font-medium text-primary-foreground"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 gap-0 overflow-hidden p-0 motion-reduce:animate-none!"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary px-3 py-2">
          <PopoverTitle className="font-heading text-secondary-foreground">
            Notificações
          </PopoverTitle>

          <PopoverDescription className="sr-only">
            Movimentações registradas nesta sessão.
          </PopoverDescription>

          {notifications.length > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-secondary-foreground hover:bg-secondary-foreground/10 dark:hover:bg-secondary-foreground/10"
            >
              Limpar todas
            </Button>
          ) : null}
        </div>

        {notifications.length === 0 ? (
          <div className="py-6 pr-4 pl-3">
            <p className="text-sm text-foreground">
              Nenhuma notificação
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              As ações concluídas nesta sessão aparecem aqui.
            </p>
          </div>
        ) : (
          <ul className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onRemove={removeNotification}
              />
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}

export { NotificationsDropdown }
