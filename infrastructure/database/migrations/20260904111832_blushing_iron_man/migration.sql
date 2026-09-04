CREATE TABLE "fund"."cvm_import" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"source" text DEFAULT 'CVM' NOT NULL,
	"status" text DEFAULT 'RUNNING' NOT NULL,
	"requested_start" timestamp with time zone,
	"requested_end" timestamp with time zone,
	"requested_fund_cnpjs" text[],
	"months_back" integer DEFAULT 12 NOT NULL,
	"files_found" integer DEFAULT 0 NOT NULL,
	"files_downloaded" integer DEFAULT 0 NOT NULL,
	"files_unavailable" integer DEFAULT 0 NOT NULL,
	"records_matched" integer DEFAULT 0 NOT NULL,
	"records_imported" integer DEFAULT 0 NOT NULL,
	"records_upserted" integer DEFAULT 0 NOT NULL,
	"records_skipped" integer DEFAULT 0 NOT NULL,
	"error" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cvm_import_status_check" CHECK ("status" in ('RUNNING', 'SUCCESS', 'PARTIAL', 'FAILED'))
);
--> statement-breakpoint
CREATE TABLE "fund"."quota_import" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"import_id" uuid NOT NULL,
	"fund_id" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"price" numeric(18,6) NOT NULL,
	"action" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quota_import_price_nonneg" CHECK ("price" >= 0),
	CONSTRAINT "quota_import_action_check" CHECK ("action" in ('INSERT', 'UPDATE', 'SKIP'))
);
--> statement-breakpoint
CREATE INDEX "cvm_import_finished_at_idx" ON "fund"."cvm_import" ("finished_at");--> statement-breakpoint
CREATE INDEX "quota_import_import_id_idx" ON "fund"."quota_import" ("import_id");--> statement-breakpoint
CREATE INDEX "quota_import_fund_id_idx" ON "fund"."quota_import" ("fund_id");--> statement-breakpoint
ALTER TABLE "fund"."quota_import" ADD CONSTRAINT "quota_import_import_id_cvm_import_id_fkey" FOREIGN KEY ("import_id") REFERENCES "fund"."cvm_import"("id");--> statement-breakpoint
ALTER TABLE "fund"."quota_import" ADD CONSTRAINT "quota_import_fund_id_fund_id_fkey" FOREIGN KEY ("fund_id") REFERENCES "fund"."fund"("id");