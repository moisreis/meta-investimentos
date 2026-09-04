/**
 * Represents the contract for accessing the CVM fund data source.
 *
 * An `ICvmClient`:
 * - exposes the source base URL used to build file addresses.
 * - fetches the raw bytes of a given monthly file, returning `null`
 *   when the requested file is unavailable (source returns 404 or 403).
 *
 * Implementations are responsible for connectivity, configuration, and
 * handling of unavailable sources and rate limits.
 */
export interface ICvmClient {
  /**
   * The base URL of the CVM data source.
   */
  readonly baseUrl: string;

  /**
   * Fetches the raw bytes of the monthly file for the provided year and
   * month.
   *
   * @param year - The four-digit year of the requested file.
   * @param month - The month of the requested file (1 to 12).
   * @returns A promise resolving to the raw file bytes, or `null` when
   *   the requested file is unavailable on the source.
   */
  fetchMonthlyFile(year: number, month: number): Promise<Buffer | null>;
}
