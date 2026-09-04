import { benchmarkRefreshJob } from "./benchmark-refresh";
import {
  dailyPerformanceCalculationJob,
  performanceCalculationJob,
} from "./calculations";
import { cvmImportFundJob, cvmImportJob } from "./cvm-imports";
import { dataHealthJob } from "./data-health";
import { quoteRefreshJob } from "./quote-refresh";
import { retryFailedJobsJob } from "./retry-jobs";
import {
  scheduleBenchmarkRefresh,
  scheduleDailyCalculations,
  scheduleDataHealth,
  scheduleQuoteRefresh,
  scheduleRetryJobs,
} from "./schedules";

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
