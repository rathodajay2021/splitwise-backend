const express = require("express");

const router = express.Router();
const controller = new (require("../../Controller/Auth/Auth.controller"))();
const validation = require("../../Validator/Auth/Auth.validation");
const authentication = require("../../Validator/Authentication");

router
  .route("/login")
  .post(validation.loginValidation, authentication.blank, controller.signIn);
router
  .route("/signup")
  .post(validation.signupValidation, authentication.blank, controller.signUp);

module.exports = router;