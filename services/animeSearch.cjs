const axios = require("axios");
require("dotenv").config();

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
 * @property {('asc'|'desc')} [sortBy] - Sort the results in ascending or descending order.
 */

/**
 * Service for searching anime by name and filters.
 */
class AnimeSearchService {
  constructor() {
    /**
     * The api url for fetching data
     * @type {string}
     */
    this.api = process.env.ANIME_GET_SERVICES;
    this.limit = 10;
  }

  /**
   * Search anime by name with optional filters.
   *
   * @param {string} name - The name of the anime to search for.
   * @param {AnimeFilters} [filters] - Optional filters to refine the search results.
   * @returns {Array} An array of anime results.
   */
  async searchAnimeByName(name, filters = {}) {
    if (!this.api) return await this.errorPromise("API service not found");
    if (!name) return await this.errorPromise("No query provided");

    filters.limit = 10;
    const searchParam = new URLSearchParams({
      q: name,
      ...filters,
    }).toString();
    const url = new URL("anime", this.api);
    url.search = searchParam.toString();
    const response = await axios.get(url.toString());
    return response.data;
  }

  errorPromise(msg) {
    return new Promise((resolve) => {
      resolve();
      console.error(msg);
      return msg;
    });
  }
}

module.exports = { animeSearchService: new AnimeSearchService() };
