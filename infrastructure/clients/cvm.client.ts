import type { ICvmClient } from "@/business/interfaces/cvm/cvm-client.interface";
import { CvmSourceError } from "@/shared/errors";

/**
 * The base URL of the CVM `INF_DIARIO` data source.
 *
 * @see https://dados.cvm.gov.br/dados/FI/DOC/INF_DIARIO/DADOS
 */
export const CVM_BASE_URL =
  "https://dados.cvm.gov.br/dados/FI/DOC/INF_DIARIO/DADOS";

/**
 * The default number of months looked back when no explicit date range
 * is requested.
 */
export const CVM_DEFAULT_MONTHS_BACK = 12;

/**
 * The default number of retries attempted for a transient failure.
 */
export const CVM_DEFAULT_MAX_RETRIES = 3;

/**
 * The default request timeout, in milliseconds.
 */
export const CVM_DEFAULT_TIMEOUT_MS = 30_000;

/**
 * The default base delay for the retry back-off, in milliseconds.
 */
const BASE_DELAY_MS = 500;

/**
 * The request template for an `INF_DIARIO` monthly file.
 *
 * `{YEAR}` is the zero-padded four-digit year and `{MONTH}` is the
 * zero-padded two-digit month.
 */
const FILE_URL_TEMPLATE = `${CVM_BASE_URL}/inf_diario_fi_{YEAR}{MONTH}.zip`;

/**
 * The configuration used to build a {@link CvmClient}.
 */
export interface CvmClientConfig {
  /**
   * The base URL of the CVM data source.
   */
  baseUrl?: string;

  /**
   * The number of months looked back when no date range is requested.
   */
  monthsBack?: number;

  /**
   * The maximum number of retries for a transient failure.
   */
  maxRetries?: number;

  /**
   * The request timeout, in milliseconds.
   */
  timeoutMs?: number;

  /**
   * The value sent in the `User-Agent` header.
   */
  userAgent?: string;
}

/**
 * The actual configuration resolved from a {@link CvmClientConfig}.
 */
export interface ResolvedCvmClientConfig {
  baseUrl: string;
  monthsBack: number;
  maxRetries: number;
  timeoutMs: number;
  userAgent: string;
}

/**
 * Resolves the provided partial configuration into a complete
 * {@link ResolvedCvmClientConfig}, filling in the defaults.
 *
 * @param config - The partial configuration to resolve.
 * @returns A complete client configuration.
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
  };
}

/**
 * Builds the address of the `INF_DIARIO` monthly file for the provided
 * year and month.
 *
 * @param config - The resolved client configuration.
 * @param year - The four-digit year of the requested file.
 * @param month - The month of the requested file (1 to 12).
 * @returns The absolute URL of the file.
 */
export function buildMonthlyFileUrl(
  _config: ResolvedCvmClientConfig,
  year: number,
  month: number,
): string {
  const PADDED_YEAR = String(year).padStart(4, "0");
  const PADDED_MONTH = String(month).padStart(2, "0");

  return FILE_URL_TEMPLATE.replace("{YEAR}", PADDED_YEAR).replace(
    "{MONTH}",
    PADDED_MONTH,
  );
}

/**
 * The CVM client backed by the platform's global `fetch`.
 *
 * It implements the connection and configuration concerns of the
 * {@link ICvmClient} contract: it builds the file address from the
 * configured base URL, performs the request within a timeout budget and
 * retries transient failures with an exponential back-off. A file that
 * the source does not expose (`404`) or refuses (`403`) is reported as
 * unavailable (`null`) instead of failing the whole import.
 */
export class CvmClient implements ICvmClient {
  private readonly config: ResolvedCvmClientConfig;

  /**
   * Creates a `CvmClient` bound to the provided configuration.
   *
   * @param config - The resolved client configuration.
   */
  constructor(config: ResolvedCvmClientConfig) {
    this.config = config;
  }

  /**
   * Returns the base URL of the CVM data source.
   */
  get baseUrl(): string {
    return this.config.baseUrl;
  }

  /**
   * Fetches the raw bytes of a monthly `INF_DIARIO` file.
   *
   * A `404` or `403` response is treated as an unavailable file and
   * resolves to `null`. A `429` or any `5xx` response is retried with an
   * exponential back-off up to the configured retry limit; when the
   * retries are exhausted the failure is surfaced as a
   * {@link CvmSourceError}.
   *
   * @see {@link ICvmClient.fetchMonthlyFile}
   */
  async fetchMonthlyFile(year: number, month: number): Promise<Buffer | null> {
    const URL = buildMonthlyFileUrl(this.config, year, month);

    let LAST_ERROR: unknown;

    for (let ATTEMPT = 0; ATTEMPT <= this.config.maxRetries; ATTEMPT++) {
      if (ATTEMPT > 0) {
        await delay(BASE_DELAY_MS * 2 ** (ATTEMPT - 1));
      }

      try {
        const RESPONSE = await fetch(URL, {
          headers: {
            "User-Agent": this.config.userAgent,
            Accept: "application/zip, application/octet-stream, */*",
          },
          signal: AbortSignal.timeout(this.config.timeoutMs),
        });

        if (RESPONSE.status === 404 || RESPONSE.status === 403) {
          return null;
        }

        if (RESPONSE.status === 429 || RESPONSE.status >= 500) {
          LAST_ERROR = new CvmSourceError(
            `CVM source returned HTTP ${RESPONSE.status} for ${URL}.`,
          );
          continue;
        }

        if (!RESPONSE.ok) {
          LAST_ERROR = new CvmSourceError(
            `CVM source returned HTTP ${RESPONSE.status} for ${URL}.`,
          );
          continue;
        }

        const BODY = await RESPONSE.arrayBuffer();
        return Buffer.from(BODY);
      } catch (error) {
        const MESSAGE = error instanceof Error ? error.message : String(error);
        LAST_ERROR = new CvmSourceError(`Failed to fetch ${URL}: ${MESSAGE}.`);
      }
    }

    throw LAST_ERROR;
  }
}

/**
 * Creates a {@link CvmClient} instance from the provided
 * configuration.
 *
 * @param config - The partial client configuration.
 * @returns A configured `CvmClient`.
 */
export function createCvmClient(config: CvmClientConfig = {}): CvmClient {
  return new CvmClient(resolveCvmClientConfig(config));
}

/**
 * Resolves a promise after the provided number of milliseconds.
 *
 * @param ms - The number of milliseconds to wait.
 * @returns A promise that resolves after the delay.
 */
function delay(ms: number): Promise<void> {
  return new Promise((RESOLVE) => {
    setTimeout(RESOLVE, ms);
  });
}
