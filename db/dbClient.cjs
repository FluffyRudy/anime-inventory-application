const { Pool } = require("pg");
const query = require("./queryStrings.cjs");
const model = require("./model.cjs");

require("dotenv").config();

class DBClient {
  constructor() {
    this.pool = this.initPool();
    this.canQuery = false;
    this.errorLogs = [];
    this.initListening();
  }

  initPool() {
    return new Pool({
      connectionString: process.env.CONNECTION_STRING,
    });
  }

  async initListening() {
    try {
      const res = await this.getModelStatus();
      this.canQuery = Object.values(res)
        .map((models) => models.every((modelInfo) => modelInfo.exists))
        .every((value) => value);
      if (!this.canQuery) {
        const logValues = Object.values(res);
        for (const logs of logValues) {
          for (const log of logs) {
            if (!log.exists) this.errorLogs.push(log);
          }
        }
      }
    } catch (err) {
      console.error("Error during DB initialization: ", err);
      this.canQuery = false;
    }
  }

  async getModelStatus() {
    const tableCheck = this.lookupNonExistingModel(
      Object.values(model.tables),
      query.tableExistsQuery
    );
    const dtypesCheck = this.lookupNonExistingModel(
      Object.values(model.dtypes),
      query.dtypeExistsQuery
    );
    const [tableResult, dtypeResult] = await Promise.all([
      tableCheck,
      dtypesCheck,
    ]);
    return { tableResult, dtypeResult };
  }

  async lookupNonExistingModel(dataModel, queryString) {
    const modelCheckResult = await Promise.all(
      dataModel.map(async (model) => {
        try {
          const response = (await this.pool.query(queryString, [model]))
            .rows[0];
          return response.exists
            ? { model, exists: true }
            : { model, exists: false };
        } catch (error) {
          return { model, exists: false, error: error.message };
        }
      })
    );
    return modelCheckResult;
  }

  async getAllAnimeSeriesDate(limit, offset, page) {
    const res = await this.pool.query(query.selectAllAnimeSeriesDataQuery, [
      limit,
      offset,
    ]);

    return {
      rows: res.rows || [],
      rowCount: res.rowCount,
      nextPage: res.rowCount === limit ? page + 1 : page,
      currentPage: page,
      prevPage: Math.max(page - 1, 1),
    };
  }

  /**
   * Adds a new anime series to the database.
   *
   * This method takes an object containing anime series data and inserts it into the appropriate
   * database table. The data object should include properties such as name, genre, release_date,
   * status, completed_date, creator, and rating. The method also supports adding the anime to a
   * collection if specified. It also handles the linking of genres to the anime.
   *
   * @async
   * @param {Object} data - The anime series data to be added.
   * @param {string} data.name - The name of the anime series.
   * @param {Array<string>} data.genre - An array of genres associated with the anime series.
   * @param {string} [data.release_date] - The release date of the anime series (optional).
   * @param {string} data.status - The current status of the anime series (e.g., ongoing, completed).
   * @param {string} [data.completed_date] - The completion date of the anime series (optional).
   * @param {string} data.creator - The creator of the anime series.
   * @param {string} data.rating - The rating of the anime series (e.g., out of 10).
   * @param {string} [data.image_url] - The URL of the anime's image (optional).
   * @param {number} [data.episodes] - The number of episodes in the anime (optional).
   * @param {string} [data.duration] - The duration of each episode (optional, default is "unknown").
   * @param {string} [data.age_rating] - The age rating of the anime (optional, default is "unknown").
   * @param {number} [data.scored_by] - Number of users who rated the anime (optional).
   * @param {number} [data.rank] - The rank of the anime (optional).
   * @param {number} [data.popularity] - The popularity score of the anime (optional).
   * @param {number} [data.favorites] - The number of users who favorited the anime (optional).
   * @param {string} [data.synopsis] - A short description of the anime (optional, default is "No synopsis available").
   * @param {string} [data.collectionName] - The name of the collection to which the anime should be added (optional).
   * @param {string} [data.collectionDescription] - The description of the collection (optional).
   * @param {boolean} [addToCollection=true] - A flag indicating whether to add the anime to a collection.
   * @returns {Promise<void>} A promise that resolves once the anime series has been added and optionally linked to a collection and genres.
   * @throws {Error} Throws an error if the insertion fails or if the provided data is invalid.
   */
  async addAnimeData(data, addToCollection = true) {
    const {
      name,
      release_date,
      completed_date,
      status,
      creator,
      rating,
      genre,
      image_url,
      episodes,
      duration,
      age_rating,
      scored_by,
      rank,
      popularity,
      favorites,
      synopsis,
      ...collectionInfo
    } = data;

    const values = [
      name,
      release_date,
      status || null,
      completed_date || null,
      creator || null,
      rating || null,
      image_url || null,
      episodes || null,
      duration || "unknown",
      age_rating || "unknown",
      scored_by || null,
      rank || null,
      popularity || null,
      favorites || null,
      synopsis || "No synopsis available",
    ];

    const queryStr = query.insertAnimeSeriesQuery;
    try {
      const animeSeriesInsertion = await this.pool.query(queryStr, values);
      const anime_id = animeSeriesInsertion.rows[0].id;
      if (addToCollection) {
        const { collectionName, collectionDescription } = collectionInfo;
        const isAddedToCollection = await this.insertAnimeToCollection(
          anime_id,
          collectionName,
          collectionDescription
        );
        if (!isAddedToCollection) {
          console.error(
            "Failed to add to collection check collection name and naime id"
          );
        }
      }
      const genreAndIds = (await this.pool.query(query.selectAllGenreQuery))
        .rows;
      const matchingIds = [];

      for (let g of genre) {
        for (let { name, id } of genreAndIds) {
          if (g.toLowerCase() === name) {
            matchingIds.push(`(${anime_id}, ${id})`);
          }
        }
      }

      const animeGenreInsert = await this.pool.query(`
        INSERT INTO anime_genre (anime_id, genre_id) VALUES ${matchingIds.join(
          ","
        )}  
      `);
    } catch (error) {
      console.error(error.message);
    }
  }

  /**
   *
   * @param {number} anime_id -The number representing anime_id
   * @param {string} name -Then name of collection
   * @param {string} description -The description of collection (Optional)
   * @returns {Promise<boolean>} -Return boolean value. True if collcetion is added otherwise false
   */
  async insertAnimeToCollection(anime_id, name, description) {
    if (!anime_id || !name) {
      return Promise.resolve(false); // Wrap return value in a resolved promise
    }
    const collectionDataInsertion = await this.pool.query(
      query.addToAnimeCollectionQuery,
      [anime_id, name, description || null]
    );

    return collectionDataInsertion.rowCount > 0;
  }

  /**
   * Executes a custom SQL query against the database.
   *
   * @async
   * @param {string} queryString - The SQL query string to be executed.
   * @param {...*} placeholders - The values to be used as placeholders in the query.
   * @returns {Promise<Object>} A promise that resolves to the response from the database.
   * @throws {Error} Throws an error if the query fails.
   */
  async query(queryString, ...placeholders) {
    if (placeholders.length > 0) {
      const response = await this.pool.query(queryString, placeholders);
      return response;
    } else {
      const response = await this.pool.query(queryString);
      return response;
    }
  }

  async addGenre(genre) {
    try {
      await this.pool.query(query.insertGenreQuery, [genre]);
    } catch (error) {
      console.error(error);
    }
  }

  async getAllGenre() {
    const genres = await this.pool.query(query.selectAllGenreQuery);
    return (
      genres?.rows
        ?.map((genre) => genre.name)
        .sort((a, b) => a.localeCompare(b)) || []
    );
  }

  async endConnection() {
    await this.pool.end();
    this.canQuery = false;
  }
}

module.exports = {
  dbClient: new DBClient(),
};
