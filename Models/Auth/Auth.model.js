const UserSchema = require("../../Database/Schema/Auth.schema");

class AuthModel {
  async checkUser(email) {
    return await UserSchema.findOne({ email });
  }

  async createUser(data) {
    const newUser = new UserSchema(data);
    return await newUser.save();
  }

  async updateUserAPI(id, data) {
    return await UserSchema.findByIdAndUpdate(id, data);
  }

  async verifyOtpAPI(email, verificationCode) {
    return await UserSchema.findOne({ email, verificationCode });
  }
}

module.exports = AuthModel;
