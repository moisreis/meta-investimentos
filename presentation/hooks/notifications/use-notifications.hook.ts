"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * The public shape of a single notification returned by the
 * `/api/notifications` endpoint.
 */
export interface NotificationItem {
  id: string;
  entity: string;
  entityId: string;
  action: string;
  createdAt: string;
}

const EMPTY: NotificationItem[] = [];

/**
 * Provides the current user's audit-registered notifications.
 *
 * Loads the feed from `/api/notifications` on mount and exposes a
 * `REFRESH` action so the consumer can re-pull on demand (for example
 * when the notification menu opens). Transient fetch failures keep the
 * previously loaded list instead of crashing the interface.
 */
export function useNotifications() {
  const [NOTIFICATIONS, SET_NOTIFICATIONS] =
    useState<NotificationItem[]>(EMPTY);
  const [IS_LOADING, SET_IS_LOADING] = useState(true);

  const REFRESH = useCallback(async () => {
    try {
      const RESPONSE = await fetch("/api/notifications", {
        cache: "no-store",
      });
      if (!RESPONSE.ok) {
        return;
      }
      const ENVELOPE = (await RESPONSE.json()) as {
        data?: { notifications?: NotificationItem[] };
      };
      SET_NOTIFICATIONS(ENVELOPE.data?.notifications ?? EMPTY);
    } catch {
      // Gracefully keep the last known feed when the request fails.
    } finally {
      SET_IS_LOADING(false);
    }
  }, []);

  useEffect(() => {
    void REFRESH();
  }, [REFRESH]);

  return {
    NOTIFICATIONS,
    COUNT: NOTIFICATIONS.length,
    IS_LOADING,
    REFRESH,
  };
}
