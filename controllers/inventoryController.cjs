const multer = require("multer");
const { dbClient } = require("../db/dbClient.cjs");
const { validationResult } = require("express-validator");
const { isCompletedAfterRelease } = require("../utils/dateUtil.cjs");
const { cleanObject } = require("../utils/cleanObject.cjs");
const { uploadImage, uploadImageUrl } = require("../services/imageHost.cjs");
const { animeSearchService, limit } = require("../services/animeSearch.cjs");
const { ratings, defaultFilters } = require("../constants/animeFilters.cjs");
const validator = require("./validator.cjs");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const renderAnimeCollectionsList = (res, animeSeriesObj) => {
  res.render("listAnimeCollection", {
    animeSeries: animeSeriesObj.rows,
    nextPage: animeSeriesObj.nextPage,
    currentPage: animeSeriesObj.currentPage,
    prevPage: animeSeriesObj.prevPage,
  });
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.listRandomAnimeDataGet = async (req, res) => {
  try {
    if (!req.session.animeUrl) {
      const { url, pagination, data } =
        await animeSearchService.searchRandomAnime();
      req.session.animeUrl = new URL(url);
      const nextPage = pagination.has_next_page
        ? pagination.current_page + 1
        : pagination.current_page;
      res.render("homepage", {
        animeData: data,
        next: `/${nextPage}`,
        prev: `/${Math.max(1, pagination.current_page - 1)}`,
        hasPagination: true,
      });
    } else {
      const pageParam = req.params.page;
      const animeUrl = new URL(req.session.animeUrl);
      animeUrl.searchParams.set("limit", limit);
      animeUrl.searchParams.set("page", pageParam || 1);

      const { url, pagination, data } =
        await animeSearchService.searchAnimeByUrl(animeUrl.toString());
      const nextPage = pagination.has_next_page
        ? pagination.current_page + 1
        : pagination.current_page;
      res.render("homepage", {
        animeData: data,
        next: nextPage,
        prev: `/${Math.max(1, pagination.current_page - 1)}`,
        hasPagination: true,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.send("<h1 style='color: #f00'>Server error occuerd</h1>");
  }
};

exports.ListAnimeCollectionsGet = async (req, res) => {
  const animeSeriesObj = await dbClient.getAllAnimeSeriesDate(limit, 0, 1);
  renderAnimeCollectionsList(res, animeSeriesObj);
};

exports.ListAnimeCollectionByPagination = async (req, res) => {
  const page = Math.max(Number(req.params.page) || 1, 1);
  const animeSeriesObj = await dbClient.getAllAnimeSeriesDate(
    limit,
    (page - 1) * limit,
    page
  );
  renderAnimeCollectionsList(res, animeSeriesObj);
};

exports.UpdateAnimeCollectionGet = async (req, res) => {
  const genres = await dbClient.getAllGenre();
  const animeItem = await dbClient.getAnimeItemById(req.params.id);
  const checkedGenres = animeItem.genre.split(/,\s*/) || [];

  delete animeItem["genre"];
  res.render("addAnime", {
    genres,
    ratings,
    values: { checkedGenres, ...animeItem },
    route: `/collection/update/${req.param.id}`,
    submitLabel: "Update",
    isUserUpdatable: true,
  });
};

exports.UpdateAnimeCollectionPost = [
  upload.single("image"),
  validator.animeInfoValidator,
  async (req, res) => {
    if (req.body.secret_password !== process.env.SECRET_PASSWORD) {
      res.redirect("/");
      return;
    }

    const validatedResult = validationResult(req);
    if (!validatedResult.isEmpty()) {
      const genres = await dbClient.getAllGenre();
      res.render("addAnime", {
        errors: validatedResult.array(),
        genres: genres,
        ratings: ratings,
        values: req.body,
      });
    } else {
      const data = req.body;

      if (req.body.image_url) {
        const uploadRes = await uploadImageUrl(req.body.image_url);
        data.image_url = uploadRes.data.image.url;
      } else if (req.file) {
        const uploadRes = await uploadImage(req.file);
        if (uploadRes.success) data.image_url = uploadRes.data.image.url;
        else data.image_url = "";
      } else {
        console.error("no image found");
      }

      data.genre = !data.genre
        ? []
        : Array.isArray(data.genre)
        ? data.genre
        : [data.genre];

      data.episodes = Number(data.episodes);
      data.duration = data.duration;
      data.rating = Number(data.rating);
      data.scored_by = Number(data.scored_by);
      data.rank = Number(data.rank);
      data.popularity = Number(data.popularity);
      data.favorites = Number(data.favorites);
      data.synopsis = data.synopsis;

      data.release_date = data.release_date
        ? new Date(data.release_date).toISOString()
        : null;
      data.completed_date = data.completed_date
        ? new Date(data.completed_date).toISOString()
        : null;

      if (!data.release_date) {
        data.release_date.toISOString();
      }

      const isCompleted = isCompletedAfterRelease(
        data.completed_date,
        data.release_date
      );
      if (isCompleted === true) {
        data.status = "completed";
      } else if (isCompleted === false && data.completed_date) {
        data.status = "ongoing";
      } else {
        data.status = "unknown";
      }

      await dbClient.updateAnimeItem(req.params.id, data);
      res.redirect("/collection");
    }
  },
];

exports.addAnimeInfoGet = async (req, res) => {
  const genres = await dbClient.getAllGenre();

  res.render("addAnime", {
    genres,
    ratings,
    values: {},
    route: "/create",
    submitLabel: "Create",
  });
};

exports.addAnimeInfoPost = [
  upload.single("image"),
  validator.animeInfoValidator,
  async (req, res) => {
    const validatedResult = validationResult(req);
    if (!validatedResult.isEmpty()) {
      const genres = await dbClient.getAllGenre();
      res.render("addAnime", {
        errors: validatedResult.array(),
        genres: genres,
        ratings: ratings,
        values: req.body,
      });
    } else {
      const data = req.body;

      if (req.body.image_url) {
        const uploadRes = await uploadImageUrl(req.body.image_url);
        data.image_url = uploadRes.data.image.url;
      } else if (req.file) {
        const uploadRes = await uploadImage(req.file);
        if (uploadRes.success) data.image_url = uploadRes.data.image.url;
        else data.image_url = "";
      } else {
        console.error("no image found");
      }

      data.genre = !data.genre
        ? []
        : Array.isArray(data.genre)
        ? data.genre
        : [data.genre];

      data.episodes = Number(data.episodes);
      data.duration = data.duration;
      data.rating = Number(data.rating);
      data.scored_by = Number(data.scored_by);
      data.rank = Number(data.rank);
      data.popularity = Number(data.popularity);
      data.favorites = Number(data.favorites);
      data.synopsis = data.synopsis;

      data.release_date = data.release_date
        ? new Date(data.release_date).toISOString()
        : null;
      data.completed_date = data.completed_date
        ? new Date(data.completed_date).toISOString()
        : null;

      if (!data.release_date) {
        data.release_date.toISOString();
      }

      const isCompleted = isCompletedAfterRelease(
        data.completed_date,
        data.release_date
      );
      if (isCompleted === true) {
        data.status = "completed";
      } else if (isCompleted === false && data.completed_date) {
        data.status = "ongoing";
      } else {
        data.status = "unknown";
      }

      await dbClient.addAnimeData(data);
      res.redirect("/");
    }
  },
];

exports.getAnimeGenre = async (req, res) => {
  const avilableGenres = await dbClient.getAllGenre();
  res.json(avilableGenres);
};

exports.getAnimeRatings = async (req, res) => {
  const getRatings = () =>
    new Promise((resolve) => {
      resolve(ratings);
    });
  const response = await getRatings();
  res.json(response);
};

exports.addAnimeGenreGet = async (req, res) => {
  const avilableGenres = await dbClient.getAllGenre();
  res.render("addGenre", { avilableGenres, ratings, defaultFilters });
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

exports.searchAnimeGet = async (req, res) => {
  const genres = await dbClient.getAllGenre();
  res.render("searchAnime", { ratings, genres });
};

exports.searchAnimePost = [
  validator.searchQueryValidator,
  async (req, res) => {
    const validatedResult = validationResult(req);
    const genres = await dbClient.getAllGenre();
    if (!validatedResult.isEmpty()) {
      res.render("searchAnime", {
        ratings,
        genres,
        errors: validatedResult.array(),
      });
      return;
    }
    const reqBody = cleanObject(req.body);
    const { search, ...filters } = reqBody;
    const data = await animeSearchService.searchAnimeByName(search, filters);
    res.render("searchAnime", {
      ratings,
      genres,
      animeData: data.data,
      pagination: data.pagination,
    });
  },
];

exports.AddCollectionPost = [
  upload.single("image"),
  validator.animeInfoValidator,
  async (req, res) => {
    req.body.genre = req.body.genre.split(/,\s* /);
    const validatedResult = validationResult(req);
    if (!validatedResult.isEmpty()) {
      res.json(validatedResult.array());
      return;
    }
    try {
      if (req.body.image_url) {
        const uploadRes = await uploadImageUrl(req.body.image_url);
        req.body.image_url = uploadRes.data.image.url;
      } else {
        console.error("no image found");
      }
      await dbClient.addAnimeData(req.body, true);
      res.json({ success: true });
    } catch (error) {
      res.json({ success: false });
    }
  },
];
