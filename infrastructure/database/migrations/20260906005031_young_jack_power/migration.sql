ALTER TABLE "audit"."audit_log" ALTER COLUMN "user_id" SET DATA TYPE text USING "user_id"::text;--> statement-breakpoint
ALTER TABLE "portfolio"."application" ALTER COLUMN "reversed_by_user_id" SET DATA TYPE text USING "reversed_by_user_id"::text;--> statement-breakpoint
ALTER TABLE "portfolio"."portfolio" ALTER COLUMN "user_id" SET DATA TYPE text USING "user_id"::text;--> statement-breakpoint
ALTER TABLE "portfolio"."portfolio_permission" ALTER COLUMN "user_id" SET DATA TYPE text USING "user_id"::text;--> statement-breakpoint
ALTER TABLE "portfolio"."portfolio_permission" ALTER COLUMN "granted_by_user_id" SET DATA TYPE text USING "granted_by_user_id"::text;--> statement-breakpoint
ALTER TABLE "portfolio"."withdrawal" ALTER COLUMN "reversed_by_user_id" SET DATA TYPE text USING "reversed_by_user_id"::text;--> statement-breakpoint
ALTER TABLE "report"."statement" ALTER COLUMN "generated_by_user_id" SET DATA TYPE text USING "generated_by_user_id"::text;--> statement-breakpoint
ALTER TABLE "user"."account" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;--> statement-breakpoint
ALTER TABLE "user"."account" ALTER COLUMN "user_id" SET DATA TYPE text USING "user_id"::text;--> statement-breakpoint
ALTER TABLE "user"."session" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;--> statement-breakpoint
ALTER TABLE "user"."session" ALTER COLUMN "user_id" SET DATA TYPE text USING "user_id"::text;--> statement-breakpoint
ALTER TABLE "user"."user" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;--> statement-breakpoint
ALTER TABLE "user"."verification" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;