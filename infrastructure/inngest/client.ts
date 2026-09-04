import { Inngest } from "inngest";

import { events } from "@/infrastructure/inngest/events";

/**
 * The shared *Inngest* client for this application.
 *
 * The client is configured with the application id and the canonical
 * {@link events} contract so that `send` calls and function handlers are
 * fully typed.
 *
 * Authentication is resolved from the environment (`INNGEST_EVENT_KEY`
 * and `INNGEST_SIGNING_KEY`). In local development, point the SDK at a
 * local dev server through `INNGEST_DEV` or the `--dev` mode of the
 * Inngest CLI; the client never starts in-process workers, so it is
 * serverless/Vercel compatible by construction.
 */
export const inngest = new Inngest({
  id: "meta-investimentos",
  eventTypes: events,
});
