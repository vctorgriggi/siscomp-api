const transporter = require("../config/mail.js");

let { EMAIL_USER } = process.env;

class MailService {
  async sendMail(to, subject, text) {
    try {
      const info = await transporter.sendMail({
        from: EMAIL_USER,
        to,
        // replyTo: "", // suggestion: define a reply-to address
        subject,
        text,
      });

      return info;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = MailService;
