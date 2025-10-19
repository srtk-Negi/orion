CREATE TYPE "public"."source" AS ENUM('youtube', 'twitch', 'tiktok', 'amazon', 'shopify');--> statement-breakpoint
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
CREATE TABLE "nova_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"type" text NOT NULL,
	"message" text,
	"details" jsonb,
	"createdAt" timestamp DEFAULT now()
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
	"connectedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nova_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"color" text DEFAULT '#4F46E5',
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nova_transaction_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"transactionId" integer NOT NULL,
	"tagId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nova_transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"socialAccountId" serial NOT NULL,
	"source" "source" NOT NULL,
	"name" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'USD',
	"date" timestamp DEFAULT now(),
	"status" "status" DEFAULT 'cleared',
	"paymentMethod" text,
	"isRecurring" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now()
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
ALTER TABLE "nova_log" ADD CONSTRAINT "nova_log_userId_nova_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nova_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nova_session" ADD CONSTRAINT "nova_session_userId_nova_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nova_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nova_social_account" ADD CONSTRAINT "nova_social_account_userId_nova_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nova_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nova_tag" ADD CONSTRAINT "nova_tag_userId_nova_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nova_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nova_transaction_tag" ADD CONSTRAINT "nova_transaction_tag_transactionId_nova_transaction_id_fk" FOREIGN KEY ("transactionId") REFERENCES "public"."nova_transaction"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nova_transaction_tag" ADD CONSTRAINT "nova_transaction_tag_tagId_nova_tag_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."nova_tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nova_transaction" ADD CONSTRAINT "nova_transaction_userId_nova_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nova_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nova_transaction" ADD CONSTRAINT "nova_transaction_socialAccountId_nova_social_account_id_fk" FOREIGN KEY ("socialAccountId") REFERENCES "public"."nova_social_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "nova_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "t_user_id_idx" ON "nova_session" USING btree ("userId");