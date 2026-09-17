/**
 * @summary
 * Defines the contract for the **CVM** data client.
 *
 * @remarks
 * Implementations fetch raw `INF_DIARIO` monthly archives.
 * A missing archive resolves to `null`.
 *
 * @explanation
 * Use this interface to decouple the quota import logic from
 * the **HTTP** transport. It keeps the data source swappable
 * and testable.
 *
 * @example
 * const CLIENT: ICvmClient = new CvmClient(CONFIG);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
export interface ICvmClient {
  /**
   * @summary
   * Fetches the raw bytes of a monthly `INF_DIARIO` file.
   *
   * @remarks
   * Returns null when the source has no file for the
   * requested month.
   *
   * @explanation
   * Use this method to download the **CVM** archive for a
   * specific year and month before parsing.
   *
   * @param year - The four-digit year of the file.
   * @param month - The month of the file (1 to 12).
   * @returns The file bytes or `null`.
   *
   * @example
   * const BYTES = await CLIENT.fetchMonthlyFile(2026, 9);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-17
   */
  fetchMonthlyFile(year: number, month: number): Promise<Buffer | null>
}