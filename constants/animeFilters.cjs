/**
 * @typedef {Object} AnimeFilters
 * @property {string} [genre] - A comma-separated list of genres.
 * @property {number} [min_score] - The minimum rating to filter by (0-10).
 * @property {number} [score] - The rating to filter by (0-10).
 * @property {number} [max_score] - The maximum rating to filter by (0-10).
 * @property {string} [start_date]   - The start date for the anime release in YYYY-MM-DD format.
 * @property {string} [end_date] - The end date for the anime release in YYYY-MM-DD format.
 * @property {number} [page] - The page to search from
 * @property {boolean} [sfw] - Filter out adult content
 * @property {('g'|'pg'|'pg13'|'r17'|'r'|'rx')} [rating] - The audience rating for filtering.
 * Ratings:
 * - **G**: All Ages
 * - **PG**: Children
 * - **PG-13**: Teens 13 or older
 * - **R**: 17+ (violence & profanity)
 * - **R+**: Mild Nudity
 * - **Rx**: Hentai
 * @property {('title'|'start_date'|'end_date'|'episodes'|'score'|'scored_by'|'rank'|'popularity'|'members'|'favorites')} [order_by] - Field to order the results by.
 * @property {('asc'|'desc')} [sort] - Sort the results in ascending or descending order.
 */

const ratings = [
  { label: "All Ages", value: "g" },
  { label: "Children", value: "pg" },
  { label: "Teens 13 or older", value: "pg13" },
  { label: "17+ (violence & profanity)", value: "r17" },
  { label: "Mild Nudity", value: "r+" },
  { label: "Hentai", value: "rx" },
];

/**
 * Default filter values.
 * @type {AnimeFilters}
 */
const defaultFilters = {
  genre: "",
  min_score: 0,
  max_score: 10,
  score: undefined,
  start_date: undefined,
  end_date: undefined,
  page: 1,
  sfw: true,
  rating: undefined,
  order_by: "popularity",
  sort: "desc",
};

module.exports = { ratings, defaultFilters };
