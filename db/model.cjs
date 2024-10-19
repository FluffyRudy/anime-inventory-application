const TABLES = {
  genre: "genre", //consist all genre ( pre defined )
  animeSeries: "anime_series", // contains anime series that user wishlist, and for more in future
  animeGenre: "anime_genre", // many to many relationship between anime_series and anime genre
  animeCollection: "anime_collections", //contains collection info and foreign key and cascade on delete and update
};
const DTYPES = { animeStatus: "anime_status" };

module.exports = { tables: TABLES, dtypes: DTYPES };
