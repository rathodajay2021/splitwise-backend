const UserSchema = require("../../Database/Schema/Auth.schema");

class AuthModel {
  async checkUser(email) {
    return await UserSchema.findOne({ email });
  }

  async createUser(data) {
    const newUser = new UserSchema(data);
    return await newUser.save();
  }
}

module.exports = AuthModel;
