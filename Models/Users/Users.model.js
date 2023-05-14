const UserSchema = require("../../Database/Schema/Auth.schema");

class UserModel {
  async getUsersAPI(params) {
    return await Promise.all([
      UserSchema.find()
        .skip(params.perPage * params.pageNo)
        .limit(params.perPage),
      UserSchema.countDocuments(),
    ]);
  }
}

module.exports = UserModel;
