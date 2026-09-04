/**
 * The retry budget for each type of job run.
 *
 * `retries` is the number of *retries* Inngest performs after the first
 * attempt, matching the Inngest SDK option. Transient failures (timeouts,
 * rate limits, unavailable CVM files) get a chance to recover while hard
 * failures (invalid payloads) are surfaced as failed writes.
 */
export const RETRY_ATTEMPTS = {
  /**
   * The on-demand import orchestrator fan-out.
   */
  cvmImport: 3,

  /**
   * The per-fund import runner (network heavy, CVM files can lag).
   */
  cvmImportFund: 5,

  /**
   * The nightly fund quote refresh.
   */
  fundQuoteRefresh: 3,

  /**
   * The on-demand and nightly benchmark refresh.
   */
  benchmarkRefresh: 5,

  /**
   * The on-demand and nightly portfolio calculations.
   */
  performanceCalculation: 3,

  /**
   * The nightly calculation roll-up fan-out.
   */
  dailyCalculation: 1,

  /**
   * The nightly failed-job retry sweep.
   */
  retryFailedJobs: 2,

  /**
   * The nightly data-health scan.
   */
  dataHealth: 2,
} as const;
