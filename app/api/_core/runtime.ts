import type { ResolvedActor } from "@/business/use-cases/shared/actor-resolution";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";

export type { ResolvedActor } from "@/business/use-cases/shared/actor-resolution";

/**
 * An event the API layer can hand to the job scheduler.
 *
 * The payload shape mirrors the validated request events produced by the
 * {@link "@/infrastructure/inngest/requests.utils"} builders, so routes send
 * builders' output through {@link ApiRuntime.send}.
 */
export interface SendableEvent {
  /**
   * The event name, e.g. `cvm/import.requested`.
   */
  name: string;

  /**
   * The serializable event payload.
   */
  data: unknown;
}

/**
 * The composition root shared by every API handler.
 *
 * Handlers never construct their own dependencies — they resolve this
 * runtime and delegate to the use-case layer through
 * {@link ApiRuntime.unitOfWork}. The runtime also resolves the acting
 * user from the request headers and can forward events to the job
 * scheduler.
 */
export interface ApiRuntime {
  /**
   * The unit of work every route uses to open transactions.
   */
  readonly unitOfWork: UnitOfWork;

  /**
   * Resolves the acting user from the request headers.
   *
   * @param headers - The request headers (cookies included).
   * @returns The resolved actor, or `null` when the request is not
   * authenticated.
   */
  resolveActor(headers: Headers): Promise<ResolvedActor | null>;

  /**
   * Forwards validated events to the job scheduler.
   *
   * @param events - The events to enqueue.
   */
  send(events: readonly SendableEvent[]): Promise<void>;
}

let current: ApiRuntime | undefined;

/**
 * Returns the installed API runtime.
 *
 * @returns The runtime currently installed for this process.
 *
 * @throws {Error} When no runtime has been installed yet.
 */
export function getApiRuntime(): ApiRuntime {
  if (current === undefined) {
    throw new Error("The API runtime has not been installed.");
  }
  return current;
}

/**
 * Installs a runtime for the current process.
 *
 * Tests install a runtime backed by the test database before invoking
 * handlers; the production process installs the runtime lazily on the
 * first request through {@link resolveApiRuntime}.
 *
 * @param runtime - The runtime to install.
 */
export function setApiRuntime(runtime: ApiRuntime): void {
  current = runtime;
}

/**
 * Resolves the runtime to execute a request with.
 *
 * The first call installs the production runtime (database, better-auth
 * session resolution and the Inngest client) through a lazy import so
 * the authentication and database modules are never loaded in tests
 * that install their own runtime first.
 *
 * @returns A promise resolving to the API runtime.
 */
export async function resolveApiRuntime(): Promise<ApiRuntime> {
  if (current === undefined) {
    const production = await import("./runtime.prod");
    setApiRuntime(production.createProductionRuntime());
  }
  return getApiRuntime();
}
