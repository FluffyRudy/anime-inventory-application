const { dbClient } = require("../db/dbClient.cjs");
const { validationResult, param } = require("express-validator");
const { compareDate } = require("../utils/dateUtil.cjs");
const validator = require("./validator.cjs");

const limit = 4;

const renderAnimeList = (res, animeSeriesObj) => {
  res.render("listAnime", {
    animeSeries: animeSeriesObj.rows,
    nextPage: animeSeriesObj.nextPage,
    currentPage: animeSeriesObj.currentPage,
    prevPage: animeSeriesObj.prevPage,
  });
};

exports.ListAnimeSeriesGet = async (req, res) => {
  const animeSeriesObj = await dbClient.getAllAnimeSeriesDate(limit, 0, 1);
  renderAnimeList(res, animeSeriesObj);
};

exports.ListAnimeByPagination = async (req, res) => {
  const page = Math.max(Number(req.params.page) || 1, 1);
  const animeSeriesObj = await dbClient.getAllAnimeSeriesDate(
    limit,
    (page - 1) * limit,
    page
  );
  console.log(animeSeriesObj);
  renderAnimeList(res, animeSeriesObj);
};

exports.addAnimeInfoGet = async (req, res) => {
  const genres = await dbClient.getAllGenre();

  res.render("addAnime", { genres, values: {} });
};

exports.addAnimeInfoPost = [
  validator.animeInfoValidator,
  async (req, res) => {
    const validatedResult = validationResult(req);
    if (!validatedResult.isEmpty()) {
      const genres = await dbClient.getAllGenre();
      res.render("addAnime", {
        errors: validatedResult.array(),
        genres: genres,
        values: req.body,
      });
    } else {
      const data = req.body;
      data.genre = !data.genre
        ? []
        : Array.isArray(data.genre)
        ? data.genre
        : [data.genre];
      data.release_date ||= null;
      data.completed_date ||= null;
      data.rating = Number(data.rating);

      const isCompleted = compareDate(data.completed_date, data.release_date);
      if (isCompleted === true) {
        data.status = "completed";
      } else if (isCompleted === false) {
        data.status = "ongoing";
      } else {
        data.status = "unknown";
      }
      await dbClient.addAnimeData(data);
      res.redirect("/");
    }
  },
];

exports.addAnimeGenreGet = async (req, res) => {
  const avilableGenres = await dbClient.getAllGenre();
  res.render("addGenre", { avilableGenres });
};

exports.addAnimeGenrePost = [
  validator.genreInfoValidator,
  async (req, res) => {
    const validatedResult = validationResult(req);
    const avilableGenres = await dbClient.getAllGenre();
    if (!validatedResult.isEmpty()) {
      res.render("addGenre", {
        avilableGenres,
        errors: validatedResult.array(),
        value: req.body.genre,
      });
    } else {
      const genre = req.body.genre.toLowerCase();
      if (!avilableGenres.includes(genre)) {
        await dbClient.addGenre(genre);
        res.redirect("/add-genre");
      } else {
        const genreExistError = {
          msg: "Genre already exists.",
          param: "genre",
          location: "body",
        };
        validatedResult.errors.push(genreExistError);
        res.render("addGenre", {
          avilableGenres,
          errors: validatedResult.array(),
          value: req.body.genre,
        });
      }
    }
  },
];
