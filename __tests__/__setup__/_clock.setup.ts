import { vi } from "vitest"

const FIXED_DATE = new Date("2026-01-15T12:00:00.000Z")

/**
 * Uses fake timers with a fixed date for deterministic tests.
 * Call this in test files that need a fixed clock.
 */
export function useFixedClock(): void {
  vi.useFakeTimers({ now: FIXED_DATE })
}

/**
 * Restores real timers.
 * Call in afterEach or afterAll to clean up.
 */
export function useRealClock(): void {
  vi.useRealTimers()
}

/**
 * Returns the fixed date used by the fake clock.
 */
export function getFixedDate(): Date {
  return new Date(FIXED_DATE)
}

/**
 * Advances the fake clock by the specified milliseconds.
 */
export function advanceTime(ms: number): void {
  vi.advanceTimersByTime(ms)
}

/**
 * Advances the fake clock to a specific date.
 */
export function setFixedDate(date: Date): void {
  vi.setSystemTime(date)
}

/**
 * Returns an ISO string of the fixed date (UTC midnight).
 */
export function getFixedDateISO(): string {
  return FIXED_DATE.toISOString()
}

/**
 * Returns a date string in YYYY-MM-DD format for the fixed date.
 */
export function getFixedDateString(): string {
  return FIXED_DATE.toISOString().split("T")[0]
}
