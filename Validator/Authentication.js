const { validationResult } = require("express-validator");

class Authentication {
  static async all(req, res, next, loginType) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.handler.validationError(null, errors.array());
    }

    //if no errors
    next();
  }

  static async blank(req, res, next) {
    await Authentication.all(req, res, next, []);
  }
}

module.exports = Authentication;
