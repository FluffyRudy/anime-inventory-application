const tableExistsQuery = `
SELECT EXISTS (
      SELECT 1                                     
      FROM pg_catalog.pg_tables 
      WHERE schemaname='public' 
      AND tablename=$1
);
`;

const dtypeExistsQuery = `
SELECT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = $1 AND typtype = 'e'
);
`;

const insertGenreQuery = `
INSERT INTO genre
  (name) VALUES ($1);
`;

/**
 * SQL query string to insert a new record into the anime_series table.
 *
 * This query inserts the following fields:
 * - name: The name of the anime series (string).
 * - release_date: The release date of the anime series (date).
 * - status: The current status of the anime series (string).
 * - completed_date: The date the anime series was completed (date, nullable).
 * - creator: The creator of the anime series (string).
 * - rating: The rating of the anime series (numeric, between 0 and 10).
 * - image_url: The URL of the anime series image (string).
 * - episodes: The number of episodes in the anime series (integer, nullable).
 * - duration: The duration of each episode (string, default "unknown").
 * - age_rating: The age rating of the anime series (string, default "unknown").
 * - scored_by: The number of users who rated the anime series (integer, nullable).
 * - rank: The rank of the anime series (integer, nullable).
 * - popularity: The popularity score of the anime series (integer, nullable).
 * - favorites: The number of users who favorited the anime series (integer, nullable).
 * - synopsis: A brief description of the anime series (string, default "No synopsis available").
 *
 * Placeholders:
 * - $1: name
 * - $2: release_date
 * - $3: status
 * - $4: completed_date
 * - $5: creator
 * - $6: rating
 * - $7: image_url
 * - $8: episodes
 * - $9: duration
 * - $10: age_rating
 * - $11: scored_by
 * - $12: rank
 * - $13: popularity
 * - $14: favorites
 * - $15: synopsis
 *
 * @constant {string}
 */

const insertAnimeSeriesQuery = `
INSERT INTO anime_series 
    (name, release_date, status, completed_date, creator, rating, image_url, 
     episodes, duration, age_rating, scored_by, rank, popularity, favorites, synopsis)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING id;
`;

const selectAllAnimeSeriesQuery = `
SELECT * FROM anime_series;
`;

const selectAllAnimeSeriesDataQuery = `
SELECT 
    anime_series.*, 
    STRING_AGG(genre.name, ', ') AS genres
FROM 
    anime_series
JOIN 
    anime_genre ON anime_series.id = anime_genre.anime_id
JOIN 
    genre ON genre.id = anime_genre.genre_id 
GROUP BY 
    anime_series.id
ORDER BY 
    anime_series.name
LIMIT $1 OFFSET $2;
`;

const selectAllGenreQuery = `
SELECT * FROM genre;
`;

module.exports = {
  tableExistsQuery,
  dtypeExistsQuery,
  insertAnimeSeriesQuery,
  selectAllAnimeSeriesQuery,
  selectAllGenreQuery,
  insertGenreQuery,
  selectAllAnimeSeriesDataQuery,
};
