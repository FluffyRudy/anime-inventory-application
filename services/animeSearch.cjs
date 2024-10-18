const axios = require("axios");

require("dotenv").config();

class AnimeSearchService {
  constructor() {
    this.api = process.env.ANIME_GET_SERVICES;
    this.limit = 10;
  }

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
