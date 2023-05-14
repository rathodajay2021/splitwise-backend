const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

module.exports = class MailerManager {
  static async sendMail(emailId, subject, text, html) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmailId,
        pass: senderEmailPass,
      },
    });

    await transporter.sendMail({
      from: senderEmailId,
      to: emailId,
      subject: subject || "",
      text,
      html,
    });
  }

  static otpGeneration(
    length = 6,
    digits = true,
    lowerCaseAlphabets = false,
    upperCaseAlphabets = false,
    specialChars = false
  ) {
    return otpGenerator.generate(length, {
      digits,
      lowerCaseAlphabets,
      upperCaseAlphabets,
      specialChars,
    });
  }

  static async forgotPassword(emailId, subject, text, html) {
    MailerManager.sendMail(emailId, subject, text, html);
  }
};
