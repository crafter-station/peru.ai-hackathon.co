CREATE TABLE "ip_rate_limits" (
	"ip_address" text PRIMARY KEY NOT NULL,
	"generations_used" integer DEFAULT 0 NOT NULL,
	"max_generations" integer DEFAULT 10 NOT NULL,
	"reset_at" timestamp NOT NULL,
	"last_generation_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "anonymous_users" ADD COLUMN "last_generation_at" timestamp;