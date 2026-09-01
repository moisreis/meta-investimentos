import { DomainError } from "./domain.error";

/**
 * Thrown when a requested domain entity cannot be found.
 *
 * A `NotFoundError` signals that a query for an entity by
 * its identifier or unique attribute returned no result. It
 * should be thrown by repositories when a lookup fails to
 * locate the expected record.
 *
 * At the HTTP boundary, a `NotFoundError` maps to a
 * `404 Not Found` response.
 *
 * @example
 * ```ts
 * throw new NotFoundError("User with id abc-123 was not found.")
 * ```
 */
export class NotFoundError extends DomainError {
  /**
   * Creates a `NotFoundError` with the provided message.
   *
   * @param message - A human-readable description of which
   * entity was not found and by what criteria.
   */
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
