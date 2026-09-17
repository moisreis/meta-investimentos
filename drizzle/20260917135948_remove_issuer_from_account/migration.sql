ALTER INDEX "user"."account_issuer_accountId_uidx" RENAME TO "account_providerId_accountId_uidx";--> statement-breakpoint
ALTER TABLE "user"."account" DROP COLUMN "issuer";--> statement-breakpoint
CREATE UNIQUE INDEX "account_providerId_accountId_uidx" ON "user"."account" ("provider_id","account_id");