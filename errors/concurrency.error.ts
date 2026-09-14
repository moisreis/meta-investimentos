import { DomainError } from "@errors/domain.error";

/**
 * @summary
 * Represents an error thrown when a concurrency conflict
 * occurs in the domain.
 *
 * @remarks
 * Extends **DomainError** to preserve the domain error
 * hierarchy. Explicitly assigns the class name to the
 * name property for accurate stack trace identification.
 *
 * @explanation
 * Use this error class when an operation fails due to
 * concurrent modifications on the same entity. It allows
 * calling code to catch and handle concurrency conflicts
 * specifically.
 *
 * @param message - Detailed error message describing the
 *                  concurrency failure context.
 *
 * @example
 * throw new ConcurrencyError("Version mismatch.");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class ConcurrencyError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "ConcurrencyError";
  }
}
