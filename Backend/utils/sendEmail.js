const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Greencart" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    text,
    html: html || undefined,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
