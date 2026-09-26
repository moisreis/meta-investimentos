import { DomainError } from "@errors/domain.error"

/**
 * @summary
 * Represents an error thrown when domain validation rules
 * or business invariants are violated.
 *
 * @remarks
 * Extends **DomainError** to preserve domain exception
 * hierarchy. Sets the `name` property explicitly to
 * **ValidationError** for accurate error classification.
 *
 * @explanation
 * Use this error class when input parameters or entity
 * state updates fail validation checks. It enables API layer
 * handlers to catch validation issues and report input
 * errors to the client.
 *
 * @param message - Detailed text describing the validation
 *                  failure.
 *
 * @example
 * throw new ValidationError("Invalid email address.");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}
