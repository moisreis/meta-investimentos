ALTER TABLE "portfolio"."portfolio" DROP CONSTRAINT "portfolio_allocation_order";--> statement-breakpoint
ALTER TABLE "portfolio"."portfolio" DROP COLUMN "min_allocation";--> statement-breakpoint
ALTER TABLE "portfolio"."portfolio" DROP COLUMN "max_allocation";--> statement-breakpoint
ALTER TABLE "portfolio"."portfolio" DROP COLUMN "target_allocation";