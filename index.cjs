const express = require("express");
const { resolve, join } = require("path");
const { inventoryRouter } = require("./routers/inventory.cjs");
const { dbClient } = require("./db/dbClient.cjs");

require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.static(join(__dirname, "public")));
app.set("views", resolve(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", inventoryRouter);

function gracefulShutdown() {
  console.log("Shutting down server...");
  dbClient.endConnection().then(() => {
    console.log("Closed DB connections.");
    process.exit(0);
  });
}

async function waitForDatabaseAndStartServer() {
  const startTime = Date.now();
  const DB_TIMEOUT_SECONDS = 10;

  while (!dbClient.canQuery) {
    console.log("Waiting for DB to be ready...");
    console.log(dbClient.errorLogs);
    const currentTime = Date.now();
    if ((currentTime - startTime) / 1000.0 > DB_TIMEOUT_SECONDS) {
      console.log("Failed to connect database so quitting");
      await dbClient.endConnection();
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  app.listen(PORT, () => {
    console.debug(`Listening at: http://localhost:${PORT}`);
  });
}

process.on("SIGTERM", () => {
  console.log("Receive Termination signal. Cleaning up");
  gracefulShutdown();
});

process.on("SIGINT", () => {
  console.log("Receive intruption signal. Cleaning up");
  gracefulShutdown();
});

waitForDatabaseAndStartServer();
