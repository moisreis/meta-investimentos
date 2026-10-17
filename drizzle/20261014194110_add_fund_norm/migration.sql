ALTER TABLE "fund"."fund" ADD COLUMN "norm_id" uuid;--> statement-breakpoint
CREATE INDEX "fund_norm_id_idx" ON "fund"."fund" ("norm_id");--> statement-breakpoint
ALTER TABLE "fund"."fund" ADD CONSTRAINT "fund_norm_id_norm_id_fkey" FOREIGN KEY ("norm_id") REFERENCES "portfolio"."norm"("id");