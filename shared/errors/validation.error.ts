import { DomainError } from "./domain.error";

/**
 * Thrown when a domain invariant is violated during entity or
 * value object creation.
 *
 * A `ValidationError` signals that the input data does not
 * satisfy the business rules of the domain. It is the most
 * common domain error and should be used for all invariant
 * violations in factories and calculators.
 *
 * At the HTTP boundary, a `ValidationError` maps to a
 * `400 Bad Request` response.
 *
 * @example
 * ```ts
 * throw new ValidationError(
 *   "User must have a valid email."
 * )
 * ```
 */
export class ValidationError extends DomainError {
  /**
   * Creates a `ValidationError` with the provided message.
   *
   * @param message - A human-readable description of the
   * validation rule that was violated.
   */
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
