import { DomainError } from "./domain.error";

/**
 * Represents a failure when communicating with the CVM data source.
 *
 * A `CvmSourceError` is thrown by the CVM client when a requested file
 * cannot be retrieved after exhausting the configured retries, whether
 * because the source is unavailable, the response is malformed, or the
 * source rate-limits the request.
 *
 * @example
 * ```ts
 * throw new CvmSourceError(`Failed to fetch ${url}: ${message}`)
 * ```
 */
export class CvmSourceError extends DomainError {
  /**
   * Creates a `CvmSourceError` with the provided message.
   *
   * @param message - A human-readable description of the failure.
   */
  constructor(message: string) {
    super(message);
    this.name = "CvmSourceError";
  }
}
