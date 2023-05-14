const ApiModel = new (require("../../Models/Auth/Auth.model"))();
const TokenManager = require("../../Manager/Token.manager");
const MailerManager = require("../../Manager/Mail.manager");

const bcrypt = require("bcrypt");

class AuthController {
  async signIn(req, res) {
    try {
      //check do user exist with that email id
      const response = await ApiModel.checkUser(req.body.email);
      if (response) {
        //check is password is correct
        const auth = await bcrypt.compare(req.body.password, response.password);

        if (!auth)
          return res.handler.unauthorized("VALIDATION.NOT_FOUND.PASSWORD");
        //create jwt token
        const token = TokenManager.createJwtToken(response.id);
        response._doc.accessToken = token;
        //it is first time login or not
        if (response.firstTimeLogin) return res.handler.success(response);

        //if first time login then preconditionFailed send otp
        const otp = MailerManager.otpGeneration(6, true, false, false, false);
        const updatedOtp = await ApiModel.updateUserAPI(response.id, {
          verificationCode: otp,
        });

        MailerManager.forgotPassword(
          response.email,
          "splitWiseProj otp pin",
          `Your otp pin is ${otp}`
        );

        return res.handler.preconditionFailed("USER.PRE_CONDITION", response);
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

      if (isUserExist) return res.handler.forbidden("VALIDATION.EXIST.EMAIL");
      const otp = MailerManager.otpGeneration(6, true, false, false, false);

      const response = await ApiModel.createUser({
        ...req.body,
        verificationCode: otp,
      });

      if (response) {
        //send otp on user mail id
        MailerManager.forgotPassword(
          response.email,
          "splitWiseProj otp pin",
          `Your otp pin is ${otp}`
        );

        const token = TokenManager.createJwtToken(response.id);
        response._doc.accessToken = token;
        return res.handler.created(response, "USER.CREATED");
      }

      res.handler.badRequest();
    } catch (error) {
      console.log("auth controller sign up function error", error);
      res.handler.serverError(error);
    }
  }

  async resendOtp(req, res) {
    try {
      const isUserExist = await ApiModel.checkUser(req.body.email);

      if (isUserExist) {
        const otp = MailerManager.otpGeneration(6, true, false, false, false);
        const response = await ApiModel.updateUserAPI(isUserExist.id, {
          verificationCode: otp,
        });

        MailerManager.forgotPassword(
          req.body.email,
          "splitWiseProj otp pin",
          `Your otp pin is ${otp}`
        );

        return res.handler.success({}, "USER.OTP.RESEND");
      }

      res.handler.forbidden("VALIDATION.NOT_FOUND.USER");
    } catch (error) {
      console.log("auth controller and resend otp function", error);
      res.handler.serverError(error);
    }
  }

  async verifyOtp(req, res) {
    try {
      //verify is user exist with email id
      const isUserExist = await ApiModel.checkUser(req.body.email);

      if (isUserExist) {
        //verify otp
        const isOTPVerify = await ApiModel.verifyOtpAPI(
          req.body.email,
          req.body.otp
        );

        if (isOTPVerify) {
          //first time login is done so update status
          await ApiModel.updateUserAPI(isOTPVerify.id, { firstTimeLogin: 1 });
          //create token and send response
          const token = TokenManager.createJwtToken(isOTPVerify.id);
          isOTPVerify._doc.accessToken = token;
          return res.handler.success(isOTPVerify, "USER.LOGIN");
        }

        return res.handler.validationError("USER.OTP.INVALID");
      }

      res.handler.forbidden("VALIDATION.NOT_FOUND.USER");
    } catch (error) {
      console.log("auth controller verifyOtp func", error);
    }
  }

  async verifyEmail(req, res) {
    try {
      const isUserExist = await ApiModel.checkUser(req.body.email);

      if (isUserExist) {
        const resetEmailUrl = `http://localhost:3000/reset-password?email=${req.body.email}`;
        MailerManager.forgotPassword(
          req.body.email,
          "splitWiseProj reset password",
          `Your reset email url is ${resetEmailUrl}`
        );

        return res.handler.success(null, "USER.PASSWORD.RESET_EMAIL");
      }

      res.handler.forbidden("VALIDATION.NOT_FOUND.USER");
    } catch (error) {
      res.handler.serverError(error);
      console.log("authController and verifyEmail func", error);
    }
  }

  async resetPassword(req, res) {
    try {
      const isUserExist = await ApiModel.checkUser(req.body.email);

      if (!isUserExist)
        return res.handler.forbidden("VALIDATION.NOT_FOUND.USER");

      const response = await ApiModel.updateUserAPI(isUserExist.id, {
        password: req.body.password,
      });

      if (response)
        return res.handler.updated(response, "USER.PASSWORD.UPDATED");
      res.handler.badRequest();
    } catch (error) {
      res.handler.serverError(error);
      console.log("authController resetPassword func", error);
    }
  }
}

module.exports = AuthController;
