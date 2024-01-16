select * from users;

select * from music_genres order by name;

select * from artists
order by name;

select * from artist_music_genres;

select * from posts;

select * from user_following_authors;

SELECT 
    p.id AS post_id,
    p.title,
    p.content,
    p.slug,
    a.name AS artist_name
FROM 
    public.posts p
LEFT JOIN 
    public.post_artist_tags pat ON p.id = pat.post_id
LEFT JOIN 
    public.artists a ON pat.artist_id = a.id;


SELECT 
  a.name AS artist_name, 
  mg.name AS genre_name
FROM 
  public.artists a
INNER JOIN 
  public.artist_music_genres amg ON a.id = amg.artist_id
INNER JOIN 
  public.music_genres mg ON amg.genre_id = mg.id
ORDER BY 
  mg.name, a.name;

select * from countries;

select * from locations;

select * from enhanced_user_favourite_artists;

delete from artist_music_genres;

delete from user_favourite_artists;

delete from artists;

delete from users;

delete from posts;

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
