const { Router } = require("express");
const inventoryController = require("../controllers/inventoryController.cjs");

const inventoryRouter = Router();

inventoryRouter.get("/", inventoryController.ListAnimeSeriesGet);
inventoryRouter.get("/page/:page", inventoryController.ListAnimeByPagination);
inventoryRouter.get("/create", inventoryController.addAnimeInfoGet);
inventoryRouter.post("/create", inventoryController.addAnimeInfoPost);
inventoryRouter.get("/search", inventoryController.searchAnimeGet);
inventoryRouter.post("/search", inventoryController.searchAnimePost);
inventoryRouter.get("/add-genre", inventoryController.addAnimeGenreGet);
inventoryRouter.post("/add-genre", inventoryController.addAnimeGenrePost);
inventoryRouter.get("/get-genres", inventoryController.getAnimeGenre);

module.exports = { inventoryRouter };
