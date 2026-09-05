import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { ApiRuntime, SendableEvent } from "@/app/api/_core/runtime";
import { setApiRuntime } from "@/app/api/_core/runtime";
import type { ResolvedActor } from "@/business/use-cases/shared/actor-resolution";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { UnitOfWork } from "@/infrastructure/unit-of-work";

/**
 * The default authenticated actor used by API integration tests.
 */
const DEFAULT_ACTOR: ResolvedActor = {
  actorId: EntityId.create(ID.USER.DEFAULT),
  role: "USER",
};

/**
 * The options accepted by {@link installApiTestRuntime}.
 */
export interface ApiTestRuntimeOptions {
  /**
   * The actor returned by `resolveActor`. Pass `null` to simulate an
   * unauthenticated request; the default actor is used when omitted.
   */
  actor?: ResolvedActor | null;

  /**
   * Handler invoked for every event forwarded through `runtime.send`.
   */
  onSend?: (events: readonly SendableEvent[]) => void;
}

/**
 * Installs a test API runtime backed by the shared test database.
 *
 * The actor and send-capture behave like the production runtime but stay
 * deterministic: `resolveActor` returns the configured actor and `send`
 * forwards the events to the provided collector instead of *Inngest*.
 */
export function installApiTestRuntime(
  options: ApiTestRuntimeOptions = {},
): void {
  const actor = options.actor === undefined ? DEFAULT_ACTOR : options.actor;

  const runtime: ApiRuntime = {
    unitOfWork: new UnitOfWork(db),
    async resolveActor() {
      return actor;
    },
    async send(events) {
      options.onSend?.(events);
    },
  };

  setApiRuntime(runtime);
}
