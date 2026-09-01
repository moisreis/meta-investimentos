/**
 * Base class for all domain-layer errors.
 *
 * A `DomainError` represents a violation of a business rule or
 * domain invariant. It is distinct from infrastructure errors
 * (database failures, network timeouts) and application errors
 * (orchestration failures).
 *
 * Domain errors should be thrown by entities, value objects,
 * and domain services when an invariant is breached. Use
 * the specific subclasses for categorization at the application
 * and presentation layers.
 *
 * @example
 * ```ts
 * throw new ValidationError("User must have a valid email.")
 * ```
 */
export class DomainError extends Error {
  /**
   * Creates a `DomainError` with the provided message.
   *
   * @param message - A human-readable description of the
   * domain invariant that was violated.
   */
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}
