const express = require("express");
const { resolve } = require("path");

require("dotenv").config();

const app = express();

app.set("views", resolve(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
