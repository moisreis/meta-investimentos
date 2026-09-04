CREATE TABLE "portfolio"."portfolio_permission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"role" text NOT NULL,
	"granted_by_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX "portfolio_permission_user_id_idx" ON "portfolio"."portfolio_permission" ("user_id");--> statement-breakpoint
CREATE INDEX "portfolio_permission_portfolio_id_idx" ON "portfolio"."portfolio_permission" ("portfolio_id");--> statement-breakpoint
CREATE UNIQUE INDEX "portfolio_permission_user_portfolio_uidx" ON "portfolio"."portfolio_permission" ("user_id","portfolio_id");--> statement-breakpoint
ALTER TABLE "portfolio"."portfolio_permission" ADD CONSTRAINT "portfolio_permission_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."user"("id");--> statement-breakpoint
ALTER TABLE "portfolio"."portfolio_permission" ADD CONSTRAINT "portfolio_permission_portfolio_id_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolio"."portfolio"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "portfolio"."portfolio_permission" ADD CONSTRAINT "portfolio_permission_granted_by_user_id_user_id_fkey" FOREIGN KEY ("granted_by_user_id") REFERENCES "user"."user"("id");