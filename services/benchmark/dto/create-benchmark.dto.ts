/**
 * @summary
 * Defines the payload for creating a `Benchmark`.
 *
 * @remarks
 * The acronym is a unique market-style identifier.
 *
 * @explanation
 * Use this DTO to create a benchmark through the
 * service layer.
 *
 * @example
 * const DTO: CreateBenchmarkDTO = {
 *   acronym: "**CDI**",
 *   name: "Certificado de Depósito Interbancário",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateBenchmarkDTO {
  acronym: string
  name: string
}
