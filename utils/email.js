const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  // 2.Email Options
  const mailOptions = {
    from: 'Sambit <sambitkumar75@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3.Sending mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
