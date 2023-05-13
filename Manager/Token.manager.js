const jwt = require("jsonwebtoken");

module.exports = class {
  static createJwtToken(id) {
    return jwt.sign({ id }, secretKey, { expiresIn: tokenAge });
  }
};
