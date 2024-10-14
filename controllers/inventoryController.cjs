const { dbClient } = require("../db/dbClient.cjs");
const { validationResult } = require("express-validator");
const { selectAllGenreQuery } = require("../db/queryStrings.cjs");
const { compareDate } = require("../utils/dateUtil.cjs");
const validator = require("./validator.cjs");

exports.ListAnimeSeriesGet = async (req, res) => {
  const animeSeries = (await dbClient.getAllAnimeSeries()).rows;
  res.render("index", { animeSeries });
};

exports.addAnimeInfoGet = async (req, res) => {
  const genres = (await dbClient.query(selectAllGenreQuery)).rows.map(
    (genre) => genre.name
  );

  res.render("addAnime", { genres, values: {} });
};

exports.addAnimeInfoPost = [
  validator.animeInfoValidator,
  async (req, res) => {
    const validatedResult = validationResult(req);
    if (!validatedResult.isEmpty()) {
      const genres = (await dbClient.query(selectAllGenreQuery)).rows.map(
        (genre) => genre.name
      );
      res.render("addAnime", {
        errors: validatedResult.array(),
        genres: genres,
        values: req.body,
      });
    } else {
      const data = req.body;
      data.genre = !data.genre ? [] : (Array.isArray(data.genre) ? data.genre : [data.genre]);
      data.release_date ||= null;
      data.completed_date ||= null;
      data.rating = Number(data.rating);

      const isCompleted = compareDate(data.completed_date, data.release_date);
      if (isCompleted === true) data.status = "completed";
      else if (isCompleted === false) data.status = "ongoing";
      else data.status = "unknown";
      await dbClient.addAnimeData(data);
      res.redirect("/");
    }
  },
];
