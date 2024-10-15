const { Router } = require("express");
const inventoryController = require("../controllers/inventoryController.cjs");

const inventoryRouter = Router();

inventoryRouter.get("/", inventoryController.ListAnimeSeriesGet);
inventoryRouter.get("/create", inventoryController.addAnimeInfoGet);
inventoryRouter.post("/create", inventoryController.addAnimeInfoPost);
inventoryRouter.get("/add-genre", inventoryController.addAnimeGenreGet);
inventoryRouter.post("/add-genre", inventoryController.addAnimeGenrePost);
module.exports = { inventoryRouter };
