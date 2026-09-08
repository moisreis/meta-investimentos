"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * The operational state of the platform as reported by the health
 * endpoint.
 */
export type SystemHealthStatus = "healthy" | "degraded" | "down";

/**
 * The result of a single health sub-check.
 */
export interface SystemHealthCheck {
  name: string;
  status: SystemHealthStatus;
  message?: string;
}

/**
 * How often the health probe is refreshed, in milliseconds.
 */
const REFRESH_INTERVAL_MS = 60_000;

/**
 * Provides the platform health status.
 *
 * Polls `/api/system/health` on mount and every
 * {@link REFRESH_INTERVAL_MS} thereafter so the indicator stays live.
 * Transient fetch failures keep the last known state instead of
 * flashing the interface.
 */
export function useSystemHealth() {
  const [STATUS, SET_STATUS] = useState<SystemHealthStatus | null>(null);
  const [CHECKS, SET_CHECKS] = useState<SystemHealthCheck[]>([]);

  const REFRESH = useCallback(async () => {
    try {
      const RESPONSE = await fetch("/api/system/health", {
        cache: "no-store",
      });
      if (!RESPONSE.ok) {
        return;
      }
      const ENVELOPE = (await RESPONSE.json()) as {
        data?: {
          status?: SystemHealthStatus;
          checks?: SystemHealthCheck[];
        };
      };
      if (ENVELOPE.data?.status) {
        SET_STATUS(ENVELOPE.data.status);
        SET_CHECKS(ENVELOPE.data.checks ?? []);
      }
    } catch {
      // Gracefully keep the last known state when the request fails.
    }
  }, []);

  useEffect(() => {
    void REFRESH();
    const INTERVAL = setInterval(() => void REFRESH(), REFRESH_INTERVAL_MS);
    return () => clearInterval(INTERVAL);
  }, [REFRESH]);

  return { STATUS, CHECKS, REFRESH };
}
