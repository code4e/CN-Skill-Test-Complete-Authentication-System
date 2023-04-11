const nodemailer = require('nodemailer');
require('dotenv').config()

const sendEmail = async (req, res) => {
    try {
        //create transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth:{
                user: process.env.TRANSPORT_EMAIL,
                pass: process.env.TRANSPORTER_PASSWORD
            }
        });
    } catch (error) {
        
    }
}