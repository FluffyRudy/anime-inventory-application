const { tables, dtypes } = require("./model.cjs");

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

const genreValueExistQuery = `
SELECT 1 AS VALUE FROM genre WHERE name = $1;
`;

const insertGenre = `
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
    (name, release_date, completed_date, status, creator, rating)
    VALUES ($1, $2, $3, $4, $5, $6);
`;

/**
 * SQL query string to insert a new record into the anime_genre table.
 *
 * This query inserts the following fields:
 * - anime_id: The ID of the anime series (integer, foreign key referencing anime_series).
 * - genre_id: The ID of the genre (integer, foreign key referencing genre).
 *
 * Placeholders:
 * - $1: anime_id
 * - $2: genre_id
 *
 * @constant {string}
 */
const insertAnimeGenreQuery = `
INSERT INTO anime_genre 
    (anime_id, genre_id)
    VALUES ($1, $2);
`;

const selectAllAnimeSeriesQuery = `
SELECT * FROM anime_series;
`;

module.exports = {
  tableExistsQuery,
  dtypeExistsQuery,
  insertAnimeSeriesQuery,
  insertAnimeGenreQuery,
  selectAllAnimeSeriesQuery,
};
