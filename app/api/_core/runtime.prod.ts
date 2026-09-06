import { resolveActorFromSession } from "@/business/use-cases/shared/actor-resolution";
import { auth } from "@/infrastructure/clients/better-auth.client";
import { db } from "@/infrastructure/clients/drizzle.client";
import { inngest } from "@/infrastructure/inngest/inngest.provider";
import { UnitOfWork } from "@/infrastructure/unit-of-work";

import type { ApiRuntime } from "./runtime";

/**
 * Creates the production API runtime.
 *
 * The runtime is bound to the shared Drizzle database client, resolves
 * the acting user through the *Better Auth* session cookie, and forwards
 * job events through the shared *Inngest* client.
 *
 * @returns The production runtime.
 */
export function createProductionRuntime(): ApiRuntime {
  return {
    unitOfWork: new UnitOfWork(db),
    async resolveActor(headers) {
      const session = await auth.api.getSession({ headers });
      return resolveActorFromSession(session?.user);
    },
    async send(events) {
      await inngest.send(events as Parameters<typeof inngest.send>[0]);
    },
  };
}
