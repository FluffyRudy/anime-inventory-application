const axios = require("axios");
const { choice } = require("../utils/random.cjs");

require("dotenv").config();

/**
 * AnimeSearchService class for searching and retrieving anime information.
 */
class AnimeSearchService {
  /**
   * The default limit for the number of results to return.
   * @type {number}
   */
  static limit = 12;
  constructor() {
    /**
     * The API endpoint for retrieving anime data.
     * @type {string}
     */
    this.api = process.env.ANIME_GET_SERVICES;
  }
  /**
   * Searches for anime by name and applies optional filters.
   * @param {string} name - The name of the anime to search for.
   * @param {object} [filters] - Optional filters to apply to the search.
   * @returns {Promise<{ pagination: object, data: AnimeInfo[] }>} - An object containing the pagination information and the anime data.
   */
  async searchAnimeByName(name, filters = {}) {
    if (!this.api) return await this.errorPromise("API service not found");
    if (!name) return await this.errorPromise("No query provided");

    filters.limit = AnimeSearchService.limit;
    const searchParam = new URLSearchParams({
      q: name,
      ...filters,
    }).toString();
    const url = new URL("anime", this.api);
    url.search = searchParam.toString();
    const response = await axios.get(url.toString());
    const { pagination, data } = response.data;
    return {
      pagination,
      data: data.map((animeInfo) => getRequiredInfo(animeInfo)),
    };
  }

  /**
   * Searches for a random anime.
   * @returns {Promise<{ url: string, pagination: Pagination, data: AnimeInfo[] }>} - An object containing the URL of the anime, the pagination information, and the anime data.
   */
  async searchRandomAnime() {
    if (!process.env.ANIME_GET_SERVIC_MULTI) {
      return await this.errorPromise("API service not found");
    }
    const animeUrls = process.env.ANIME_GET_SERVIC_MULTI.replace(
      /[\s\[\]]/g,
      ""
    ).split(",");
    const animeUrl = choice(animeUrls);
    try {
      const url = new URL(animeUrl);
      url.searchParams.set("limit", AnimeSearchService.limit);
      const response = await axios.get(url.toString());
      const { pagination, data } = response.data;
      return {
        url: url.toString(),
        pagination,
        data: data.map((animeInfo) => getRequiredInfo(animeInfo)),
      };
    } catch (error) {
      console.error("Error fetching anime by URL", error);
      return this.errorPromise("Error fetching anime data");
    }
  }

  /**
   * Searches for anime by a given URL.
   * @param {string} animeUrl - The URL of the anime to search for.
   * @returns {Promise<{ url: string, pagination: Pagination, data: AnimeInfo[] }>}
   * - An object containing the URL of the anime,
   *   the pagination information, and the anime data.
   */
  async searchAnimeByUrl(animeUrl) {
    if (!animeUrl || typeof animeUrl !== "string")
      throw Error("Parameter is invalid");
    try {
      const url = new URL(animeUrl);
      url.searchParams.set("limit", AnimeSearchService.limit);
      const response = await axios.get(url.toString());
      const { pagination, data } = response.data;
      return {
        url: url.toString(),
        pagination,
        data: data.map((animeInfo) => getRequiredInfo(animeInfo)),
      };
    } catch (error) {
      console.error("Error fetching anime by URL", error);
      return this.errorPromise("Error fetching anime data");
    }
  }

  /**
   * Returns an error promise with a given message.
   * @param {string} msg - The error message.
   * @returns {Promise<{ pagination: null, message: string, data: [], success: false }>} - An error promise with the given message.
   */
  errorPromise(msg) {
    return new Promise((resolve) => {
      resolve();
      console.error(msg);
      return { pagination: null, message: msg, data: [], success: false };
    });
  }
}

/**
 * @typedef {Object} Pagination
 * @property {number} last_visible_page - The last visible page.
 * @property {boolean} has_next_page - Whether there is a next page.
 * @property {number} current_page - The current page.
 * @property {Object} items - Information about the items.
 * @property {number} items.count - The number of items.
 * @property {number} items.total - The total number of items.
 * @property {number} items.per_page - The number of items per page.
 */

/**
 * @typedef {Object} AnimeInfo
 * @property {string} name - The name of the anime.
 * @property {string} release_date - The release date of the anime.
 * @property {string} completed_date - The completed date of the anime.
 * @property {string} status - The status of the anime (ongoing, completed, or unknown).
 * @property {string} creator - The creator(s) of the anime.
 * @property {number} rating - The rating of the anime.
 * @property {string} image_url - The URL of the anime's image.
 * @property {number} episodes - The number of episodes in the anime.
 * @property {number} duration - The duration of each episode in the anime.
 * @property {string} age_rating - The age rating of the anime.
 * @property {number} scored_by - The number of users who have scored the anime.
 * @property {number} rank - The rank of the anime.
 * @property {number} popularity - The popularity of the anime.
 * @property {number} favorites - The number of favorites for the anime.
 * @property {string} synopsis - The synopsis of the anime.
 * @property {string} type - The type of the anime (e.g., TV, movie, OVA).
 * @property {string} genre - The genres of the anime.
 */

/**
 * Extracts the required information from the anime data.
 * @param {object} animeData - The raw anime data.
 * @returns {AnimeInfo} - An object containing the required anime information.
 */
function getRequiredInfo(animeData) {
  if (!animeData) return {};
  const name = animeData.title_english || animeData.title;
  const release_date = animeData.aired.from;
  const completed_date = animeData.aired.to;
  const status = animeData.airing
    ? "ongoing"
    : animeData.airing === false
    ? "completed"
    : "unknown";
  const creator = animeData.studios?.map((studio) => studio.name).join(", ");
  const rating = animeData.score;
  const image_url = animeData.images.jpg.image_url;
  const episodes = animeData.episodes;
  const duration = animeData.duration;
  const age_rating = animeData.rating;
  const scored_by = animeData.scored_by;
  const rank = animeData.rank;
  const popularity = animeData.popularity;
  const favorites = animeData.favorites;
  const synopsis = animeData.synopsis?.replace(/\[.*?\]/g, "");
  const type = animeData.type;
  const genres = animeData.genres.map((elem) => elem.name).join(", ") || "";

  return {
    name,
    release_date,
    completed_date,
    status,
    creator,
    rating,
    image_url,
    episodes,
    duration,
    age_rating,
    scored_by,
    rank,
    popularity,
    favorites,
    synopsis,
    type,
    genre: genres,
  };
}

module.exports = {
  animeSearchService: new AnimeSearchService(),
  limit: AnimeSearchService.limit,
};
