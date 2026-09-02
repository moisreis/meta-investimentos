import { describe, expect, it, vi } from "vitest";

import { DomainEvent } from "@/business/domain-events/domain-event";

class SampleEvent extends DomainEvent {}

describe("DomainEvent", () => {
  it("defaults occurredAt to the current time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));

    const EVENT = new SampleEvent();

    expect(EVENT.occurredAt).toEqual(new Date("2026-01-01T00:00:00Z"));

    vi.useRealTimers();
  });

  it("uses the provided occurredAt", () => {
    const OCCURRED_AT = new Date("2025-05-10T12:00:00Z");

    const EVENT = new SampleEvent(OCCURRED_AT);

    expect(EVENT.occurredAt).toBe(OCCURRED_AT);
  });
});
