import { cron } from "inngest";

import { inngest } from "@/infrastructure/inngest/client";
import { RETRY_ATTEMPTS } from "@/infrastructure/inngest/retry";
import {
  BUSINESS_TIMEZONE,
  todayInTimeZone,
} from "@/infrastructure/inngest/timing";

/**
 * Sends the nightly fund quote refresh event at 02:00 Brazilian time.
 */
export const scheduleQuoteRefresh = inngest.createFunction(
  {
    id: "schedule-quote-refresh",
    triggers: cron(`TZ=${BUSINESS_TIMEZONE} 0 2 * * *`),
    concurrency: { limit: 1 },
    retries: RETRY_ATTEMPTS.fundQuoteRefresh,
  },
  async ({ step }) => {
    const TODAY = todayInTimeZone();
    await step.sendEvent("send-quote-refresh", [
      { name: "fund/refresh.quotes", data: { date: TODAY } },
    ]);
  },
);

/**
 * Sends the nightly benchmark refresh event at 02:05 Brazilian time.
 */
export const scheduleBenchmarkRefresh = inngest.createFunction(
  {
    id: "schedule-benchmark-refresh",
    triggers: cron(`TZ=${BUSINESS_TIMEZONE} 5 2 * * *`),
    concurrency: { limit: 1 },
    retries: RETRY_ATTEMPTS.benchmarkRefresh,
  },
  async ({ step }) => {
    const TODAY = todayInTimeZone();
    await step.sendEvent("send-benchmark-refresh", [
      { name: "benchmark/refresh.requested", data: { date: TODAY } },
    ]);
  },
);

/**
 * Sends the nightly performance roll-up event at 03:00 Brazilian time.
 *
 * The roll-up recalculates the current-date positions and portfolios of
 * every registered portfolio.
 */
export const scheduleDailyCalculations = inngest.createFunction(
  {
    id: "schedule-daily-calculations",
    triggers: cron(`TZ=${BUSINESS_TIMEZONE} 0 3 * * *`),
    concurrency: { limit: 1 },
    retries: RETRY_ATTEMPTS.dailyCalculation,
  },
  async ({ step }) => {
    const TODAY = todayInTimeZone();
    await step.sendEvent("send-daily-calculations", [
      { name: "performance/calculate.daily", data: { date: TODAY } },
    ]);
  },
);

/**
 * Sends the nightly failed-job retry sweep event at 04:00 Brazilian
 * time.
 */
export const scheduleRetryJobs = inngest.createFunction(
  {
    id: "schedule-retry-jobs",
    triggers: cron(`TZ=${BUSINESS_TIMEZONE} 0 4 * * *`),
    concurrency: { limit: 1 },
    retries: RETRY_ATTEMPTS.retryFailedJobs,
  },
  async ({ step }) => {
    const TODAY = todayInTimeZone();
    await step.sendEvent("send-retry-jobs", [
      { name: "job/retry.requested", data: { date: TODAY } },
    ]);
  },
);

/**
 * Sends the nightly data-health check event at 04:30 Brazilian time.
 */
export const scheduleDataHealth = inngest.createFunction(
  {
    id: "schedule-data-health",
    triggers: cron(`TZ=${BUSINESS_TIMEZONE} 30 4 * * *`),
    concurrency: { limit: 1 },
    retries: RETRY_ATTEMPTS.dataHealth,
  },
  async ({ step }) => {
    const TODAY = todayInTimeZone();
    await step.sendEvent("send-data-health", [
      { name: "job/health.check", data: { date: TODAY } },
    ]);
  },
);
