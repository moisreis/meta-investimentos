import { DomainError } from "@errors/domain.error"

/**
 * @summary
 * Represents an error thrown when a requested domain entity
 * or resource cannot be found.
 *
 * @remarks
 * Extends **DomainError** to maintain domain error hierarchy.
 * Explicitly sets the `name` property to **NotFoundError**
 * to allow accurate error identification.
 *
 * @explanation
 * Use this error class when a specific entity or record is
 * missing during business logic execution. It allows upstream
 * handlers to map missing domain resources to appropriate
 * responses, such as a HTTP 404 status.
 *
 * @param message - Detailed text describing the missing
 *                  resource context.
 *
 * @example
 * throw new NotFoundError("User not found.");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = "NotFoundError"
  }
}
