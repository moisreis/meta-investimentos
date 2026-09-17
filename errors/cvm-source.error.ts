import { DomainError } from "./domain.error"

/**
 * @summary
 * Signals an unrecoverable failure when reading the
 * **CVM** data source.
 *
 * @remarks
 * Extends **DomainError** and sets the name to
 * **CvmSourceError**. Wraps transport, **HTTP**, and parse
 * failures that are not the caller's fault.
 *
 * @explanation
 * Use this error to surface **CVM** connectivity and parse
 * problems to loggers and handlers. It distinguishes source
 * failures from business validation errors.
 *
 * @param message - Text describing the source failure.
 *
 * @example
 * throw new CvmSourceError("Missing quota column.");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
export class CvmSourceError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = "CvmSourceError"
  }
}