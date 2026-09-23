import type { ICvmClient } from "@/domain/quota/interfaces/cvm-client.interface"
import { CvmSourceError } from "@/errors"

// The base URL of the CVM INF_DIARIO data source.
// See https://dados.cvm.gov.br/dados/FI/DOC/INF_DIARIO/DADOS
export const CVM_BASE_URL =
  "https://dados.cvm.gov.br/dados/FI/DOC/INF_DIARIO/DADOS"

// The default number of months looked back when no explicit date range is requested.
export const CVM_DEFAULT_MONTHS_BACK = 12

// The default number of retries attempted for a transient failure.
export const CVM_DEFAULT_MAX_RETRIES = 3

// The default request timeout, in milliseconds.
export const CVM_DEFAULT_TIMEOUT_MS = 30_000

// The default base delay for the retry back-off, in milliseconds.
const BASE_DELAY_MS = 500

// The request template for an INF_DIARIO monthly file.
// {YEAR} is the zero-padded four-digit year and {MONTH} is the zero-padded two-digit month.
const FILE_URL_TEMPLATE = `${CVM_BASE_URL}/inf_diario_fi_{YEAR}{MONTH}.zip`

/**
 * Configuration used to build a CvmClient.
 */
export interface CvmClientConfig {
  // The base URL of the CVM data source.
  baseUrl?: string

  // The number of months looked back when no date range is requested.
  monthsBack?: number

  // The maximum number of retries for a transient failure.
  maxRetries?: number

  // The request timeout, in milliseconds.
  timeoutMs?: number

  // The value sent in the User-Agent header.
  userAgent?: string
}

/**
 * The actual configuration resolved from a CvmClientConfig.
 */
export interface ResolvedCvmClientConfig {
  baseUrl: string
  monthsBack: number
  maxRetries: number
  timeoutMs: number
  userAgent: string
}

/**
 * @summary
 * Resolves the provided partial configuration into a complete ResolvedCvmClientConfig.
 *
 * @remarks
 * Fills in defaults for any missing configuration values.
 *
 * @explanation
 * Use this function to normalize a partial CvmClientConfig into a fully
 * resolved configuration with all required values. It applies default
 * constants for base URL, months back, max retries, timeout, and user
 * agent when the caller does not provide them. Call it before creating
 * a CvmClient instance.
 *
 * @param config - The partial configuration to resolve.
 * @returns A complete client configuration.
 *
 * @example
 * const CONFIG = resolveCvmClientConfig({ timeoutMs: 15000 });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export function resolveCvmClientConfig(
  config: CvmClientConfig = {},
): ResolvedCvmClientConfig {
  return {
    baseUrl: config.baseUrl ?? CVM_BASE_URL,
    monthsBack: config.monthsBack ?? CVM_DEFAULT_MONTHS_BACK,
    maxRetries: config.maxRetries ?? CVM_DEFAULT_MAX_RETRIES,
    timeoutMs: config.timeoutMs ?? CVM_DEFAULT_TIMEOUT_MS,
    userAgent:
      config.userAgent ??
      "meta-investimentos/1.0 (fund quota importer; contact: support@metainvestimentos.app)",
  }
}

/**
 * @summary
 * Builds the address of the INF_DIARIO monthly file for the provided year and month.
 *
 * @remarks
 * Replaces template placeholders with zero-padded year and month values.
 *
 * @explanation
 * Internal helper that constructs the absolute URL for a specific monthly
 * CVM data file. Uses the FILE_URL_TEMPLATE with zero-padded year (4 digits)
 * and month (2 digits). Called by CvmClient when fetching monthly data.
 *
 * @param config - The resolved client configuration.
 * @param year - The four-digit year of the requested file.
 * @param month - The month of the requested file (1 to 12).
 * @returns The absolute URL of the file.
 *
 * @example
 * const URL = buildMonthlyFileUrl(config, 2024, 1);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export function buildMonthlyFileUrl(
  _config: ResolvedCvmClientConfig,
  year: number,
  month: number,
): string {
  const PADDED_YEAR = String(year).padStart(4, "0")
  const PADDED_MONTH = String(month).padStart(2, "0")

  return FILE_URL_TEMPLATE.replace("{YEAR}", PADDED_YEAR).replace(
    "{MONTH}",
    PADDED_MONTH,
  )
}

/**
 * @summary
 * CVM client backed by the platform's global fetch.
 *
 * @remarks
 * Implements the ICvmClient contract: builds the file address from the
 * configured base URL, performs the request within a timeout budget, and
 * retries transient failures with exponential back-off. A file that the
 * source does not expose (404) or refuses (403) is reported as unavailable
 * (null) instead of failing the whole import.
 *
 * @explanation
 * Provides a concrete implementation for fetching CVM fund quota data
 * files. Handles connection concerns: URL building, HTTP requests,
 * timeout enforcement, retry logic with exponential back-off, and error
 * classification. Used by the quota import pipeline to retrieve raw
 * monthly INF_DIARIO ZIP files from the CVM open data portal.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export class CvmClient implements ICvmClient {
  private readonly config: ResolvedCvmClientConfig

  /**
   * @summary
   * Creates a CvmClient bound to the provided configuration.
   *
   * @remarks
   * Stores the resolved configuration for use in fetch operations.
   *
   * @explanation
   * Constructor that initializes the client with a fully resolved
   * configuration. The configuration contains all connection parameters
   * needed for fetching monthly files. Called by createCvmClient factory.
   *
   * @param config - The resolved client configuration.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  constructor(config: ResolvedCvmClientConfig) {
    this.config = config
  }

  /**
   * @summary
   * Returns the base URL of the CVM data source.
   *
   * @remarks
   * Exposes the configured base URL for inspection or debugging.
   *
   * @explanation
   * Getter that returns the base URL from the resolved configuration.
   * Useful for logging or verifying the client is pointed at the correct
   * CVM endpoint.
   *
   * @returns The configured base URL string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  get baseUrl(): string {
    return this.config.baseUrl
  }

  /**
   * @summary
   * Fetches the raw bytes of a monthly INF_DIARIO file.
   *
   * @remarks
   * A 404 or 403 response is treated as an unavailable file and resolves
   * to null. A 429 or any 5xx response is retried with exponential
   * back-off up to the configured retry limit; when retries are exhausted
   * the failure is surfaced as a CvmSourceError.
   *
   * @explanation
   * Core method that downloads a monthly fund data file from CVM.
   * Builds the URL, executes the HTTP request with timeout and headers,
   * handles specific status codes (404/403 = unavailable, 429/5xx = retry),
   * and returns the raw ZIP file as a Buffer. Implements the ICvmClient
   * fetchMonthlyFile contract. Throws CvmSourceError on persistent failures.
   *
   * @param year - The four-digit year of the requested file.
   * @param month - The month of the requested file (1 to 12).
   * @returns Buffer with file contents, or null if unavailable.
   *
   * @example
   * const BUFFER = await cvmClient.fetchMonthlyFile(2024, 1);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  async fetchMonthlyFile(
    year: number,
    month: number,
  ): Promise<Buffer | null> {
    const URL = buildMonthlyFileUrl(this.config, year, month)

    let LAST_ERROR: unknown

    for (let ATTEMPT = 0; ATTEMPT <= this.config.maxRetries; ATTEMPT++) {
      if (ATTEMPT > 0) {
        await delay(BASE_DELAY_MS * 2 ** (ATTEMPT - 1))
      }

      try {
        const RESPONSE = await fetch(URL, {
          headers: {
            "User-Agent": this.config.userAgent,
            Accept: "application/zip, application/octet-stream, */*",
          },
          signal: AbortSignal.timeout(this.config.timeoutMs),
        })

        if (RESPONSE.status === 404 || RESPONSE.status === 403) {
          return null
        }

        if (RESPONSE.status === 429 || RESPONSE.status >= 500) {
          LAST_ERROR = new CvmSourceError(
            `CVM source returned HTTP ${RESPONSE.status} for ${URL}.`,
          )
          continue
        }

        if (!RESPONSE.ok) {
          LAST_ERROR = new CvmSourceError(
            `CVM source returned HTTP ${RESPONSE.status} for ${URL}.`,
          )
          continue
        }

        const BODY = await RESPONSE.arrayBuffer()
        return Buffer.from(BODY)
      } catch (error) {
        const MESSAGE = error instanceof Error ? error.message : String(error)
        LAST_ERROR = new CvmSourceError(`Failed to fetch ${URL}: ${MESSAGE}.`)
      }
    }

    throw LAST_ERROR
  }
}

/**
 * @summary
 * Creates a CvmClient instance from the provided configuration.
 *
 * @remarks
 * Resolves the partial config to a complete configuration before
 * instantiating the client.
 *
 * @explanation
 * Factory function that simplifies client creation. Accepts a partial
 * CvmClientConfig, resolves defaults via resolveCvmClientConfig, and
 * returns a new CvmClient instance. Use this as the primary way to
 * obtain a configured client in application code.
 *
 * @param config - The partial client configuration.
 * @returns A configured CvmClient.
 *
 * @example
 * const CLIENT = createCvmClient({ maxRetries: 5 });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export function createCvmClient(config: CvmClientConfig = {}): CvmClient {
  return new CvmClient(resolveCvmClientConfig(config))
}

/**
 * @summary
 * Resolves a promise after the provided number of milliseconds.
 *
 * @remarks
 * Wraps setTimeout in a Promise for use with await.
 *
 * @explanation
 * Internal utility that pauses execution for the specified duration.
 * Used by the retry logic in fetchMonthlyFile to implement exponential
 * back-off between attempts.
 *
 * @param ms - The number of milliseconds to wait.
 * @returns A promise that resolves after the delay.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function delay(ms: number): Promise<void> {
  return new Promise((RESOLVE) => {
    setTimeout(RESOLVE, ms)
  })
}