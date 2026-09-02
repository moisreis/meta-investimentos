import type { EntityId } from "@/business/value-objects/entity-id.vo";

import { DomainEvent } from "../domain-event";

/**
 * Represents the event that records a reversal of an application.
 *
 * The event carries the id of the reversed application and the id of
 * the user who reversed it. The code records this event when an
 * {@link Application} is reversed.
 *
 * `ApplicationReversed` instances are immutable after creation.
 */
export class ApplicationReversed extends DomainEvent {
  /**
   * The id of the reversed application.
   */
  readonly applicationId: EntityId;

  /**
   * The id of the user who reversed the application.
   */
  readonly reversedByUserId: EntityId;

  /**
   * Creates an `ApplicationReversed` event.
   *
   * @param applicationId - The id of the reversed application.
   * @param reversedByUserId - The id of the user who reversed it.
   * @param occurredAt - The instant the reversal occurred.
   */
  constructor(
    applicationId: EntityId,
    reversedByUserId: EntityId,
    occurredAt: Date = new Date(),
  ) {
    super(occurredAt);
    this.applicationId = applicationId;
    this.reversedByUserId = reversedByUserId;
  }
}
