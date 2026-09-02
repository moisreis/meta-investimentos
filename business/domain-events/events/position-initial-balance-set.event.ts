import type { EntityId } from "@/business/value-objects/entity-id.vo";

import { DomainEvent } from "../domain-event";

/**
 * Represents the event that records a change of a position's initial
 * balance.
 *
 * The event carries the id of the position whose initial balance was
 * set. The code records this event when a {@link Position} has its
 * initial balance updated.
 *
 * `PositionInitialBalanceSet` instances are immutable after creation.
 */
export class PositionInitialBalanceSet extends DomainEvent {
  /**
   * The id of the position whose initial balance was set.
   */
  readonly positionId: EntityId;

  /**
   * Creates a `PositionInitialBalanceSet` event.
   *
   * @param positionId - The id of the position.
   * @param occurredAt - The instant the balance was set.
   */
  constructor(positionId: EntityId, occurredAt: Date = new Date()) {
    super(occurredAt);
    this.positionId = positionId;
  }
}
