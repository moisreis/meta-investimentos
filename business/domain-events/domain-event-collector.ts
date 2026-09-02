import type { DomainEvent } from "./domain-event";

/**
 * Collects the domain events an entity records during state
 * transitions.
 *
 * An entity holds a private `DomainEventCollector`. Each transition
 * that changes the entity's state records an event through
 * {@link DomainEventCollector.record}. The {@link UnitOfWork} or a
 * caller pulls the recorded events with
 * {@link DomainEventCollector.pullAll} after the transition and
 * dispatches them.
 *
 * The collector stores events in recording order and emits them in
 * that same order. A pull clears the collector, so each event is
 * dispatched at most once.
 */
export class DomainEventCollector {
  private readonly events: DomainEvent[] = [];

  /**
   * Records a domain event.
   *
   * @param event - The domain event to record.
   */
  record(event: DomainEvent): void {
    this.events.push(event);
  }

  /**
   * Returns the recorded domain events and clears the collector.
   *
   * @returns The recorded domain events in recording order.
   */
  pullAll(): DomainEvent[] {
    const RECORDED = [...this.events];

    this.events.length = 0;

    return RECORDED;
  }

  /**
   * Returns the number of recorded domain events.
   *
   * @returns The number of recorded domain events.
   */
  size(): number {
    return this.events.length;
  }
}
