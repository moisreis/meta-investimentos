import { ZodError } from "zod";
import {
  ConcurrencyError,
  CvmSourceError,
  DomainError,
  NotFoundError,
  ValidationError,
} from "@/shared/errors";

import type { ApiErrorEnvelope } from "./envelope";
import { errorEnvelope } from "./envelope";

/**
 * Raised when a request body is present but is not valid JSON.
 */
export class InvalidJsonError extends Error {
  /**
   * Creates an invalid-JSON error.
   */
  constructor() {
    super("The request body is not valid JSON.");
    this.name = "InvalidJsonError";
  }
}

/**
 * Maps an arbitrary thrown value to its standardized error envelope.
 *
 * The mapping is centralized so every handler answers failures with the
 * same shape and status semantics:
 *
 * - `NotFoundError` → `404 NOT_FOUND`
 * - `ConcurrencyError` → `409 CONFLICT`
 * - `ValidationError` and other domain errors → `400 INVALID_ARGUMENT`
 * - `CvmSourceError` → `502 UPSTREAM_ERROR`
 * - `ZodError` → `400 INVALID_ARGUMENT` with issue details
 * - anything else → `500 INTERNAL`
 *
 * @param error - The thrown value.
 * @returns The standardized error envelope.
 */
export function toErrorEnvelope(error: unknown): ApiErrorEnvelope {
  if (error instanceof ZodError) {
    return errorEnvelope(400, "INVALID_ARGUMENT", "The request is invalid.", {
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof InvalidJsonError) {
    return errorEnvelope(400, "INVALID_JSON", error.message);
  }

  if (error instanceof NotFoundError) {
    return errorEnvelope(404, "NOT_FOUND", error.message);
  }

  if (error instanceof ConcurrencyError) {
    return errorEnvelope(409, "CONFLICT", error.message);
  }

  if (error instanceof ValidationError) {
    return errorEnvelope(400, "INVALID_ARGUMENT", error.message);
  }

  if (error instanceof CvmSourceError) {
    return errorEnvelope(502, "UPSTREAM_ERROR", error.message);
  }

  if (error instanceof DomainError) {
    return errorEnvelope(400, "INVALID_ARGUMENT", error.message);
  }

  const message =
    error instanceof Error ? error.message : "An unexpected error occurred.";
  return errorEnvelope(500, "INTERNAL", message);
}

/**
 * Serializes a standardized error envelope into an HTTP response.
 *
 * @param envelope - The error envelope.
 * @returns The error HTTP response.
 */
export function serializeErrorEnvelope(envelope: ApiErrorEnvelope): Response {
  return Response.json(
    {
      error: {
        code: envelope.code,
        message: envelope.message,
        ...(envelope.details === undefined
          ? {}
          : { details: envelope.details }),
      },
    },
    {
      status: envelope.status,
      headers: {
        "cache-control": "no-store",
        "content-type": "application/json",
      },
    },
  );
}

/**
 * Maps an arbitrary thrown value to its standardized error HTTP response.
 *
 * @param error - The thrown value.
 * @returns The error HTTP response.
 */
export function toErrorResponse(error: unknown): Response {
  return serializeErrorEnvelope(toErrorEnvelope(error));
}
