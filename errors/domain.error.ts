/**
 * @summary
 * Serves as the base class for all custom domain errors in
 * the application.
 *
 * @remarks
 * Extends the native **TypeScript** **Error** class. Sets
 * the `name` property explicitly to **DomainError** to preserve
 * class identity during inheritance.
 *
 * @explanation
 * Use this error class as a foundational abstraction for domain
 * exceptions. Inheriting from this class allows global error
 * handlers to distinguish business logic failures from system
 * exceptions.
 *
 * @param message - Detailed text describing the reason for the
 *                  domain error.
 *
 * @example
 * throw new DomainError("Operation violated domain rules.");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "DomainError"
  }
}
