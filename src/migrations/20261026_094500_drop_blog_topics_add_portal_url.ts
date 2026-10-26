import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // `DROP TABLE ... CASCADE` already removes the foreign key that
  // payload_locked_documents_rels holds against blog_topics, so the generated
  // DROP CONSTRAINT below ran against something that no longer existed and
  // aborted the migration. IF EXISTS makes both drops tolerant of either order.
  await db.execute(sql`
   ALTER TABLE "blog_topics" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "blog_topics" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_blog_topics_fk";

  DROP INDEX IF EXISTS "payload_locked_documents_rels_blog_topics_id_idx";
  ALTER TABLE "site_settings" ADD COLUMN "portal_url" varchar;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_topics_id";
  DROP TYPE "public"."enum_blog_topics_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_blog_topics_status" AS ENUM('queued', 'published', 'skipped');
  CREATE TABLE "blog_topics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"topic" varchar NOT NULL,
  	"angle" varchar,
  	"status" "enum_blog_topics_status" DEFAULT 'queued',
  	"used_at" timestamp(3) with time zone,
  	"post_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_topics_id" integer;
  ALTER TABLE "blog_topics" ADD CONSTRAINT "blog_topics_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "blog_topics_post_idx" ON "blog_topics" USING btree ("post_id");
  CREATE INDEX "blog_topics_updated_at_idx" ON "blog_topics" USING btree ("updated_at");
  CREATE INDEX "blog_topics_created_at_idx" ON "blog_topics" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_topics_fk" FOREIGN KEY ("blog_topics_id") REFERENCES "public"."blog_topics"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_blog_topics_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_topics_id");
  ALTER TABLE "site_settings" DROP COLUMN "portal_url";`)
}
