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
    const { pagination, data } = response.data;
    return {
      pagination,
      data: data.map((animeInfo) => getRequiredInfo(animeInfo)),
    };
  }

  errorPromise(msg) {
    return new Promise((resolve) => {
      resolve();
      console.error(msg);
      return msg;
    });
  }
}

function getRequiredInfo(animeData) {
  if (!animeData) return {};
  const name = animeData.title_english;
  const release_date = animeData.aired.from;
  const completed_date = animeData.aired.to;
  const status = animeData.status.airing
    ? "completed"
    : animeData.status.airing === false
    ? "ongoing"
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
  const synopsis = animeData.synopsis;
  const type = animeData.type;

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
  };
}

module.exports = { animeSearchService: new AnimeSearchService() };
