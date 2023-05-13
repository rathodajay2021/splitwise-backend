const ApiModel = new (require("../../Models/Auth/Auth.model"))();
const TokenManager = require("../../Manager/Token.manager");
const MailerManager = require("../../Manager/Mail.manager");

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
        const response = await ApiModel.updateOtpAPI(isUserExist.id, {
          verificationCode: otp,
        });

        console.log("response", response, otp);
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
          await ApiModel.updateOtpAPI(isOTPVerify.id, { firstTimeLogin: 1 });
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
}

module.exports = AuthController;
