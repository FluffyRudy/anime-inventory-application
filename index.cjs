const express = require("express");
const { resolve } = require("path");
const { inventoryRouter } = require("./routers/inventory.cjs");

require("dotenv").config();

const app = express();
const PORT = 3000;

app.set("views", resolve(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/", inventoryRouter);

app.listen(PORT, () => {
  console.debug(`Listening at: http://localhost:${PORT}`);
});
