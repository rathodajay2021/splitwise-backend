const { validationResult } = require("express-validator");
const { USER_TYPE } = require("../Config/constants");

const jwt = require("jsonwebtoken");

class Authentication {
  static async all(req, res, next, loginType) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.handler.validationError(null, errors.array());
    }

    if (loginType === USER_TYPE.LOGGED_IN) {
      const token = req.headers["accesstoken"];

      if (token) {
        jwt.verify(token, global.secretKey, (err, decode) => {
          if (err) {
            res.handler.unauthorized("USER.TOKEN.INVALID");
          } else {
            next();
          }
        });
      } else {
        res.handler.unauthorized("USER.TOKEN.UNAUTHORIZED");
      }
    }

    //if no errors
    next();
  }

  static async blank(req, res, next) {
    await Authentication.all(req, res, next, USER_TYPE.OPEN_TO_ALL);
  }

  static async auth(req, res, next) {
    await Authentication.all(req, res, next, USER_TYPE.LOGGED_IN);
  }
}

module.exports = Authentication;
