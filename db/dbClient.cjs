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
            if (!log.exists)
              this.errorLogs.push(log)
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

  async getAllAnimeSeries() {
    const res = await this.pool.query(query.selectAllAnimeSeriesQuery);
    return res;
  }
  /**
   * Adds a new anime series to the database.
   *
   * This method takes an object containing anime series data and inserts it into the appropriate
   * database table. The data object should include properties such as name, genre, release_date,
   * status, completed_date, creator, and rating. The method will handle the necessary SQL
   * insertion logic and ensure that the data is stored correctly.
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
   * @returns {Promise<Object>} A promise that resolves to the response from the database after
   *                            the insertion operation.
   * @throws {Error} Throws an error if the insertion fails or if the provided data is invalid.
   */
  async addAnimeData(data) {
    const {
      name,
      release_date,
      completed_date,
      status,
      creator,
      rating,
      genre,
    } = data;
    const values = [
      name,
      release_date,
      completed_date,
      status,
      creator,
      rating,
    ];
    try {
      const animeSeriesInsertion = await this.pool.query(
        query.insertAnimeSeriesQuery,
        values
      );
      const anime_id = animeSeriesInsertion.rows[0].id;
      const genreAndIds = (await this.pool.query(query.selectAllGenreQuery)).rows;
      const matchingIds = []
      
      for (let g of genre) {
        for (let {name, id} of genreAndIds) {
          if (g === name) {
            matchingIds.push(`(${anime_id}, ${id})`)
          }
        }
      }
      const animeGenreInsert = await this.pool.query(`
        INSERT INTO anime_genre (anime_id, genre_id) VALUES ${matchingIds.join(',')}  
      `)

    } catch (error) {
      console.error(error.message);
    }
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
}

module.exports = {
  dbClient: new DBClient(),
};
