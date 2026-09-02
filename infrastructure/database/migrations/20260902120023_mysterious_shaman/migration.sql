ALTER TABLE "audit"."audit_log" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bank"."bank" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bank"."bank" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bank"."bank_account" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bank"."bank_account" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bank"."checking_account" ALTER COLUMN "date" SET DATA TYPE timestamp with time zone USING "date"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bank"."checking_account" ALTER COLUMN "value" SET DATA TYPE numeric(18,6) USING "value"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "benchmark"."benchmark" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "benchmark"."benchmark_history" ALTER COLUMN "date" SET DATA TYPE timestamp with time zone USING "date"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "benchmark"."benchmark_history" ALTER COLUMN "rate" SET DATA TYPE numeric(18,6) USING "rate"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "benchmark"."benchmark_history" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "fund"."category" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "fund"."category" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "fund"."category" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "fund"."fund" ALTER COLUMN "administration_fee" SET DATA TYPE numeric(18,6) USING "administration_fee"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "fund"."fund" ALTER COLUMN "performance_fee" SET DATA TYPE numeric(18,6) USING "performance_fee"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "fund"."fund" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "fund"."fund" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "fund"."quota" ALTER COLUMN "date" SET DATA TYPE timestamp with time zone USING "date"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "fund"."quota" ALTER COLUMN "price" SET DATA TYPE numeric(18,6) USING "price"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "fund"."quota" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "performance"."portfolio_performance" ALTER COLUMN "date" SET DATA TYPE timestamp with time zone USING "date"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "performance"."portfolio_performance" ALTER COLUMN "quotas_held" SET DATA TYPE numeric(18,6) USING "quotas_held"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "performance"."portfolio_performance" ALTER COLUMN "patrimony" SET DATA TYPE numeric(18,6) USING "patrimony"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "performance"."portfolio_performance" ALTER COLUMN "application_total" SET DATA TYPE numeric(18,6) USING "application_total"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "performance"."portfolio_performance" ALTER COLUMN "redemption_total" SET DATA TYPE numeric(18,6) USING "redemption_total"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "performance"."portfolio_performance" ALTER COLUMN "cash_flow_net" SET DATA TYPE numeric(18,6) USING "cash_flow_net"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "performance"."portfolio_performance" ALTER COLUMN "earnings" SET DATA TYPE numeric(18,6) USING "earnings"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "performance"."portfolio_performance" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "performance"."position_performance" ALTER COLUMN "date" SET DATA TYPE timestamp with time zone USING "date"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "performance"."position_performance" ALTER COLUMN "quotas_held" SET DATA TYPE numeric(18,6) USING "quotas_held"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "performance"."position_performance" ALTER COLUMN "patrimony" SET DATA TYPE numeric(18,6) USING "patrimony"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "performance"."position_performance" ALTER COLUMN "application_total" SET DATA TYPE numeric(18,6) USING "application_total"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "performance"."position_performance" ALTER COLUMN "redemption_total" SET DATA TYPE numeric(18,6) USING "redemption_total"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "performance"."position_performance" ALTER COLUMN "cash_flow_net" SET DATA TYPE numeric(18,6) USING "cash_flow_net"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "performance"."position_performance" ALTER COLUMN "earnings" SET DATA TYPE numeric(18,6) USING "earnings"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "performance"."position_performance" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."application" ALTER COLUMN "date" SET DATA TYPE timestamp with time zone USING "date"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."application" ALTER COLUMN "amount" SET DATA TYPE numeric(18,6) USING "amount"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "portfolio"."application" ALTER COLUMN "quotas" SET DATA TYPE numeric(18,6) USING "quotas"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "portfolio"."application" ALTER COLUMN "reversed_at" SET DATA TYPE timestamp with time zone USING "reversed_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."application" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."application" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."norm" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."norm" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."norms_portfolios" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."portfolio" ALTER COLUMN "annual_interest_rate" SET DATA TYPE numeric(5,2) USING "annual_interest_rate"::numeric(5,2);--> statement-breakpoint
ALTER TABLE "portfolio"."portfolio" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."portfolio" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."position" ALTER COLUMN "initial_balance" SET DATA TYPE numeric(18,6) USING "initial_balance"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "portfolio"."position" ALTER COLUMN "initial_balance_date" SET DATA TYPE timestamp with time zone USING "initial_balance_date"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."position" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."position" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."transaction_allocation" ALTER COLUMN "quotas_consumed" SET DATA TYPE numeric(18,6) USING "quotas_consumed"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "portfolio"."transaction_allocation" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."withdrawal" ALTER COLUMN "date" SET DATA TYPE timestamp with time zone USING "date"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."withdrawal" ALTER COLUMN "amount" SET DATA TYPE numeric(18,6) USING "amount"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "portfolio"."withdrawal" ALTER COLUMN "quotas" SET DATA TYPE numeric(18,6) USING "quotas"::numeric(18,6);--> statement-breakpoint
ALTER TABLE "portfolio"."withdrawal" ALTER COLUMN "reversed_at" SET DATA TYPE timestamp with time zone USING "reversed_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."withdrawal" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio"."withdrawal" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "report"."statement" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user"."account" ALTER COLUMN "access_token_expires_at" SET DATA TYPE timestamp with time zone USING "access_token_expires_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user"."account" ALTER COLUMN "refresh_token_expires_at" SET DATA TYPE timestamp with time zone USING "refresh_token_expires_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user"."account" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user"."account" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user"."session" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone USING "expires_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user"."session" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user"."session" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user"."user" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user"."user" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user"."verification" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone USING "expires_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user"."verification" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user"."verification" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "fund"."quota" ADD CONSTRAINT "quota_price_nonneg" CHECK ("price" >= 0);--> statement-breakpoint
ALTER TABLE "portfolio"."application" ADD CONSTRAINT "application_amount_nonneg" CHECK ("amount" >= 0);--> statement-breakpoint
ALTER TABLE "portfolio"."application" ADD CONSTRAINT "application_quotas_nonneg" CHECK ("quotas" >= 0);--> statement-breakpoint
ALTER TABLE "portfolio"."norm" ADD CONSTRAINT "norm_allocation_order" CHECK ("min_allocation" <= "target_allocation" AND "target_allocation" <= "max_allocation");--> statement-breakpoint
ALTER TABLE "portfolio"."norms_portfolios" ADD CONSTRAINT "norms_portfolios_allocation_order" CHECK ("min_allocation" <= "target_allocation" AND "target_allocation" <= "max_allocation");--> statement-breakpoint
ALTER TABLE "portfolio"."portfolio" ADD CONSTRAINT "portfolio_allocation_order" CHECK ("min_allocation" <= "target_allocation" AND "target_allocation" <= "max_allocation");--> statement-breakpoint
ALTER TABLE "portfolio"."position" ADD CONSTRAINT "position_initial_balance_nonneg" CHECK ("initial_balance" >= 0);--> statement-breakpoint
ALTER TABLE "portfolio"."transaction_allocation" ADD CONSTRAINT "transaction_allocation_quotas_consumed_nonneg" CHECK ("quotas_consumed" >= 0);--> statement-breakpoint
ALTER TABLE "portfolio"."withdrawal" ADD CONSTRAINT "withdrawal_amount_nonneg" CHECK ("amount" >= 0);--> statement-breakpoint
ALTER TABLE "portfolio"."withdrawal" ADD CONSTRAINT "withdrawal_quotas_nonneg" CHECK ("quotas" >= 0);