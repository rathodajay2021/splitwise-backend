const express = require("express");

const router = express.Router();
const controller = new (require("../../Controller/Users/Users.controller"))();
const validation = require("../../Validator/Users/Users.validation");
const authentication = require("../../Validator/Authentication");

router
  .route("/get")
  .get(validation.getUserValidation, authentication.auth, controller.getUser);

module.exports = router;
