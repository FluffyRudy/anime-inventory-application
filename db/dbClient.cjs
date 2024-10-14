const { Pool } = require("pg");
const { tableExists, dtypeExists } = require("./queryStrings.cjs");

require("dotenv").config();

class DBClient {
  static tables = ["genre", "anime_series", "anime_genre"];
  static dtypes = ["anime_status"];

  constructor() {
    this.pool = this.initPool();
    this.canQuery = false;
    this.errorLogs = [];
    this.initialization()
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

  async initialization() {
    const tableCheck = this.lookupNonExistingModel(
      DBClient.tables,
      tableExists
    );
    const dtypesCheck = this.lookupNonExistingModel(
      DBClient.dtypes,
      dtypeExists
    );
    const [tableResult, dtypeResult] = await Promise.all([
      tableCheck,
      dtypesCheck,
    ]);
    return { tableResult, dtypeResult };
  }

  initPool() {
    return new Pool({
      connectionString: process.env.CONNECTION_STRING,
    });
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
}

const x = new DBClient();
