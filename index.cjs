const express = require("express");
const session = require("express-session");
const favicon = require("serve-favicon");
const { resolve, join } = require("path");
const { inventoryRouter } = require("./routers/inventory.cjs");
const { dbClient } = require("./db/dbClient.cjs");

require("dotenv").config();

const app = express();
const PORT = 3000;

const faviconPath = join(__dirname, "public", "favicon.ico");
console.log(faviconPath);
app.use(favicon(faviconPath));
app.use(express.static(join(__dirname, "public")));
app.set("views", resolve(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_HASH,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/favicon.ico", (req, res) => res.status(204).end());
app.use("/", inventoryRouter);

app.listen(PORT, () => {
  console.debug(`Listening at: http://localhost:${PORT}`);
});
