import type { EntityId } from "@/business/value-objects/entity-id.vo";

import { DomainEvent } from "../domain-event";

/**
 * Represents the event that records a reversal of a withdrawal.
 *
 * The event carries the id of the reversed withdrawal and the id of
 * the user who reversed it. The code records this event when a
 * {@link Withdrawal} is reversed.
 *
 * `WithdrawalReversed` instances are immutable after creation.
 */
export class WithdrawalReversed extends DomainEvent {
  /**
   * The id of the reversed withdrawal.
   */
  readonly withdrawalId: EntityId;

  /**
   * The id of the user who reversed the withdrawal.
   */
  readonly reversedByUserId: EntityId;

  /**
   * Creates a `WithdrawalReversed` event.
   *
   * @param withdrawalId - The id of the reversed withdrawal.
   * @param reversedByUserId - The id of the user who reversed it.
   * @param occurredAt - The instant the reversal occurred.
   */
  constructor(
    withdrawalId: EntityId,
    reversedByUserId: EntityId,
    occurredAt: Date = new Date(),
  ) {
    super(occurredAt);
    this.withdrawalId = withdrawalId;
    this.reversedByUserId = reversedByUserId;
  }
}
