CREATE TYPE "public"."app_user_roles" AS ENUM('super_admin', 'admin', 'basic');--> statement-breakpoint
CREATE TABLE "gloflow_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "gloflow_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "gloflow_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gloflow_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"role" "app_user_roles" DEFAULT 'basic' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gloflow_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "gloflow_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "gloflow_account" ADD CONSTRAINT "gloflow_account_userId_gloflow_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gloflow_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gloflow_session" ADD CONSTRAINT "gloflow_session_userId_gloflow_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gloflow_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "gloflow_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "t_user_id_idx" ON "gloflow_session" USING btree ("userId");