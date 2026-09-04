CREATE TABLE "job"."job_run" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"job_name" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"event_type" text NOT NULL,
	"event_payload" jsonb NOT NULL,
	"idempotency_key" text,
	"progress" integer DEFAULT 0 NOT NULL,
	"result_summary" jsonb,
	"error_message" text,
	"error_stack" text,
	"retries_remaining" integer DEFAULT 0 NOT NULL,
	"max_retries" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "job_run_status_check" CHECK ("status" in ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED')),
	CONSTRAINT "job_run_progress_check" CHECK ("progress" between 0 and 100)
);
--> statement-breakpoint
CREATE INDEX "job_run_status_idx" ON "job"."job_run" ("status");--> statement-breakpoint
CREATE INDEX "job_run_idempotency_key_idx" ON "job"."job_run" ("idempotency_key");--> statement-breakpoint
CREATE INDEX "job_run_finished_at_idx" ON "job"."job_run" ("finished_at");