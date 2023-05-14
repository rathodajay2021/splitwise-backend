const ApiModel = new (require("../../Models/Users/Users.model"))();

class UserController {
  async getUser(req, res) {
    try {
      const [rows, count] = await ApiModel.getUsersAPI(req.query);

      if (rows) return res.handler.success({ rows, count });
      res.handler.badRequest();
    } catch (error) {
      console.log("user controller getUser func", error);
      res.handler.serverError(error);
    }
  }
}

module.exports = UserController;
