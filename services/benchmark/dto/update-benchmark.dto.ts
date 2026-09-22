/**
 * @summary
 * Defines the payload for updating a `Benchmark`.
 *
 * @remarks
 * Only the provided fields are changed.
 *
 * @explanation
 * Use this DTO to change the acronym or name of an
 * existing benchmark.
 *
 * @example
 * const DTO: UpdateBenchmarkDTO = {
 *   name: "**CDI** Cetip",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface UpdateBenchmarkDTO {
  acronym?: string
  name?: string
}
