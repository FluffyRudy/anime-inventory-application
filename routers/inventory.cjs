const { Router } = require("express");
const inventoryController = require("../controllers/inventoryController.cjs");

const inventoryRouter = Router();

inventoryRouter.get("/", inventoryController.listRandomAnimeDataGet);

inventoryRouter.get("/create", inventoryController.addAnimeInfoGet);
inventoryRouter.post("/create", inventoryController.addAnimeInfoPost);

inventoryRouter.get("/search", inventoryController.searchAnimeGet);
inventoryRouter.post("/search", inventoryController.searchAnimePost);

inventoryRouter.get("/add-genre", inventoryController.addAnimeGenreGet);
inventoryRouter.post("/add-genre", inventoryController.addAnimeGenrePost);
inventoryRouter.get("/get-genres", inventoryController.getAnimeGenre);

inventoryRouter.post("/collection/add", inventoryController.AddCollectionPost);

inventoryRouter.get("/collection", inventoryController.ListAnimeCollectionsGet);
inventoryRouter.get(
  "/collection/:page",
  inventoryController.ListAnimeCollectionByPagination
);
inventoryRouter.get("/:page", inventoryController.listRandomAnimeDataGet);

module.exports = { inventoryRouter };
