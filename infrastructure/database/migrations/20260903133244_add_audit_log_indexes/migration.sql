CREATE INDEX "audit_log_user_id_created_at_idx" ON "audit"."audit_log" ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "audit"."audit_log" ("created_at");--> statement-breakpoint
CREATE INDEX "audit_log_entity_entity_id_created_at_idx" ON "audit"."audit_log" ("entity","entity_id","created_at" DESC NULLS LAST);