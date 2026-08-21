CREATE TYPE "public"."data_source" AS ENUM('hn', 'yc-companies', 'yc-jobs');--> statement-breakpoint
CREATE TYPE "public"."health_status" AS ENUM('healthy', 'warning', 'failed');--> statement-breakpoint
CREATE TYPE "public"."link_type" AS ENUM('website', 'careers', 'apply', 'twitter', 'linkedin', 'github', 'email', 'source');--> statement-breakpoint
CREATE TABLE "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"role" text,
	"source_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"startup_id" uuid NOT NULL,
	"title" text NOT NULL,
	"location" text,
	"remote" boolean,
	"salary" text,
	"apply_url" text,
	"source_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "score_reasons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"startup_id" uuid NOT NULL,
	"label" text NOT NULL,
	"points" integer NOT NULL,
	"present" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" "data_source" NOT NULL,
	"collector_id" text,
	"status" "health_status" NOT NULL,
	"records_found" integer DEFAULT 0 NOT NULL,
	"records_valid" integer DEFAULT 0 NOT NULL,
	"records_invalid" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "startup_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"startup_id" uuid NOT NULL,
	"type" "link_type" NOT NULL,
	"url" text NOT NULL,
	"label" text
);
--> statement-breakpoint
CREATE TABLE "startup_people" (
	"startup_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	CONSTRAINT "startup_people_startup_id_person_id_pk" PRIMARY KEY("startup_id","person_id")
);
--> statement-breakpoint
CREATE TABLE "startup_technologies" (
	"startup_id" uuid NOT NULL,
	"technology_id" uuid NOT NULL,
	CONSTRAINT "startup_technologies_startup_id_technology_id_pk" PRIMARY KEY("startup_id","technology_id")
);
--> statement-breakpoint
CREATE TABLE "startups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"industry" text,
	"location" text,
	"batch" text,
	"source" "data_source" NOT NULL,
	"source_url" text NOT NULL,
	"website_url" text,
	"signal_score" integer DEFAULT 0 NOT NULL,
	"source_published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "technologies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_reasons" ADD CONSTRAINT "score_reasons_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "startup_links" ADD CONSTRAINT "startup_links_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "startup_people" ADD CONSTRAINT "startup_people_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "startup_people" ADD CONSTRAINT "startup_people_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "startup_technologies" ADD CONSTRAINT "startup_technologies_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "startup_technologies" ADD CONSTRAINT "startup_technologies_technology_id_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "people_name_source_url_unique" ON "people" USING btree ("name","source_url");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_startup_title_source_unique" ON "roles" USING btree ("startup_id","title","source_url");--> statement-breakpoint
CREATE INDEX "roles_title_idx" ON "roles" USING btree ("title");--> statement-breakpoint
CREATE UNIQUE INDEX "score_reasons_startup_label_unique" ON "score_reasons" USING btree ("startup_id","label");--> statement-breakpoint
CREATE INDEX "source_runs_source_started_idx" ON "source_runs" USING btree ("source","started_at");--> statement-breakpoint
CREATE UNIQUE INDEX "startup_links_startup_type_url_unique" ON "startup_links" USING btree ("startup_id","type","url");--> statement-breakpoint
CREATE UNIQUE INDEX "startups_name_source_unique" ON "startups" USING btree ("name","source");--> statement-breakpoint
CREATE UNIQUE INDEX "startups_slug_unique" ON "startups" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "startups_search_idx" ON "startups" USING btree ("name");--> statement-breakpoint
CREATE INDEX "startups_score_idx" ON "startups" USING btree ("signal_score");--> statement-breakpoint
CREATE UNIQUE INDEX "technologies_name_unique" ON "technologies" USING btree ("name");