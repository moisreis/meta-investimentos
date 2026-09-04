import {
  assertBenchmarkRefresh,
  assertCvmImportRequested,
  assertFundQuoteRefresh,
  assertPerformanceCalculateRequested,
} from "@/infrastructure/inngest/contracts";
import type {
  BenchmarkRefreshPayload,
  CvmImportRequestedPayload,
  FundQuoteRefreshPayload,
  PerformanceCalculateRequestedPayload,
} from "@/infrastructure/inngest/events";
import { newRequestId } from "@/infrastructure/inngest/idempotency";

/**
 * The options accepted by {@link buildCvmImportRequest}.
 */
export type CvmImportRequestOptions = Omit<CvmImportRequestedPayload, "id">;

/**
 * A sendable `cvm/import.requested` event.
 */
export type CvmImportRequestEvent = {
  name: "cvm/import.requested";
  data: CvmImportRequestedPayload;
};

/**
 * Builds a validated `cvm/import.requested` event ready to be sent.
 *
 * The event carries a freshly generated request `id` so every call
 * schedules a distinct run that de-duplicates when re-fired.
 *
 * @param options - The import request parameters.
 * @returns The sendable event.
 *
 * @throws {ValidationError} If the parameters violate the contract.
 */
export function buildCvmImportRequest(
  options: CvmImportRequestOptions = {},
): CvmImportRequestEvent {
  return {
    name: "cvm/import.requested",
    data: assertCvmImportRequested({ id: newRequestId(), ...options }),
  };
}

/**
 * The options accepted by {@link buildFundQuoteRefresh}.
 */
export type FundQuoteRefreshOptions = Partial<FundQuoteRefreshPayload>;

/**
 * A sendable `fund/refresh.quotes` event.
 */
export type FundQuoteRefreshEvent = {
  name: "fund/refresh.quotes";
  data: FundQuoteRefreshPayload;
};

/**
 * Builds a validated `fund/refresh.quotes` event ready to be sent.
 *
 * @param options - The refresh parameters.
 * @returns The sendable event.
 *
 * @throws {ValidationError} If the parameters violate the contract.
 */
export function buildFundQuoteRefresh(
  options: FundQuoteRefreshOptions = {},
): FundQuoteRefreshEvent {
  return {
    name: "fund/refresh.quotes",
    data: assertFundQuoteRefresh(options),
  };
}

/**
 * The options accepted by {@link buildBenchmarkRefresh}.
 */
export type BenchmarkRefreshOptions = Partial<BenchmarkRefreshPayload>;

/**
 * A sendable `benchmark/refresh.requested` event.
 */
export type BenchmarkRefreshEvent = {
  name: "benchmark/refresh.requested";
  data: BenchmarkRefreshPayload;
};

/**
 * Builds a validated `benchmark/refresh.requested` event ready to be
 * sent.
 *
 * @param options - The refresh parameters.
 * @returns The sendable event.
 *
 * @throws {ValidationError} If the parameters violate the contract.
 */
export function buildBenchmarkRefresh(
  options: BenchmarkRefreshOptions = {},
): BenchmarkRefreshEvent {
  return {
    name: "benchmark/refresh.requested",
    data: assertBenchmarkRefresh(options),
  };
}

/**
 * The options accepted by {@link buildPerformanceCalculationRequest}.
 */
export type PerformanceCalculationRequestOptions = Omit<
  PerformanceCalculateRequestedPayload,
  "id"
>;

/**
 * A sendable `performance/calculate.requested` event.
 */
export type PerformanceCalculationRequestEvent = {
  name: "performance/calculate.requested";
  data: PerformanceCalculateRequestedPayload;
};

/**
 * Builds a validated `performance/calculate.requested` event ready to be
 * sent.
 *
 * The event carries a freshly generated request `id` so every call
 * schedules a distinct run that de-duplicates when re-fired.
 *
 * @param options - The calculation request parameters.
 * @returns The sendable event.
 *
 * @throws {ValidationError} If the parameters violate the contract.
 */
export function buildPerformanceCalculationRequest(
  options: PerformanceCalculationRequestOptions,
): PerformanceCalculationRequestEvent {
  return {
    name: "performance/calculate.requested",
    data: assertPerformanceCalculateRequested({
      id: newRequestId(),
      ...options,
    }),
  };
}
