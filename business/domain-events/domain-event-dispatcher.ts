import type { DomainEvent } from "./domain-event";

/**
 * Handles a {@link DomainEvent} published by a
 * {@link DomainEventDispatcher}.
 */
export type DomainEventHandler = (event: DomainEvent) => void;

/**
 * Publishes domain events that entities record during state
 * transitions.
 *
 * The application layer registers one or more handlers with
 * {@link DomainEventDispatcher.subscribe}. When the {@link UnitOfWork}
 * dispatches the events an entity recorded, the dispatcher invokes
 * every handler that subscribed to that event type, in subscription
 * order.
 *
 * The dispatcher is a lightweight, in-process publisher. It does not
 * persist events. A handler that must survive an application restart
 * belongs in the persistence layer.
 */
export class DomainEventDispatcher {
  private readonly handlers: DomainEventHandler[] = [];

  /**
   * Registers a handler for every domain event.
   *
   * @param handler - The handler invoked for each published event.
   * @returns A function that removes the handler.
   */
  subscribe(handler: DomainEventHandler): () => void {
    this.handlers.push(handler);

    return () => {
      const INDEX = this.handlers.indexOf(handler);

      if (INDEX >= 0) {
        this.handlers.splice(INDEX, 1);
      }
    };
  }

  /**
   * Publishes a domain event to every subscribed handler.
   *
   * @param event - The domain event to publish.
   */
  dispatch(event: DomainEvent): void {
    for (const handler of this.handlers) {
      handler(event);
    }
  }

  /**
   * Returns the number of subscribed handlers.
   *
   * @returns The number of subscribed handlers.
   */
  handlerCount(): number {
    return this.handlers.length;
  }
}
