const { param, body, query } = require("express-validator");

const getUserValidation = [
  query("pageNo", "Page no is required")
    .trim()
    .notEmpty()
    .isNumeric()
    .withMessage("Enter valid page no"),
  query("perPage", "PerPage no is required")
    .trim()
    .notEmpty()
    .isNumeric()
    .withMessage("Enter valid perPage"),
];

module.exports = {
  getUserValidation,
};
