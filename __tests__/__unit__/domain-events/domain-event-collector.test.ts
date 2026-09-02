import { describe, expect, it } from "vitest";

import { DomainEvent } from "@/business/domain-events/domain-event";
import { DomainEventCollector } from "@/business/domain-events/domain-event-collector";

class SampleEvent extends DomainEvent {}

describe("DomainEventCollector", () => {
  it("records events and pulls them in recording order", () => {
    const COLLECTOR = new DomainEventCollector();
    const A = new SampleEvent();
    const B = new SampleEvent();

    COLLECTOR.record(A);
    COLLECTOR.record(B);

    const EVENTS = COLLECTOR.pullAll();

    expect(EVENTS).toEqual([A, B]);
  });

  it("clears the collector after a pull", () => {
    const COLLECTOR = new DomainEventCollector();

    COLLECTOR.record(new SampleEvent());

    COLLECTOR.pullAll();

    expect(COLLECTOR.pullAll()).toEqual([]);
    expect(COLLECTOR.size()).toBe(0);
  });

  it("returns an empty array when no events were recorded", () => {
    const COLLECTOR = new DomainEventCollector();

    expect(COLLECTOR.pullAll()).toEqual([]);
  });

  it("reports the number of recorded events", () => {
    const COLLECTOR = new DomainEventCollector();

    expect(COLLECTOR.size()).toBe(0);

    COLLECTOR.record(new SampleEvent());

    expect(COLLECTOR.size()).toBe(1);
  });
});
