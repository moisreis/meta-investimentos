/**
 * The operational state of the platform as reported by the health probe.
 *
 * - `healthy` — every checked subsystem is working.
 * - `degraded` — core subsystems work but background processing is
 *   failing (e.g. repeated job-run failures).
 * - `down` — the database could not be reached at probe time.
 */
export type SystemHealthStatus = "healthy" | "degraded" | "down";

/**
 * The result of a single health sub-check.
 */
export interface SystemHealthCheck {
  /**
   * The checked subsystem, e.g. `"database"` or `"jobs"`.
   */
  name: string;

  /**
   * The operational state of the subsystem.
   */
  status: SystemHealthStatus;

  /**
   * An optional human-readable detail, present when the subsystem is
   * not fully healthy.
   */
  message?: string;
}

/**
 * The public health report returned by the health endpoint.
 */
export interface SystemHealthDto {
  /**
   * The overall operational state of the platform.
   */
  status: SystemHealthStatus;

  /**
   * The ISO 8601 timestamp of the probe.
   */
  updatedAt: string;

  /**
   * The individual sub-checks that produced the overall state.
   */
  checks: SystemHealthCheck[];
}
