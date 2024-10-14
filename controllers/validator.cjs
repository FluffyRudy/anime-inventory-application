const { body } = require("express-validator");

const invalidCharacterError =
  "Shouldnt contain extra character other than alphabet";

const animeInfoValidator = [
  body("name")
    .matches(/[a-zA-Z\s]/)
    .withMessage("Name: " + invalidCharacterError)
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be at least 3 character long"),
  body("creator")
    .matches(/[a-zA-Z\s]/)
    .withMessage("Creator: " + invalidCharacterError)
    .isLength({ min: 2, max: 50 })
    .withMessage("Length of create must be at least 2 character long"),
  body("rating").isNumeric().withMessage("Rating should be numeric"),
  body("genre").exists().withMessage("Select at least one genre"),
];

module.exports = { animeInfoValidator };
