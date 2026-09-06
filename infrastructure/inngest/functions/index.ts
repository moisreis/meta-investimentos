import { benchmarkRefreshJob } from "./benchmark-refresh.jobs";
import {
  dailyPerformanceCalculationJob,
  performanceCalculationJob,
} from "./calculations.jobs";
import { cvmImportFundJob, cvmImportJob } from "./cvm-imports.jobs";
import { dataHealthJob } from "./data-health.jobs";
import { quoteRefreshJob } from "./quote-refresh.jobs";
import { retryFailedJobsJob } from "./retry-jobs.jobs";
import {
  scheduleBenchmarkRefresh,
  scheduleDailyCalculations,
  scheduleDataHealth,
  scheduleQuoteRefresh,
  scheduleRetryJobs,
} from "./schedules.jobs";

/**
 * Every *Inngest* function served by the application.
 *
 * The array is exported so the route handler and any tooling can
 * register exactly one source of truth for the whole job graph.
 */
export const functions = [
  // Schedulers — fire cron events in Brazil time.
  scheduleQuoteRefresh,
  scheduleBenchmarkRefresh,
  scheduleDailyCalculations,
  scheduleRetryJobs,
  scheduleDataHealth,
  // Import workers.
  cvmImportJob,
  cvmImportFundJob,
  quoteRefreshJob,
  benchmarkRefreshJob,
  // Calculation workers.
  performanceCalculationJob,
  dailyPerformanceCalculationJob,
  // Operations workers.
  retryFailedJobsJob,
  dataHealthJob,
];
