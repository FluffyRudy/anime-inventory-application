const { Router } = require("express");
const inventoryController = require("../controllers/inventoryController.cjs");

const inventoryRouter = Router();

inventoryRouter.get("/", inventoryController.ListAnimeSeriesGet);
inventoryRouter.get("/create", inventoryController.addAnimeInfoGet);
inventoryRouter.post("/create", inventoryController.addAnimeInfoPost);

module.exports = { inventoryRouter };
