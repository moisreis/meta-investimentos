import type { EntityId } from "@/business/value-objects/entity-id.vo";

import { DomainEvent } from "../domain-event";

/**
 * Represents the event that records a change of a portfolio's
 * allocation bounds.
 *
 * The event carries the id of the portfolio whose allocation changed.
 * The code records this event when a {@link Portfolio} has its
 * allocation bounds updated.
 *
 * `PortfolioAllocationUpdated` instances are immutable after creation.
 */
export class PortfolioAllocationUpdated extends DomainEvent {
  /**
   * The id of the portfolio whose allocation was updated, or `undefined`
   * when the portfolio has not been persisted yet.
   */
  readonly portfolioId: EntityId | undefined;

  /**
   * Creates a `PortfolioAllocationUpdated` event.
   *
   * @param portfolioId - The id of the portfolio, or `undefined` when
   * the portfolio has not been persisted yet.
   * @param occurredAt - The instant the allocation changed.
   */
  constructor(
    portfolioId: EntityId | undefined,
    occurredAt: Date = new Date(),
  ) {
    super(occurredAt);
    this.portfolioId = portfolioId;
  }
}
