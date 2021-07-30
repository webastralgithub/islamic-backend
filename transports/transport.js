const nodemailer = require('nodemailer');
require('dotenv').config();
// console.log(process.env.SMTP_USER);
exports.sendMailFunction = (to,subject,message) =>{
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMPTP_PASSWPRD
    }
});

// return transporter;
let mailOptions = {
    from: 'brianacarrillo37@gmail.com',
    to: to,
    subject: subject,
    html: message
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error.message);
    }
    console.log('success');
});
}