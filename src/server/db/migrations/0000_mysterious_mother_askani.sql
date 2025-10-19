CREATE TYPE "public"."source" AS ENUM('YouTube', 'Twitch', 'Tiktok', 'Amazon', 'Shopify');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'cleared', 'failed');--> statement-breakpoint
CREATE TABLE "nova_account" (
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
	CONSTRAINT "nova_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "nova_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nova_social_account" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"metadata" jsonb,
	"connectedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nova_transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"socialAccountId" serial NOT NULL,
	"source" "source" NOT NULL,
	"name" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"status" "status" DEFAULT 'cleared' NOT NULL,
	"autoTag" varchar(255) NOT NULL,
	"paymentMethod" text NOT NULL,
	"isRecurring" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nova_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "nova_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "nova_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "nova_account" ADD CONSTRAINT "nova_account_userId_nova_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nova_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nova_session" ADD CONSTRAINT "nova_session_userId_nova_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nova_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nova_social_account" ADD CONSTRAINT "nova_social_account_userId_nova_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nova_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nova_transaction" ADD CONSTRAINT "nova_transaction_userId_nova_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nova_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nova_transaction" ADD CONSTRAINT "nova_transaction_socialAccountId_nova_social_account_id_fk" FOREIGN KEY ("socialAccountId") REFERENCES "public"."nova_social_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "nova_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "t_user_id_idx" ON "nova_session" USING btree ("userId");