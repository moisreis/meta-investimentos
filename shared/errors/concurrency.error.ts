import { DomainError } from "./domain.error";

/**
 * Thrown when a concurrent modification conflict is detected.
 *
 * A `ConcurrencyError` signals that an entity was modified by
 * another process between the time it was read and the time
 * the current process attempted to write. This is relevant
 * for financial data where multiple operations may target the
 * same record.
 *
 * At the HTTP boundary, a `ConcurrencyError` maps to a
 * `409 Conflict` response.
 *
 * @example
 * ```ts
 * throw new ConcurrencyError(
 *   "Position with id abc-123 was modified by another operation."
 * )
 * ```
 */
export class ConcurrencyError extends DomainError {
  /**
   * Creates a `ConcurrencyError` with the provided message.
   *
   * @param message - A human-readable description of the
   * concurrency conflict.
   */
  constructor(message: string) {
    super(message);
    this.name = "ConcurrencyError";
  }
}
