CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "address" (
	"id" varchar PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"street_address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"phone_number" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "user_type_unique" UNIQUE("user_id","type")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "colorVariant" (
	"id" varchar PRIMARY KEY NOT NULL,
	"shoe_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"dominant_color" varchar NOT NULL,
	"style_number" varchar,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "colorVariant_style_number_unique" UNIQUE("style_number")
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"shoe_id" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "variant_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"color_variant_id" varchar NOT NULL,
	"url" varchar NOT NULL,
	"alt_text" varchar
);
--> statement-breakpoint
CREATE TABLE "popular_searches" (
	"id" serial PRIMARY KEY NOT NULL,
	"query" text NOT NULL,
	"search_count" integer DEFAULT 1,
	CONSTRAINT "unique_query" UNIQUE("query")
);
--> statement-breakpoint
CREATE TABLE "search_clicks" (
	"click_id" text PRIMARY KEY DEFAULT 'gen_random_uuid()' NOT NULL,
	"query_id" uuid,
	"product_id" text NOT NULL,
	"click_timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "search_queries" (
	"query_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"query" text NOT NULL,
	"results_count" integer,
	"search_timestamp" timestamp DEFAULT now(),
	"ip_address" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "shoe_sizes" (
	"color_variant_id" varchar NOT NULL,
	"size_id" integer NOT NULL,
	"price" integer NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "shoe_size_pkey" PRIMARY KEY("color_variant_id","size_id")
);
--> statement-breakpoint
CREATE TABLE "shoes" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"description" text DEFAULT '
is simply dummy text of the printing and typesetting industry. 
Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, 
when an unknown printer took a galley of type and scrambled it to make a type 
specimen book. It has survived not only five centuries, 
but also the leap into electronic typesetting, remaining essentially unchanged. 
It was popularised in the 1960s with the release of Letraset sheets containing 
Lorem Ipsum passages, and more recently with desktop publishing software 
like Aldus PageMaker including versions of Lorem Ipsum.',
	"categoryId" integer NOT NULL,
	"base_price" integer,
	"base_image" varchar DEFAULT 'https://atlas-content-cdn.pixelsquid.com/stock-images/nike-shoe-box-open-shoebox-047RRRB-600.jpg' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "shoes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sizes" (
	"id" serial PRIMARY KEY NOT NULL,
	"size" numeric(3, 1) NOT NULL,
	CONSTRAINT "size_increment_check" CHECK (("sizes"."size" * 2) % 1 = 0)
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"dob" date,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"order_id" varchar NOT NULL,
	"color_variant_id" varchar NOT NULL,
	"size_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price" integer NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	CONSTRAINT "order_items_order_id_color_variant_id_size_id_pk" PRIMARY KEY("order_id","color_variant_id","size_id")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"total_amount" integer NOT NULL,
	"shipping_address_id" varchar NOT NULL,
	"payment_intent_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_payment_intent_id_unique" UNIQUE("payment_intent_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "colorVariant" ADD CONSTRAINT "colorVariant_shoe_id_shoes_id_fk" FOREIGN KEY ("shoe_id") REFERENCES "public"."shoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_shoe_id_shoes_id_fk" FOREIGN KEY ("shoe_id") REFERENCES "public"."shoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_images" ADD CONSTRAINT "variant_images_color_variant_id_colorVariant_id_fk" FOREIGN KEY ("color_variant_id") REFERENCES "public"."colorVariant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_clicks" ADD CONSTRAINT "search_clicks_query_id_search_queries_query_id_fk" FOREIGN KEY ("query_id") REFERENCES "public"."search_queries"("query_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_queries" ADD CONSTRAINT "search_queries_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shoe_sizes" ADD CONSTRAINT "shoe_sizes_color_variant_id_colorVariant_id_fk" FOREIGN KEY ("color_variant_id") REFERENCES "public"."colorVariant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shoe_sizes" ADD CONSTRAINT "shoe_sizes_size_id_sizes_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shoes" ADD CONSTRAINT "shoes_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_id_address_id_fk" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."address"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "style_number_index" ON "colorVariant" USING btree ("style_number");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_shoe_variant" ON "favorites" USING btree ("user_id","shoe_id");--> statement-breakpoint
CREATE INDEX "name_index" ON "shoes" USING btree ("name");