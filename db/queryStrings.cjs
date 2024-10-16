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
 * - completed_date: The date the anime series was completed (date, nullable).
 * - status: The current status of the anime series (string).
 * - creator: The creator of the anime series (string).
 * - rating: The rating of the anime series (numeric, between 0 and 10).
 *
 * Placeholders:
 * - $1: name
 * - $2: release_date
 * - $3: completed_date
 * - $4: status
 * - $5: creator
 * - $6: rating
 *
 * @constant {string}
 */
const insertAnimeSeriesQuery = `
INSERT INTO anime_series 
    (name, release_date, completed_date, status, creator, rating, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
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
