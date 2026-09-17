/**
 * @summary
 * Defines the payload for creating an `Application`.
 *
 * @remarks
 * Amount and quotas are decimal strings; date is ISO
 * 8601. Value objects are built in the service mapper.
 *
 * @explanation
 * Use this DTO to register an application through the
 * service layer.
 *
 * @example
 * const DTO: CreateApplicationDTO = {
 *   positionId: "position-1",
 *   date: "2026-01-01T00:00:00.000Z",
 *   amount: "10000",
 *   quotas: "1000",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateApplicationDTO {
  positionId: string
  date: string
  amount: string
  quotas: string
}
