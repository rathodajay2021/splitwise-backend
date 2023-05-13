const ApiModel = new (require("../../Models/Auth/Auth.model"))();
const TokenManager = require("../../Manager/Token.manager");

const bcrypt = require("bcrypt");

class AuthController {
  async signIn(req, res) {
    try {
      const response = await ApiModel.checkUser(req.body.email);
      if (response) {
        const auth = await bcrypt.compare(req.body.password, response.password);

        if (!auth) return res.handler.notFound("VALIDATION.NOT_FOUND.PASSWORD");

        const token = TokenManager.createJwtToken(response.id);
        response._doc.accessToken = token;
        return res.handler.success(response);
      }
      res.handler.notFound("VALIDATION.NOT_FOUND.USER");
    } catch (error) {
      console.log("auth controller sign in", error);
      res.handler.serverError(error);
    }
  }

  async signUp(req, res) {
    try {
      const isUserExist = await ApiModel.checkUser(req.body.email);

      if (isUserExist) res.handler.forbidden("VALIDATION.EXIST.EMAIL");

      const response = await ApiModel.createUser(req.body);

      if (response) {
        const token = TokenManager.createJwtToken(response.id);
        response._doc.accessToken = token;
        return res.handler.created(response);
      }

      res.handler.badRequest();
    } catch (error) {
      console.log("auth controller sign up function error", error);
      res.handler.serverError(error);
    }
  }
}

module.exports = AuthController;
