const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Sambit <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // Send the actual email

    // 1) Render HTML from Pug
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // 2) Mail Options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};

// const sendEmail = async (options) => {
//   // 1. Create a Transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.MAILTRAP_HOST,
//     port: process.env.MAILTRAP_PORT,
//     auth: {
//       user: process.env.MAILTRAP_USERNAME,
//       pass: process.env.MAILTRAP_PASSWORD,
//     },
//   });

//   // 2.Email Options
//   const mailOptions = {
//     from: 'Sambit <sambitkumar75@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   // 3.Sending mail
//   await transporter.sendMail(mailOptions);
// };
