const { body } = require("express-validator");

const invalidCharacterError =
  "Shouldnt contain extra character other than alphabet";

const animeInfoValidator = [
  body("name")
    .matches(/[a-zA-Z\s]/)
    .withMessage("Name: " + invalidCharacterError)
    .isLength({ min: 3, max: 250 })
    .withMessage("Username must be at least 3 character long"),
  body("creator")
    .optional({ values: "falsy" })
    .matches(/[a-zA-Z\s]/)
    .withMessage("Creator: " + invalidCharacterError)
    .isLength({ min: 2, max: 250 })
    .withMessage("Length of create must be at least 2 character long"),
  body("rating")
    .optional({ values: "falsy" })
    .isNumeric()
    .withMessage("Rating should be numeric"),
  body("genre").exists().withMessage("Select at least one genre"),
  body("release_date")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Released date must be a valid ISO 8601 date"),
];

const genreInfoValidator = [
  body("genre")
    .isString()
    .withMessage("genre must be string(internal error)")
    .matches(/[a-zA-Z\s]/)
    .withMessage("Genre: " + invalidCharacterError)
    .isLength({ min: 3 })
    .withMessage("Require at least 3 chracters long"),
];

const searchQueryValidator = [
  body("search")
    .exists()
    .withMessage("Search query must exist")
    .isLength({ min: 3 })
    .withMessage("Minimum 3 character required for seach value"),
];

module.exports = {
  animeInfoValidator,
  genreInfoValidator,
  searchQueryValidator,
};
