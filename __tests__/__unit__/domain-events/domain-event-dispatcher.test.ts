import { describe, expect, it, vi } from "vitest";

import { DomainEvent } from "@/business/domain-events/domain-event";
import { DomainEventDispatcher } from "@/business/domain-events/domain-event-dispatcher";

class SampleEvent extends DomainEvent {}

describe("DomainEventDispatcher", () => {
  it("publishes an event to every subscribed handler", () => {
    const DISPATCHER = new DomainEventDispatcher();
    const HANDLER_A = vi.fn();
    const HANDLER_B = vi.fn();
    const EVENT = new SampleEvent();

    DISPATCHER.subscribe(HANDLER_A);
    DISPATCHER.subscribe(HANDLER_B);

    DISPATCHER.dispatch(EVENT);

    expect(HANDLER_A).toHaveBeenCalledTimes(1);
    expect(HANDLER_A).toHaveBeenCalledWith(EVENT);
    expect(HANDLER_B).toHaveBeenCalledTimes(1);
    expect(HANDLER_B).toHaveBeenCalledWith(EVENT);
  });

  it("does not publish an event when no handler is subscribed", () => {
    const DISPATCHER = new DomainEventDispatcher();

    expect(() => DISPATCHER.dispatch(new SampleEvent())).not.toThrow();
  });

  it("stops publishing to a handler after its subscription is removed", () => {
    const DISPATCHER = new DomainEventDispatcher();
    const HANDLER = vi.fn();

    const UNSUBSCRIBE = DISPATCHER.subscribe(HANDLER);

    DISPATCHER.dispatch(new SampleEvent());
    UNSUBSCRIBE();
    DISPATCHER.dispatch(new SampleEvent());

    expect(HANDLER).toHaveBeenCalledTimes(1);
  });

  it("reports the number of subscribed handlers", () => {
    const DISPATCHER = new DomainEventDispatcher();

    expect(DISPATCHER.handlerCount()).toBe(0);

    DISPATCHER.subscribe(() => {});
    DISPATCHER.subscribe(() => {});

    expect(DISPATCHER.handlerCount()).toBe(2);
  });

  it("publishes to handlers in subscription order", () => {
    const DISPATCHER = new DomainEventDispatcher();
    const ORDER: number[] = [];

    DISPATCHER.subscribe(() => ORDER.push(1));
    DISPATCHER.subscribe(() => ORDER.push(2));

    DISPATCHER.dispatch(new SampleEvent());

    expect(ORDER).toEqual([1, 2]);
  });
});
