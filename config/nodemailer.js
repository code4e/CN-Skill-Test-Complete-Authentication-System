const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
let testAccount = (async () => await nodemailer.createTestAccount())();
let transporter;

try {
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.TRANSPORTER_EMAIL,
            pass: process.env.TRANSPORTER_PASSWORD
        }
    });
} catch (error) {
    console.log(error);
}




//HTML template for reset password email
let renderTemplate = (data, relativePath) => {

    let mailHTML;

    //read the ejs file that has the email template defined and render the mail template html file given in the path
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        (err, template) => mailHTML = err ? console.log('error in rendering the template at path', path.join(__dirname, '../views/mailers', relativePath)) : template,
    );

    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}