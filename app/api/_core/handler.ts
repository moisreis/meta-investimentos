import type { z } from "zod";
import type { ResolvedActor } from "@/business/use-cases/shared/actor-resolution";

import type { ApiResponseEnvelope } from "./envelope";
import { serializeEnvelope, unauthorized } from "./envelope";
import {
  InvalidJsonError,
  serializeErrorEnvelope,
  toErrorResponse,
} from "./errors";
import { type ApiRuntime, resolveApiRuntime } from "./runtime";

/**
 * The context handed to a route handler after authentication and input
 * validation have run.
 */
export interface ApiHandlerInput<Q, B, P> {
  /**
   * The original request.
   */
  request: Request;

  /**
   * The validated route parameters.
   */
  params: P;

  /**
   * The validated query string, or `undefined` when the route declares
   * no query schema.
   */
  query: Q;

  /**
   * The validated JSON body, or `undefined` when the route declares no
   * body schema.
   */
  body: B;

  /**
   * The resolved acting user.
   */
  actor: ResolvedActor;

  /**
   * The composition root for this request.
   */
  runtime: ApiRuntime;
}

/**
 * The configuration of an API route handler.
 */
export interface ApiHandlerOptions<Q, B, P> {
  /**
   * The query schema to validate the URL search params against.
   */
  querySchema?: z.ZodType<Q>;

  /**
   * The JSON body schema to validate the request body against.
   */
  bodySchema?: z.ZodType<B>;

  /**
   * The handler body. It receives the validated input and returns a
   * serializable payload, an {@link ApiResponseEnvelope}, or a promise
   * of either.
   *
   * @param input - The validated request context.
   * @returns The response payload or envelope.
   */
  handler: (input: ApiHandlerInput<Q, B, P>) => Promise<unknown> | unknown;
}

/**
 * Route parameters as exposed to handlers.
 */
// biome-ignore lint/suspicious/noExplicitAny: route params are unstructured across segments.
export type RouteParams = Record<string, any>;

/**
 * Wraps a route handler with the shared request pipeline.
 *
 * Every handler runs the same pipeline: resolve the runtime, resolve
 * the acting user from the session (alling requests require a session),
 * validate the query string and JSON body through `zod`, execute the
 * handler and serialize the envelope, and map any thrown error to the
 * standardized error response.
 *
 * @param options - The route's validation and behavior.
 * @returns The Next.js route handler.
 */
export function apiHandler<Q = undefined, B = undefined, P = RouteParams>(
  options: ApiHandlerOptions<Q, B, P>,
): (request: Request, route: { params: Promise<P> }) => Promise<Response> {
  return async (request, route) => {
    try {
      const runtime = await resolveApiRuntime();

      const actor = await runtime.resolveActor(request.headers);
      if (actor === null) {
        return serializeErrorEnvelope(unauthorized());
      }

      const params = await route.params;
      const query = options.querySchema
        ? parseQuery(options.querySchema, new URL(request.url).searchParams)
        : undefined;
      const body = options.bodySchema
        ? await parseBody(options.bodySchema, request)
        : undefined;

      const result = await options.handler({
        request,
        params,
        query: query as Q,
        body: body as B,
        actor,
        runtime,
      });

      return serializeEnvelope(asEnvelope(result));
    } catch (error) {
      return toErrorResponse(error);
    }
  };
}

/**
 * Normalizes a handler result into a response envelope.
 *
 * @param result - The raw handler result.
 * @returns A serializable envelope.
 */
function asEnvelope(result: unknown): ApiResponseEnvelope {
  if (isEnvelope(result)) {
    return result;
  }
  return { kind: "ok", status: 200, body: { data: result } };
}

/**
 * Type guard for response envelopes.
 *
 * @param value - The handler result.
 * @returns `true` when the value is a response envelope.
 */
function isEnvelope(value: unknown): value is ApiResponseEnvelope {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { kind?: unknown }).kind === "ok" &&
    typeof (value as { status?: unknown }).status === "number"
  );
}

/**
 * Validates the query string search params against a schema.
 *
 * @typeParam Q - The parsed query type.
 * @param schema - The zod schema.
 * @param searchParams - The raw URL search params.
 * @returns The validated query.
 */
function parseQuery<Q>(schema: z.ZodType<Q>, searchParams: URLSearchParams): Q {
  const raw: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    raw[key] = value;
  }
  return schema.parse(raw);
}

/**
 * Reads and validates the JSON request body against a schema.
 *
 * @typeParam B - The parsed body type.
 * @param schema - The zod schema.
 * @param request - The request being handled.
 * @returns The validated body.
 *
 * @throws {InvalidJsonError} When the body is not valid JSON.
 */
async function parseBody<B>(
  schema: z.ZodType<B>,
  request: Request,
): Promise<B> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw new InvalidJsonError();
  }
  return schema.parse(raw);
}
