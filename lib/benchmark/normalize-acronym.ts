/**
 * @summary
 * Normalizes a benchmark acronym for comparison.
 *
 * @remarks
 * Trims the value, uppercases it and drops every space,
 * dash and underscore, so `IMA-Geral`, `IMA GERAL` and
 * `imagerl` all resolve to the same key. Both the statement
 * report and the statement availability check match their
 * tracked indexes through this helper, so an acronym never
 * resolves on one side and misses on the other.
 *
 * @explanation
 * Use to match a registered benchmark against the canonical
 * index acronyms of the report.
 *
 * @param value - The acronym to normalize.
 *
 * @returns The normalized acronym.
 *
 * @example
 * NormalizeAcronym("IMA-Geral"); // "IMAGERAL"
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
export function NormalizeAcronym(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[\s_-]/g, "")
}
