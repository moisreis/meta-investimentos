import { serve } from "inngest/next";

import { inngest } from "@/infrastructure/inngest/client";
import { functions } from "@/infrastructure/inngest/functions";

/**
 * Mount the *Inngest* HTTP endpoints.
 *
 * The route exposes the full job graph (schedulers and workers). Inngest
 * owns the execution loop — scheduling, retries, concurrency and step
 * checkpointing — while this application only answers HTTP invocations,
 * so no in-process worker is required (Vercel/serverless compatible).
 *
 * @see https://www.inngest.com/docs/frameworks/next-js
 */
export const { GET, POST, PUT } = serve({ client: inngest, functions });
