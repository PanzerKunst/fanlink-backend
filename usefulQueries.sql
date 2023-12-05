select * from users;

select * from music_genres order by name;

select * from artists;

select * from artist_music_genres;

select * from posts;

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

insert into users(spotify_id, name, username, email)
values('foo', 'Christophe Bram', 'panzerkunst', 'cbramdit@gmail.com');

insert into users(spotify_id, name, username, email)
values('bar', 'Christophe Bram', 'panzer', 'cbram@gmail.com');
