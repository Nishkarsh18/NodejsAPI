// code to send email to User for password reset
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "smtp@mailtrap.io",
      pass: "2a9fc8c19c76dd8dd45a68cd2adce58b",
    },
  });
  const message = {
    from: "smtp@mailtrap.io",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(message);
};

module.exports = sendEmail;
