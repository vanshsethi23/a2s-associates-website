import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_properties_property_type" AS ENUM('builder-floor', 'pre-owned-floor', 'independent-house', 'office-space', 'plot');
  CREATE TYPE "public"."enum_properties_listing_type" AS ENUM('sale', 'rent', 'collaboration');
  CREATE TYPE "public"."enum_properties_availability" AS ENUM('available', 'under-offer', 'under-construction', 'sold', 'rented');
  CREATE TYPE "public"."enum_properties_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__properties_v_version_property_type" AS ENUM('builder-floor', 'pre-owned-floor', 'independent-house', 'office-space', 'plot');
  CREATE TYPE "public"."enum__properties_v_version_listing_type" AS ENUM('sale', 'rent', 'collaboration');
  CREATE TYPE "public"."enum__properties_v_version_availability" AS ENUM('available', 'under-offer', 'under-construction', 'sold', 'rented');
  CREATE TYPE "public"."enum__properties_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_blog_topics_status" AS ENUM('queued', 'published', 'skipped');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'contacted', 'closed');
  CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'X');
  CREATE TABLE "properties_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "properties_amenities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "properties_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "properties_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "properties_floor_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "properties" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"locality" varchar,
  	"location" varchar DEFAULT 'South Delhi',
  	"property_type" "enum_properties_property_type",
  	"listing_type" "enum_properties_listing_type" DEFAULT 'sale',
  	"availability" "enum_properties_availability" DEFAULT 'available',
  	"configuration" varchar,
  	"area" varchar,
  	"floor" varchar,
  	"facing" varchar,
  	"price" varchar,
  	"price_note" varchar,
  	"featured" boolean DEFAULT false,
  	"description" jsonb,
  	"hero_image_id" integer,
  	"video_url" varchar,
  	"video_file_id" integer,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_properties_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_properties_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_properties_v_version_amenities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_properties_v_version_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_properties_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_properties_v_version_floor_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_properties_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_locality" varchar,
  	"version_location" varchar DEFAULT 'South Delhi',
  	"version_property_type" "enum__properties_v_version_property_type",
  	"version_listing_type" "enum__properties_v_version_listing_type" DEFAULT 'sale',
  	"version_availability" "enum__properties_v_version_availability" DEFAULT 'available',
  	"version_configuration" varchar,
  	"version_area" varchar,
  	"version_floor" varchar,
  	"version_facing" varchar,
  	"version_price" varchar,
  	"version_price_note" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_description" jsonb,
  	"version_hero_image_id" integer,
  	"version_video_url" varchar,
  	"version_video_file_id" integer,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__properties_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "posts_key_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"point" varchar
  );
  
  CREATE TABLE "posts_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "posts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"category_id" integer,
  	"published_date" timestamp(3) with time zone,
  	"featured_image_id" integer,
  	"image_brief" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"author" varchar DEFAULT 'A2S Estates',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_posts_v_version_key_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"point" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_category_id" integer,
  	"version_published_date" timestamp(3) with time zone,
  	"version_featured_image_id" integer,
  	"version_image_brief" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_author" varchar DEFAULT 'A2S Estates',
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"message" varchar,
  	"property_id" integer,
  	"consent" boolean,
  	"status" "enum_enquiries_status" DEFAULT 'new',
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"properties_id" integer,
  	"posts_id" integer,
  	"categories_id" integer,
  	"blog_topics_id" integer,
  	"media_id" integer,
  	"enquiries_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_links_platform",
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"address" varchar,
  	"phone" varchar,
  	"phone_secondary" varchar,
  	"email" varchar,
  	"whatsapp" varchar,
  	"office_hours" varchar,
  	"map_embed_url" varchar,
  	"consent_text" varchar DEFAULT 'I agree to be contacted by A2S Estates by phone, WhatsApp or email about my enquiry, and I accept the Privacy Policy.',
  	"copyright_name" varchar DEFAULT 'A2S Estates',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "properties_highlights" ADD CONSTRAINT "properties_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_amenities" ADD CONSTRAINT "properties_amenities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_specifications" ADD CONSTRAINT "properties_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_gallery" ADD CONSTRAINT "properties_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_gallery" ADD CONSTRAINT "properties_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_floor_plans" ADD CONSTRAINT "properties_floor_plans_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_floor_plans" ADD CONSTRAINT "properties_floor_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v_version_highlights" ADD CONSTRAINT "_properties_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_version_amenities" ADD CONSTRAINT "_properties_v_version_amenities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_version_specifications" ADD CONSTRAINT "_properties_v_version_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_version_gallery" ADD CONSTRAINT "_properties_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v_version_gallery" ADD CONSTRAINT "_properties_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_version_floor_plans" ADD CONSTRAINT "_properties_v_version_floor_plans_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v_version_floor_plans" ADD CONSTRAINT "_properties_v_version_floor_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v" ADD CONSTRAINT "_properties_v_parent_id_properties_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v" ADD CONSTRAINT "_properties_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v" ADD CONSTRAINT "_properties_v_version_video_file_id_media_id_fk" FOREIGN KEY ("version_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v" ADD CONSTRAINT "_properties_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_key_takeaways" ADD CONSTRAINT "posts_key_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_faqs" ADD CONSTRAINT "posts_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_tags" ADD CONSTRAINT "posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_version_key_takeaways" ADD CONSTRAINT "_posts_v_version_key_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_faqs" ADD CONSTRAINT "_posts_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_tags" ADD CONSTRAINT "_posts_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_topics" ADD CONSTRAINT "blog_topics_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_properties_fk" FOREIGN KEY ("properties_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_topics_fk" FOREIGN KEY ("blog_topics_id") REFERENCES "public"."blog_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "properties_highlights_order_idx" ON "properties_highlights" USING btree ("_order");
  CREATE INDEX "properties_highlights_parent_id_idx" ON "properties_highlights" USING btree ("_parent_id");
  CREATE INDEX "properties_amenities_order_idx" ON "properties_amenities" USING btree ("_order");
  CREATE INDEX "properties_amenities_parent_id_idx" ON "properties_amenities" USING btree ("_parent_id");
  CREATE INDEX "properties_specifications_order_idx" ON "properties_specifications" USING btree ("_order");
  CREATE INDEX "properties_specifications_parent_id_idx" ON "properties_specifications" USING btree ("_parent_id");
  CREATE INDEX "properties_gallery_order_idx" ON "properties_gallery" USING btree ("_order");
  CREATE INDEX "properties_gallery_parent_id_idx" ON "properties_gallery" USING btree ("_parent_id");
  CREATE INDEX "properties_gallery_image_idx" ON "properties_gallery" USING btree ("image_id");
  CREATE INDEX "properties_floor_plans_order_idx" ON "properties_floor_plans" USING btree ("_order");
  CREATE INDEX "properties_floor_plans_parent_id_idx" ON "properties_floor_plans" USING btree ("_parent_id");
  CREATE INDEX "properties_floor_plans_file_idx" ON "properties_floor_plans" USING btree ("file_id");
  CREATE INDEX "properties_hero_image_idx" ON "properties" USING btree ("hero_image_id");
  CREATE INDEX "properties_video_file_idx" ON "properties" USING btree ("video_file_id");
  CREATE INDEX "properties_seo_seo_og_image_idx" ON "properties" USING btree ("seo_og_image_id");
  CREATE UNIQUE INDEX "properties_slug_idx" ON "properties" USING btree ("slug");
  CREATE INDEX "properties_updated_at_idx" ON "properties" USING btree ("updated_at");
  CREATE INDEX "properties_created_at_idx" ON "properties" USING btree ("created_at");
  CREATE INDEX "properties__status_idx" ON "properties" USING btree ("_status");
  CREATE INDEX "_properties_v_version_highlights_order_idx" ON "_properties_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_properties_v_version_highlights_parent_id_idx" ON "_properties_v_version_highlights" USING btree ("_parent_id");
  CREATE INDEX "_properties_v_version_amenities_order_idx" ON "_properties_v_version_amenities" USING btree ("_order");
  CREATE INDEX "_properties_v_version_amenities_parent_id_idx" ON "_properties_v_version_amenities" USING btree ("_parent_id");
  CREATE INDEX "_properties_v_version_specifications_order_idx" ON "_properties_v_version_specifications" USING btree ("_order");
  CREATE INDEX "_properties_v_version_specifications_parent_id_idx" ON "_properties_v_version_specifications" USING btree ("_parent_id");
  CREATE INDEX "_properties_v_version_gallery_order_idx" ON "_properties_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_properties_v_version_gallery_parent_id_idx" ON "_properties_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_properties_v_version_gallery_image_idx" ON "_properties_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_properties_v_version_floor_plans_order_idx" ON "_properties_v_version_floor_plans" USING btree ("_order");
  CREATE INDEX "_properties_v_version_floor_plans_parent_id_idx" ON "_properties_v_version_floor_plans" USING btree ("_parent_id");
  CREATE INDEX "_properties_v_version_floor_plans_file_idx" ON "_properties_v_version_floor_plans" USING btree ("file_id");
  CREATE INDEX "_properties_v_parent_idx" ON "_properties_v" USING btree ("parent_id");
  CREATE INDEX "_properties_v_version_version_hero_image_idx" ON "_properties_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_properties_v_version_version_video_file_idx" ON "_properties_v" USING btree ("version_video_file_id");
  CREATE INDEX "_properties_v_version_seo_version_seo_og_image_idx" ON "_properties_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_properties_v_version_version_slug_idx" ON "_properties_v" USING btree ("version_slug");
  CREATE INDEX "_properties_v_version_version_updated_at_idx" ON "_properties_v" USING btree ("version_updated_at");
  CREATE INDEX "_properties_v_version_version_created_at_idx" ON "_properties_v" USING btree ("version_created_at");
  CREATE INDEX "_properties_v_version_version__status_idx" ON "_properties_v" USING btree ("version__status");
  CREATE INDEX "_properties_v_created_at_idx" ON "_properties_v" USING btree ("created_at");
  CREATE INDEX "_properties_v_updated_at_idx" ON "_properties_v" USING btree ("updated_at");
  CREATE INDEX "_properties_v_latest_idx" ON "_properties_v" USING btree ("latest");
  CREATE INDEX "_properties_v_autosave_idx" ON "_properties_v" USING btree ("autosave");
  CREATE INDEX "posts_key_takeaways_order_idx" ON "posts_key_takeaways" USING btree ("_order");
  CREATE INDEX "posts_key_takeaways_parent_id_idx" ON "posts_key_takeaways" USING btree ("_parent_id");
  CREATE INDEX "posts_faqs_order_idx" ON "posts_faqs" USING btree ("_order");
  CREATE INDEX "posts_faqs_parent_id_idx" ON "posts_faqs" USING btree ("_parent_id");
  CREATE INDEX "posts_tags_order_idx" ON "posts_tags" USING btree ("_order");
  CREATE INDEX "posts_tags_parent_id_idx" ON "posts_tags" USING btree ("_parent_id");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "posts_featured_image_idx" ON "posts" USING btree ("featured_image_id");
  CREATE INDEX "posts_seo_seo_og_image_idx" ON "posts" USING btree ("seo_og_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "_posts_v_version_key_takeaways_order_idx" ON "_posts_v_version_key_takeaways" USING btree ("_order");
  CREATE INDEX "_posts_v_version_key_takeaways_parent_id_idx" ON "_posts_v_version_key_takeaways" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_faqs_order_idx" ON "_posts_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_posts_v_version_faqs_parent_id_idx" ON "_posts_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_tags_order_idx" ON "_posts_v_version_tags" USING btree ("_order");
  CREATE INDEX "_posts_v_version_tags_parent_id_idx" ON "_posts_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_version_featured_image_idx" ON "_posts_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_posts_v_version_seo_version_seo_og_image_idx" ON "_posts_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "blog_topics_post_idx" ON "blog_topics" USING btree ("post_id");
  CREATE INDEX "blog_topics_updated_at_idx" ON "blog_topics" USING btree ("updated_at");
  CREATE INDEX "blog_topics_created_at_idx" ON "blog_topics" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "enquiries_property_idx" ON "enquiries" USING btree ("property_id");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_properties_id_idx" ON "payload_locked_documents_rels" USING btree ("properties_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_blog_topics_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_topics_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "properties_highlights" CASCADE;
  DROP TABLE "properties_amenities" CASCADE;
  DROP TABLE "properties_specifications" CASCADE;
  DROP TABLE "properties_gallery" CASCADE;
  DROP TABLE "properties_floor_plans" CASCADE;
  DROP TABLE "properties" CASCADE;
  DROP TABLE "_properties_v_version_highlights" CASCADE;
  DROP TABLE "_properties_v_version_amenities" CASCADE;
  DROP TABLE "_properties_v_version_specifications" CASCADE;
  DROP TABLE "_properties_v_version_gallery" CASCADE;
  DROP TABLE "_properties_v_version_floor_plans" CASCADE;
  DROP TABLE "_properties_v" CASCADE;
  DROP TABLE "posts_key_takeaways" CASCADE;
  DROP TABLE "posts_faqs" CASCADE;
  DROP TABLE "posts_tags" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "_posts_v_version_key_takeaways" CASCADE;
  DROP TABLE "_posts_v_version_faqs" CASCADE;
  DROP TABLE "_posts_v_version_tags" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "blog_topics" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_properties_property_type";
  DROP TYPE "public"."enum_properties_listing_type";
  DROP TYPE "public"."enum_properties_availability";
  DROP TYPE "public"."enum_properties_status";
  DROP TYPE "public"."enum__properties_v_version_property_type";
  DROP TYPE "public"."enum__properties_v_version_listing_type";
  DROP TYPE "public"."enum__properties_v_version_availability";
  DROP TYPE "public"."enum__properties_v_version_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_blog_topics_status";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_site_settings_social_links_platform";`)
}
