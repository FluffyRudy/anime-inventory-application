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
    this.getModelStatus()
      .then((res) => {
        this.canQuery = Object.values(res)
          .map((models) => {
            return models.every((modelInfo) => modelInfo.exists);
          })
          .every((value) => value);
      })
      .catch((err) => {
        console.error(err);
        this.canQuery = false;
      });
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
}

module.exports = {
  dbClient: new DBClient(),
};
