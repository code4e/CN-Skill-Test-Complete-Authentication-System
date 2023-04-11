const nodeMailer = require('../config/nodemailer');

//send the mail to the user who just commented on someone's post -> that yes "you have commented sucessfully"
exports.sendMailWithPasswordResetLink = (targetEmail, passwordResetLink) => {

   

    let htmlString = nodeMailer.renderTemplate({ targetEmail, passwordResetLink }, '/reset_password_mailer.ejs');
    // send mail with defined transport object
    nodeMailer.transporter.sendMail({
        from: 'support@one-stop-auth.com', // sender address
        to: targetEmail, // list of receivers (sending the mail to the person who has commented)
        subject: "Reset Password here", // Subject line
        html: htmlString, // html body
    }, (err, info) => {
        if (err) {
            console.log('Error in sending the mail', err);
            return;
        }
        console.log(info);
        return;
    });
}