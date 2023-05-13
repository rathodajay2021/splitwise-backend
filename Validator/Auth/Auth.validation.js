const { param, body, query } = require("express-validator");

const loginValidation = [
  body("email", "Email is required")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Enter valid email id"),
  body("password", "Password is required")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Enter valid password"),
];
const signupValidation = [
  body("firstName", "FirstName is required")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Enter valid firstName"),
  body("lastName", "LastName is required")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Enter Valid lastName"),
  body("email", "Email is required")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Enter valid email id"),
  body("password", "Password is required")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Enter valid password"),
];

const resetOtpValidation = [
  body("email", "Email is required")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Enter valid email id"),
];

const verifyOtpValidation = [
  body("email", "Email is required")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Enter valid email id"),
  body("otp", "OTP is required")
    .trim()
    .notEmpty()
    .isNumeric()
    .withMessage("Enter valid otp format"),
];

module.exports = {
  loginValidation,
  signupValidation,
  resetOtpValidation,
  verifyOtpValidation,
};
