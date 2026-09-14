CREATE SCHEMA IF NOT EXISTS "user";--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "portfolio";--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "audit";--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "bank";--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "benchmark";--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "fund";--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "performance";--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "report";--> statement-breakpoint
CREATE TYPE "user"."user_role" AS ENUM('USER', 'MANAGER');--> statement-breakpoint
CREATE TABLE "user"."account" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"issuer" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio"."application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"position_id" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"amount" numeric(18,6) NOT NULL,
	"quotas" numeric(18,6) NOT NULL,
	"reversed_at" timestamp with time zone,
	"reversed_by_user_id" text,
	"version" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "application_amount_nonneg" CHECK ("amount" >= 0),
	CONSTRAINT "application_quotas_nonneg" CHECK ("quotas" >= 0)
);
--> statement-breakpoint
CREATE TABLE "audit"."audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"entity" text NOT NULL,
	"entity_id" text NOT NULL,
	"action" text NOT NULL,
	"changes" jsonb,
	"user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bank"."bank" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bank"."bank_account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"portfolio_id" uuid NOT NULL,
	"bank_id" uuid NOT NULL,
	"agency" text NOT NULL,
	"account_number" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "benchmark"."benchmark" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"acronym" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "benchmark"."benchmark_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"benchmark_id" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"rate" numeric(18,6) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fund"."category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bank"."checking_account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"bank_account_id" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"value" numeric(18,6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fund"."fund" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"cnpj" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"administration_fee" numeric(18,6),
	"performance_fee" numeric(18,6),
	"bank_id" uuid NOT NULL,
	"benchmark_id" uuid,
	"category_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio"."norm" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"article_number" text NOT NULL,
	"name" text NOT NULL,
	"category_id" uuid NOT NULL,
	"min_allocation" numeric(5,2) NOT NULL,
	"max_allocation" numeric(5,2) NOT NULL,
	"target_allocation" numeric(5,2) NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "norm_allocation_order" CHECK ("min_allocation" <= "target_allocation" AND "target_allocation" <= "max_allocation")
);
--> statement-breakpoint
CREATE TABLE "portfolio"."norms_portfolios" (
	"norm_id" uuid,
	"portfolio_id" uuid,
	"min_allocation" numeric(5,2) NOT NULL,
	"max_allocation" numeric(5,2) NOT NULL,
	"target_allocation" numeric(5,2) NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "norms_portfolios_pkey" PRIMARY KEY("norm_id","portfolio_id"),
	CONSTRAINT "norms_portfolios_allocation_order" CHECK ("min_allocation" <= "target_allocation" AND "target_allocation" <= "max_allocation")
);
--> statement-breakpoint
CREATE TABLE "portfolio"."portfolio" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"acronym" text NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"annual_interest_rate" numeric(5,2) NOT NULL,
	"min_allocation" numeric(5,2) NOT NULL,
	"max_allocation" numeric(5,2) NOT NULL,
	"target_allocation" numeric(5,2) NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "portfolio_allocation_order" CHECK ("min_allocation" <= "target_allocation" AND "target_allocation" <= "max_allocation")
);
--> statement-breakpoint
CREATE TABLE "performance"."portfolio_performance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"portfolio_id" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"quotas_held" numeric(18,6) NOT NULL,
	"patrimony" numeric(18,6) NOT NULL,
	"application_total" numeric(18,6) NOT NULL,
	"redemption_total" numeric(18,6) NOT NULL,
	"cash_flow_net" numeric(18,6) NOT NULL,
	"earnings" numeric(18,6) NOT NULL,
	"return_daily" numeric NOT NULL,
	"return_monthly" numeric,
	"return_yearly" numeric,
	"return_last_12m" numeric,
	"target" numeric,
	"cumulative_target" numeric,
	"inflation_spread" numeric,
	"risk_free_spread" numeric,
	"market_spread" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio"."position" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"portfolio_id" uuid NOT NULL,
	"fund_id" uuid NOT NULL,
	"initial_balance" numeric(18,6),
	"initial_balance_date" timestamp with time zone,
	"version" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "position_initial_balance_nonneg" CHECK ("initial_balance" >= 0)
);
--> statement-breakpoint
CREATE TABLE "performance"."position_performance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"position_id" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"quotas_held" numeric(18,6) NOT NULL,
	"patrimony" numeric(18,6) NOT NULL,
	"application_total" numeric(18,6) NOT NULL,
	"redemption_total" numeric(18,6) NOT NULL,
	"cash_flow_net" numeric(18,6) NOT NULL,
	"earnings" numeric(18,6) NOT NULL,
	"return_daily" numeric NOT NULL,
	"return_monthly" numeric,
	"return_yearly" numeric,
	"return_last_12m" numeric,
	"allocation" numeric NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fund"."quota" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"fund_id" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"price" numeric(18,6) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quota_price_nonneg" CHECK ("price" >= 0)
);
--> statement-breakpoint
CREATE TABLE "user"."session" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report"."statement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"portfolio_id" uuid,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"file_url" text NOT NULL,
	"generated_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio"."transaction_allocation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"application_id" uuid NOT NULL,
	"withdraw_id" uuid NOT NULL,
	"quotas_consumed" numeric(18,6) NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transaction_allocation_quotas_consumed_nonneg" CHECK ("quotas_consumed" >= 0)
);
--> statement-breakpoint
CREATE TABLE "user"."user" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"cpf" text NOT NULL UNIQUE,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" "user"."user_role" DEFAULT 'USER'::"user"."user_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user"."verification" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio"."withdrawal" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"position_id" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"amount" numeric(18,6) NOT NULL,
	"quotas" numeric(18,6) NOT NULL,
	"reversed_at" timestamp with time zone,
	"reversed_by_user_id" text,
	"version" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "withdrawal_amount_nonneg" CHECK ("amount" >= 0),
	CONSTRAINT "withdrawal_quotas_nonneg" CHECK ("quotas" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "account_issuer_accountId_uidx" ON "user"."account" ("issuer","account_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "user"."account" ("user_id");--> statement-breakpoint
CREATE INDEX "application_position_date_idx" ON "portfolio"."application" ("position_id","date");--> statement-breakpoint
CREATE INDEX "audit_log_entity_entity_id_idx" ON "audit"."audit_log" ("entity","entity_id");--> statement-breakpoint
CREATE INDEX "audit_log_user_id_idx" ON "audit"."audit_log" ("user_id");--> statement-breakpoint
CREATE INDEX "audit_log_user_id_created_at_idx" ON "audit"."audit_log" ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "audit"."audit_log" ("created_at");--> statement-breakpoint
CREATE INDEX "audit_log_entity_entity_id_created_at_idx" ON "audit"."audit_log" ("entity","entity_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "bank_account_portfolio_bank_agency_number_uidx" ON "bank"."bank_account" ("portfolio_id","bank_id","agency","account_number");--> statement-breakpoint
CREATE INDEX "bank_account_portfolio_bank_agency_number_idx" ON "bank"."bank_account" ("portfolio_id","bank_id","agency","account_number");--> statement-breakpoint
CREATE INDEX "bank_account_bank_id_idx" ON "bank"."bank_account" ("bank_id");--> statement-breakpoint
CREATE UNIQUE INDEX "benchmark_acronym_name_uidx" ON "benchmark"."benchmark" ("acronym","name");--> statement-breakpoint
CREATE INDEX "benchmark_acronym_idx" ON "benchmark"."benchmark" ("acronym");--> statement-breakpoint
CREATE UNIQUE INDEX "benchmark_history_benchmark_date_uidx" ON "benchmark"."benchmark_history" ("benchmark_id","date");--> statement-breakpoint
CREATE INDEX "benchmark_history_benchmark_id_idx" ON "benchmark"."benchmark_history" ("benchmark_id");--> statement-breakpoint
CREATE UNIQUE INDEX "checking_account_bank_account_date_uidx" ON "bank"."checking_account" ("bank_account_id","date");--> statement-breakpoint
CREATE INDEX "checking_account_bank_account_date_idx" ON "bank"."checking_account" ("bank_account_id","date");--> statement-breakpoint
CREATE INDEX "fund_bank_id_idx" ON "fund"."fund" ("bank_id");--> statement-breakpoint
CREATE INDEX "fund_benchmark_id_idx" ON "fund"."fund" ("benchmark_id");--> statement-breakpoint
CREATE INDEX "fund_category_id_idx" ON "fund"."fund" ("category_id");--> statement-breakpoint
CREATE INDEX "norm_category_id_idx" ON "portfolio"."norm" ("category_id");--> statement-breakpoint
CREATE INDEX "norms_portfolios_portfolio_id_idx" ON "portfolio"."norms_portfolios" ("portfolio_id");--> statement-breakpoint
CREATE INDEX "norms_portfolios_norm_id_idx" ON "portfolio"."norms_portfolios" ("norm_id");--> statement-breakpoint
CREATE INDEX "portfolio_user_id_idx" ON "portfolio"."portfolio" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "portfolio_performance_portfolio_date_uidx" ON "performance"."portfolio_performance" ("portfolio_id","date");--> statement-breakpoint
CREATE INDEX "portfolio_performance_portfolio_date_idx" ON "performance"."portfolio_performance" ("portfolio_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "position_portfolio_fund_uidx" ON "portfolio"."position" ("portfolio_id","fund_id");--> statement-breakpoint
CREATE INDEX "position_portfolio_id_idx" ON "portfolio"."position" ("portfolio_id");--> statement-breakpoint
CREATE INDEX "position_fund_id_idx" ON "portfolio"."position" ("fund_id");--> statement-breakpoint
CREATE UNIQUE INDEX "position_performance_position_date_uidx" ON "performance"."position_performance" ("position_id","date");--> statement-breakpoint
CREATE INDEX "position_performance_position_date_idx" ON "performance"."position_performance" ("position_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "quota_fund_date_uidx" ON "fund"."quota" ("fund_id","date");--> statement-breakpoint
CREATE INDEX "quota_fund_date_idx" ON "fund"."quota" ("fund_id","date");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "user"."session" ("user_id");--> statement-breakpoint
CREATE INDEX "statement_portfolio_period_idx" ON "report"."statement" ("portfolio_id","period_start","period_end");--> statement-breakpoint
CREATE INDEX "statement_generated_by_user_id_idx" ON "report"."statement" ("generated_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "transaction_allocation_application_withdraw_uidx" ON "portfolio"."transaction_allocation" ("application_id","withdraw_id");--> statement-breakpoint
CREATE INDEX "transaction_allocation_application_id_idx" ON "portfolio"."transaction_allocation" ("application_id");--> statement-breakpoint
CREATE INDEX "transaction_allocation_withdraw_id_idx" ON "portfolio"."transaction_allocation" ("withdraw_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "user"."verification" ("identifier");--> statement-breakpoint
CREATE INDEX "withdrawal_position_date_idx" ON "portfolio"."withdrawal" ("position_id","date");--> statement-breakpoint
ALTER TABLE "user"."account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "portfolio"."application" ADD CONSTRAINT "application_position_id_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "portfolio"."position"("id");--> statement-breakpoint
ALTER TABLE "portfolio"."application" ADD CONSTRAINT "application_reversed_by_user_id_user_id_fkey" FOREIGN KEY ("reversed_by_user_id") REFERENCES "user"."user"("id");--> statement-breakpoint
ALTER TABLE "audit"."audit_log" ADD CONSTRAINT "audit_log_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."user"("id");--> statement-breakpoint
ALTER TABLE "bank"."bank_account" ADD CONSTRAINT "bank_account_portfolio_id_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolio"."portfolio"("id");--> statement-breakpoint
ALTER TABLE "bank"."bank_account" ADD CONSTRAINT "bank_account_bank_id_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "bank"."bank"("id");--> statement-breakpoint
ALTER TABLE "benchmark"."benchmark_history" ADD CONSTRAINT "benchmark_history_benchmark_id_benchmark_id_fkey" FOREIGN KEY ("benchmark_id") REFERENCES "benchmark"."benchmark"("id");--> statement-breakpoint
ALTER TABLE "bank"."checking_account" ADD CONSTRAINT "checking_account_bank_account_id_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank"."bank_account"("id");--> statement-breakpoint
ALTER TABLE "fund"."fund" ADD CONSTRAINT "fund_bank_id_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "bank"."bank"("id");--> statement-breakpoint
ALTER TABLE "fund"."fund" ADD CONSTRAINT "fund_benchmark_id_benchmark_id_fkey" FOREIGN KEY ("benchmark_id") REFERENCES "benchmark"."benchmark"("id");--> statement-breakpoint
ALTER TABLE "fund"."fund" ADD CONSTRAINT "fund_category_id_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "fund"."category"("id");--> statement-breakpoint
ALTER TABLE "portfolio"."norm" ADD CONSTRAINT "norm_category_id_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "fund"."category"("id");--> statement-breakpoint
ALTER TABLE "portfolio"."norms_portfolios" ADD CONSTRAINT "norms_portfolios_norm_id_norm_id_fkey" FOREIGN KEY ("norm_id") REFERENCES "portfolio"."norm"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "portfolio"."norms_portfolios" ADD CONSTRAINT "norms_portfolios_portfolio_id_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolio"."portfolio"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "portfolio"."portfolio" ADD CONSTRAINT "portfolio_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."user"("id");--> statement-breakpoint
ALTER TABLE "performance"."portfolio_performance" ADD CONSTRAINT "portfolio_performance_portfolio_id_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolio"."portfolio"("id");--> statement-breakpoint
ALTER TABLE "portfolio"."position" ADD CONSTRAINT "position_portfolio_id_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolio"."portfolio"("id");--> statement-breakpoint
ALTER TABLE "portfolio"."position" ADD CONSTRAINT "position_fund_id_fund_id_fkey" FOREIGN KEY ("fund_id") REFERENCES "fund"."fund"("id");--> statement-breakpoint
ALTER TABLE "performance"."position_performance" ADD CONSTRAINT "position_performance_position_id_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "portfolio"."position"("id");--> statement-breakpoint
ALTER TABLE "fund"."quota" ADD CONSTRAINT "quota_fund_id_fund_id_fkey" FOREIGN KEY ("fund_id") REFERENCES "fund"."fund"("id");--> statement-breakpoint
ALTER TABLE "user"."session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "report"."statement" ADD CONSTRAINT "statement_portfolio_id_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolio"."portfolio"("id");--> statement-breakpoint
ALTER TABLE "report"."statement" ADD CONSTRAINT "statement_generated_by_user_id_user_id_fkey" FOREIGN KEY ("generated_by_user_id") REFERENCES "user"."user"("id");--> statement-breakpoint
ALTER TABLE "portfolio"."transaction_allocation" ADD CONSTRAINT "transaction_allocation_application_id_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "portfolio"."application"("id");--> statement-breakpoint
ALTER TABLE "portfolio"."transaction_allocation" ADD CONSTRAINT "transaction_allocation_withdraw_id_withdrawal_id_fkey" FOREIGN KEY ("withdraw_id") REFERENCES "portfolio"."withdrawal"("id");--> statement-breakpoint
ALTER TABLE "portfolio"."withdrawal" ADD CONSTRAINT "withdrawal_position_id_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "portfolio"."position"("id");--> statement-breakpoint
ALTER TABLE "portfolio"."withdrawal" ADD CONSTRAINT "withdrawal_reversed_by_user_id_user_id_fkey" FOREIGN KEY ("reversed_by_user_id") REFERENCES "user"."user"("id");