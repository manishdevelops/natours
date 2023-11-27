const nodemailer = require('nodemailer');

// options -> // the subject line, email content and may be some other content
const sendEmail = async options => {
    // 1) Create a transporter
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    // 2)Define the email address
    // console.log(options.email);
    const mailOptions = {
        from: 'jonas schmedtmann <hello@jonas.io>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    // console.log(options)
    // console.log(mailOptions)
    // 3) Actually send the email
    await transporter.sendMail(mailOptions); // return async fn
}

module.exports = sendEmail;