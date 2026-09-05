/**
 * Resolves the reference date of a request, defaulting to the current
 * moment when the caller does not provide one.
 *
 * @param referenceDate - The validated reference date, if provided.
 * @returns The effective reference date.
 */
export function resolveReferenceDate(referenceDate?: Date): Date {
  return referenceDate ?? new Date();
}
