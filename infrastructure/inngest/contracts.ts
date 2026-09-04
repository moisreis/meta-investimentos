import type { ReferencePeriod } from "@/business/date-policy";
import type {
  BenchmarkRefreshPayload,
  CvmImportFundRequestedPayload,
  CvmImportRequestedPayload,
  FundQuoteRefreshPayload,
  JobHealthCheckPayload,
  PerformanceCalculateDailyPayload,
  PerformanceCalculateRequestedPayload,
  RetryFailedJobsPayload,
} from "@/infrastructure/inngest/events";
import { ValidationError } from "@/shared/errors";

const REFERENCE_PERIODS: readonly string[] = [
  "date",
  "month",
  "year-to-date",
  "trailing-12m",
  "range",
];

/**
 * Determines whether a value is a `YYYY-MM-DD` calendar date string.
 *
 * The value must resolve to an actual calendar day, so `2026-02-30` is
 * rejected.
 *
 * @param value - The value to check.
 * @returns `true` when the value is a valid ISO date string.
 */
export function isIsoDateString(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [YEAR, MONTH, DAY] = value.split("-").map(Number);
  const DATE = new Date(Date.UTC(YEAR, MONTH - 1, DAY));
  return (
    DATE.getUTCFullYear() === YEAR &&
    DATE.getUTCMonth() === MONTH - 1 &&
    DATE.getUTCDate() === DAY
  );
}

/**
 * Validates the payload of a `cvm/import.requested` event against its
 * contract.
 *
 * @param data - The raw event data.
 * @returns The validated payload.
 *
 * @throws {ValidationError} If the payload violates the contract.
 */
export function assertCvmImportRequested(
  data: unknown,
): CvmImportRequestedPayload {
  const RANGE = readDateRange(data, "requestedStart", "requestedEnd", "import");
  return {
    id: readString(readField(data, "id"), "id"),
    ...RANGE,
    monthsBack: readOptionalMonthsBack(readField(data, "monthsBack")),
    requestedCnpjs: readOptionalStringList(data, "requestedCnpjs"),
  };
}

/**
 * Validates the payload of a `cvm/import.fund.requested` event against
 * its contract.
 *
 * @param data - The raw event data.
 * @returns The validated payload.
 *
 * @throws {ValidationError} If the payload violates the contract.
 */
export function assertCvmImportFundRequested(
  data: unknown,
): CvmImportFundRequestedPayload {
  const RANGE = readDateRange(data, "requestedStart", "requestedEnd", "import");
  return {
    id: readString(readField(data, "id"), "id"),
    fundCnpj: readString(readField(data, "fundCnpj"), "fundCnpj"),
    ...RANGE,
    monthsBack: readOptionalMonthsBack(readField(data, "monthsBack")),
  };
}

/**
 * Validates the payload of a `fund/refresh.quotes` event against its
 * contract.
 *
 * @param data - The raw event data.
 * @returns The validated payload.
 *
 * @throws {ValidationError} If the payload violates the contract.
 */
export function assertFundQuoteRefresh(data: unknown): FundQuoteRefreshPayload {
  return {
    date: readOptionalDate(data, "date"),
    requestedCnpjs: readOptionalStringList(data, "requestedCnpjs"),
  };
}

/**
 * Validates the payload of a `benchmark/refresh.requested` event
 * against its contract.
 *
 * @param data - The raw event data.
 * @returns The validated payload.
 *
 * @throws {ValidationError} If the payload violates the contract.
 */
export function assertBenchmarkRefresh(data: unknown): BenchmarkRefreshPayload {
  return readDateRange(data, "startDate", "endDate", "benchmark refresh");
}

/**
 * Validates the payload of a `performance/calculate.requested` event
 * against its contract.
 *
 * @param data - The raw event data.
 * @returns The validated payload.
 *
 * @throws {ValidationError} If the payload violates the contract.
 */
export function assertPerformanceCalculateRequested(
  data: unknown,
): PerformanceCalculateRequestedPayload {
  const PERIOD = readPeriod(readField(data, "period"));
  const END_DATE = readOptionalDate(data, "endDate");

  if (PERIOD === "range" && END_DATE === undefined) {
    throw new ValidationError(
      "Event payload field 'endDate' is required when period is 'range'.",
    );
  }
  if (PERIOD !== "range" && END_DATE !== undefined) {
    throw new ValidationError(
      "Event payload field 'endDate' is only valid when period is 'range'.",
    );
  }

  const ANCHOR = readRequiredDate(data, "anchor");
  if (END_DATE !== undefined && ANCHOR > END_DATE) {
    throw new ValidationError(
      "Event payload anchor must not be after the range end date.",
    );
  }

  return {
    id: readString(readField(data, "id"), "id"),
    portfolioId: readString(readField(data, "portfolioId"), "portfolioId"),
    period: PERIOD,
    anchor: ANCHOR,
    endDate: END_DATE,
    businessDay: readOptionalBoolean(data, "businessDay"),
  };
}

/**
 * Validates the payload of a `performance/calculate.daily` event
 * against its contract.
 *
 * @param data - The raw event data.
 * @returns The validated payload.
 *
 * @throws {ValidationError} If the payload violates the contract.
 */
export function assertPerformanceCalculateDaily(
  data: unknown,
): PerformanceCalculateDailyPayload {
  return { date: readRequiredDate(data, "date") };
}

/**
 * Validates the payload of a `job/retry.requested` event against its
 * contract.
 *
 * @param data - The raw event data.
 * @returns The validated payload.
 *
 * @throws {ValidationError} If the payload violates the contract.
 */
export function assertRetryFailedJobs(data: unknown): RetryFailedJobsPayload {
  return {
    date: readRequiredDate(data, "date"),
    limit: readOptionalLimit(data, "limit"),
  };
}

/**
 * Validates the payload of a `job/health.check` event against its
 * contract.
 *
 * @param data - The raw event data.
 * @returns The validated payload.
 *
 * @throws {ValidationError} If the payload violates the contract.
 */
export function assertJobHealthCheck(data: unknown): JobHealthCheckPayload {
  return { date: readRequiredDate(data, "date") };
}

/**
 * Returns a named field of an object.
 *
 * @param data - The raw event data.
 * @param name - The field name to read.
 * @returns The raw field value.
 *
 * @throws {ValidationError} If the value is not an object.
 */
function readField(data: unknown, name: string): unknown {
  if (data === null || typeof data !== "object") {
    throw new ValidationError("Event payload must be an object.");
  }
  return (data as Record<string, unknown>)[name];
}

/**
 * Returns a non-blank trimmed string field parsed from an object.
 *
 * @param value - The candidate value.
 * @param name - The field name used in the error message.
 * @returns The trimmed string.
 *
 * @throws {ValidationError} If the value is not a non-blank string.
 */
function readString(value: unknown, name: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ValidationError(
      `Event payload field '${name}' must be a non-blank string.`,
    );
  }
  return value.trim();
}

/**
 * Returns a finite number field parsed from an object.
 *
 * @param value - The candidate value.
 * @param name - The field name used in the error message.
 * @returns The finite number.
 *
 * @throws {ValidationError} If the value is not a finite number.
 */
function readNumber(value: unknown, name: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new ValidationError(
      `Event payload field '${name}' must be a number.`,
    );
  }
  return value;
}

/**
 * Returns a required ISO date string field parsed from an object.
 *
 * @param data - The raw event data.
 * @param name - The field name used in the error message.
 * @returns The validated date string.
 *
 * @throws {ValidationError} If the field is missing or not a date.
 */
function readRequiredDate(data: unknown, name: string): string {
  return readOptionalDate(data, name) ?? rejectMissingDate(name);
}

/**
 * Returns a required-optional ISO date string field parsed from an
 * object.
 *
 * @param data - The raw event data.
 * @param name - The field name used in the error message.
 * @returns The validated date string, or `undefined`.
 *
 * @throws {ValidationError} If the value is present but not a date.
 */
function readOptionalDate(data: unknown, name: string): string | undefined {
  const VALUE = readField(data, name);
  if (VALUE === undefined) {
    return undefined;
  }
  if (!isIsoDateString(VALUE)) {
    throw new ValidationError(
      `Event payload field '${name}' must be a YYYY-MM-DD date.`,
    );
  }
  return VALUE;
}

/**
 * Throws the standard `ValidationError` for a missing required date.
 *
 * @param name - The field name used in the error message.
 * @returns The validated date string.
 */
function rejectMissingDate(name: string): string {
  throw new ValidationError(`Event payload field '${name}' is required.`);
}

/**
 * Returns a `YYYY-MM-DD` range after checking its ordering.
 *
 * @param data - The raw event data.
 * @param startName - The start field name.
 * @param endName - The end field name.
 * @param kind - The range kind used in the error message.
 * @returns The validated `{ startName, endName }` object.
 *
 * @throws {ValidationError} If a date is malformed or the start is after
 *   the end.
 */
function readDateRange(
  data: unknown,
  startName: string,
  endName: string,
  kind: string,
): Record<string, string | undefined> {
  const START = readOptionalDate(data, startName);
  const END = readOptionalDate(data, endName);
  if (START !== undefined && END !== undefined && START > END) {
    throw new ValidationError(
      `Event payload ${kind} start must not be after its end.`,
    );
  }
  return { [startName]: START, [endName]: END };
}

/**
 * Returns an optional `monthsBack` field within the supported lookback
 * window.
 *
 * @param value - The candidate value.
 * @returns The validated lookback, or `undefined`.
 *
 * @throws {ValidationError} If the value is outside 1..36.
 */
function readOptionalMonthsBack(value: unknown): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  const MONTHS_BACK = readNumber(value, "monthsBack");
  if (!Number.isInteger(MONTHS_BACK) || MONTHS_BACK < 1 || MONTHS_BACK > 36) {
    throw new ValidationError(
      "Event payload field 'monthsBack' must be an integer between 1 and 36.",
    );
  }
  return MONTHS_BACK;
}

/**
 * Returns an optional list of non-blank strings parsed from an object.
 *
 * @param data - The raw event data.
 * @param name - The field name used in the error message.
 * @returns The trimmed strings, or `undefined`.
 *
 * @throws {ValidationError} If the field is present but not a list of
 *   non-blank strings.
 */
function readOptionalStringList(
  data: unknown,
  name: string,
): string[] | undefined {
  const VALUE = readField(data, name);
  if (VALUE === undefined) {
    return undefined;
  }
  if (
    !Array.isArray(VALUE) ||
    VALUE.some((item) => typeof item !== "string" || item.trim() === "")
  ) {
    throw new ValidationError(
      `Event payload field '${name}' must be an array of non-blank strings.`,
    );
  }
  return VALUE.map((item) => item.trim());
}

/**
 * Returns an optional boolean field parsed from an object.
 *
 * @param data - The raw event data.
 * @param name - The field name used in the error message.
 * @returns The boolean, or `undefined`.
 *
 * @throws {ValidationError} If the field is present but not a boolean.
 */
function readOptionalBoolean(data: unknown, name: string): boolean | undefined {
  const VALUE = readField(data, name);
  if (VALUE === undefined) {
    return undefined;
  }
  if (typeof VALUE !== "boolean") {
    throw new ValidationError(
      `Event payload field '${name}' must be a boolean.`,
    );
  }
  return VALUE;
}

/**
 * Returns an optional retry-sweep limit within the supported window.
 *
 * @param data - The raw event data.
 * @param name - The field name used in the error message.
 * @returns The limit, or `undefined`.
 *
 * @throws {ValidationError} If the value is outside 1..1000.
 */
function readOptionalLimit(data: unknown, name: string): number | undefined {
  const VALUE = readField(data, name);
  if (VALUE === undefined) {
    return undefined;
  }
  const LIMIT = readNumber(VALUE, name);
  if (!Number.isInteger(LIMIT) || LIMIT < 1 || LIMIT > 1000) {
    throw new ValidationError(
      "Event payload field 'limit' must be an integer between 1 and 1000.",
    );
  }
  return LIMIT;
}

/**
 * Returns a validated `ReferencePeriod` parsed from an object.
 *
 * @param value - The candidate value.
 * @returns The validated period.
 *
 * @throws {ValidationError} If the value is not a known period.
 */
function readPeriod(value: unknown): ReferencePeriod {
  if (typeof value !== "string" || !REFERENCE_PERIODS.includes(value)) {
    throw new ValidationError(
      "Event payload field 'period' must be one of date, month, year-to-date, trailing-12m, range.",
    );
  }
  return value as ReferencePeriod;
}
