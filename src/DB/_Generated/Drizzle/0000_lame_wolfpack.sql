-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"spotify_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_spotify_id_key" UNIQUE("spotify_id"),
	CONSTRAINT "users_username_key" UNIQUE("username"),
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artist_music_genres" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"artist_id" integer NOT NULL,
	"genre_id" integer NOT NULL,
	CONSTRAINT "artist_music_genres_artist_id_genre_id_key" UNIQUE("artist_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(8) NOT NULL,
	CONSTRAINT "countries_code_key" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"geoapify_place_id" varchar(255) NOT NULL,
	"name" varchar(255),
	"country_id" integer NOT NULL,
	"region" varchar(255),
	"state" varchar(255),
	"county" varchar(255),
	"city" varchar(255),
	"municipality" varchar(255),
	"postcode" varchar(255),
	"suburb" varchar(255),
	"lon" numeric(15, 10) NOT NULL,
	"lat" numeric(15, 10) NOT NULL,
	"state_code" varchar(8),
	"state_cog" varchar(8),
	"formatted" varchar(255) NOT NULL,
	"address_line1" varchar(255),
	"address_line2" varchar(255),
	"department_cog" varchar(255),
	"category" varchar(255) NOT NULL,
	"plus_code" varchar(255),
	"plus_code_short" varchar(255),
	"result_type" varchar(255) NOT NULL,
	CONSTRAINT "locations_geoapify_place_id_key" UNIQUE("geoapify_place_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "music_genres" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "music_genres_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "enhanced_user_favourite_artists" (
	"id" integer,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"user_id" integer,
	"artist_id" integer,
	"is_following" boolean,
	"spotify_artist_id" varchar(255),
	"artist_name" varchar(255),
	"spotify_user_id" varchar(255),
	"user_name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artists" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"spotify_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "artists_spotify_id_key" UNIQUE("spotify_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_favourite_artists" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"user_id" integer NOT NULL,
	"artist_id" integer NOT NULL,
	"is_following" boolean NOT NULL,
	CONSTRAINT "user_favourite_artists_user_id_artist_id_key" UNIQUE("user_id","artist_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"user_id" integer NOT NULL,
	"location_id" integer NOT NULL,
	CONSTRAINT "user_locations_user_id_location_id_key" UNIQUE("user_id","location_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"published_at" timestamp with time zone,
	"user_id" integer,
	"slug" varchar(255),
	"title" varchar(255),
	"hero_image_path" varchar(255),
	"content" text NOT NULL,
	CONSTRAINT "posts_user_id_slug_key" UNIQUE("user_id","slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post_artist_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"post_id" integer NOT NULL,
	"artist_id" integer NOT NULL,
	CONSTRAINT "post_artist_tags_post_id_artist_id_key" UNIQUE("post_id","artist_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_representing_artists" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"user_id" integer NOT NULL,
	"artist_id" integer NOT NULL,
	CONSTRAINT "user_representing_artists_user_id_artist_id_key" UNIQUE("user_id","artist_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "artist_music_genres" ADD CONSTRAINT "artist_music_genres_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "artist_music_genres" ADD CONSTRAINT "artist_music_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "music_genres"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "locations" ADD CONSTRAINT "locations_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_favourite_artists" ADD CONSTRAINT "user_favourite_artists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_favourite_artists" ADD CONSTRAINT "user_favourite_artists_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_artist_tags" ADD CONSTRAINT "post_artist_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_artist_tags" ADD CONSTRAINT "post_artist_tags_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_representing_artists" ADD CONSTRAINT "user_representing_artists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_representing_artists" ADD CONSTRAINT "user_representing_artists_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/