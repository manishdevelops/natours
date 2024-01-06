const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const path = require('path')

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Manish Mandal ${process.env.EMAIL_FROM}`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // send grid
            return 1;
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(template, subject) {
        // Render HTML based on a pug template

        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`.replace(/\s/g, ''),
            {
                firstName: this.firstName,
                url: this.url,
                subject
            });

        // 2)Define the email address
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            html: html,
            text: htmlToText.convert(html)
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions); // return async fn

    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password rest token (valid only for 10 minutes)'
        );
    }
};

