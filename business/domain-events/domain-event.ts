/**
 * Represents the data shared by every domain event.
 *
 * A domain event records that something happened in the domain. It
 * carries the instant the event occurred. The code records an event
 * when an entity transition changes its state.
 *
 * A specific event extends `DomainEvent` and adds the data that
 * describes the occurrence, such as the affected aggregate id and the
 * acting user.
 *
 * `DomainEvent` instances are immutable after creation.
 */
export abstract class DomainEvent {
  /**
   * Returns the instant the event occurred.
   */
  readonly occurredAt: Date;

  /**
   * Creates a `DomainEvent`.
   *
   * @param occurredAt - The instant the event occurred, defaulting to
   * the current time.
   */
  constructor(occurredAt: Date = new Date()) {
    this.occurredAt = occurredAt;
  }
}
