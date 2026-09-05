/**
 * The stable, machine-readable error codes returned by the API.
 *
 * Handlers never build error payloads directly — the error mapper maps
 * domain errors to these codes so clients can branch on a stable
 * identifier instead of parsing messages.
 */
export type ErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_JSON"
  | "INVALID_ARGUMENT"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UPSTREAM_ERROR"
  | "INTERNAL";

/**
 * The pagination metadata attached to every list response.
 */
export interface PaginationMeta {
  /**
   * The one-based page number returned.
   */
  page: number;

  /**
   * The maximum number of items per page.
   */
  pageSize: number;

  /**
   * The number of items the server can see for this listing. This is a
   * snapshot of the underlying record count or of the total available
   * in the returned collection, depending on the listing.
   */
  totalItems: number;

  /**
   * The total number of pages (`ceil(totalItems / pageSize)`).
   */
  totalPages: number;
}

/**
 * A successful response envelope.
 *
 * Handlers return one of these (or a plain value) and the HTTP wrapper
 * serializes it as `{ "data": ... }`, plus `{ "meta": ... }` for
 * paginated responses.
 */
export interface ApiResponseEnvelope {
  kind: "ok";
  status: number;
  body: Record<string, unknown>;
}

/**
 * A standardized error envelope handed to the HTTP wrapper.
 */
export interface ApiErrorEnvelope {
  kind: "error";
  status: number;
  code: ErrorCode;
  message: string;
  details?: unknown;
}

/**
 * Wraps data in a successful envelope.
 *
 * @typeParam T - The data payload type.
 * @param data - The response payload.
 * @param status - The HTTP status to return (defaults to `200`).
 * @returns The response envelope.
 */
export function ok<T>(data: T, status = 200): ApiResponseEnvelope {
  return { kind: "ok", status, body: { data } };
}

/**
 * Wraps data in a `201 Created` envelope.
 *
 * @typeParam T - The created resource type.
 * @param data - The created resource.
 * @returns The response envelope.
 */
export function created<T>(data: T): ApiResponseEnvelope {
  return ok(data, 201);
}

/**
 * Wraps data in a `202 Accepted` envelope for asynchronous requests.
 *
 * @typeParam T - The acknowledgement payload type.
 * @param data - The acknowledgment payload (e.g. a request id).
 * @returns The response envelope.
 */
export function accepted<T>(data: T): ApiResponseEnvelope {
  return ok(data, 202);
}

/**
 * Builds a `204 No Content` envelope.
 *
 * @returns The response envelope.
 */
export function noContent(): ApiResponseEnvelope {
  return { kind: "ok", status: 204, body: {} };
}

/**
 * Builds a paginated response envelope.
 *
 * @typeParam T - The collection type.
 * @param data - The page items.
 * @param meta - The pagination metadata.
 * @returns The response envelope.
 */
export function paginated<T>(
  data: T,
  meta: PaginationMeta,
): ApiResponseEnvelope {
  return { kind: "ok", status: 200, body: { data, meta } };
}

/**
 * Builds a standardized error envelope.
 *
 * @param status - The HTTP status to return.
 * @param code - The stable error code.
 * @param message - The human-readable message.
 * @param details - Optional structured error details.
 * @returns The error envelope.
 */
export function errorEnvelope(
  status: number,
  code: ErrorCode,
  message: string,
  details?: unknown,
): ApiErrorEnvelope {
  return {
    kind: "error",
    status,
    code,
    message,
    ...(details === undefined ? {} : { details }),
  };
}

/**
 * Builds the standard unauthenticated envelope.
 *
 * @returns The error envelope.
 */
export function unauthorized(): ApiErrorEnvelope {
  return errorEnvelope(401, "UNAUTHENTICATED", "Authentication is required.");
}

/**
 * Serializes a successful envelope into an HTTP response.
 *
 * @param envelope - The envelope returned by the handler.
 * @returns The JSON HTTP response.
 */
export function serializeEnvelope(envelope: ApiResponseEnvelope): Response {
  if (envelope.status === 204) {
    return new Response(null, { status: 204 });
  }
  return Response.json(envelope.body, {
    status: envelope.status,
    headers: { "cache-control": "no-store" },
  });
}
