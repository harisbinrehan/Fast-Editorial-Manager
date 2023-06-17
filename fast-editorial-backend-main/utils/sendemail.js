const nodemailer = require('nodemailer');
const path = require('path');

const sendEmail = async (to, subject, text) => {
    try {
        console.log("TO", to, "SUBJECT", subject);
        // Create a reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            // service: 'gmail', // Replace with your SMTP
            // secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER, // Replace with your email address
                pass: process.env.EMAIL_PASSWORD, // Replace with your email password
            },
        });

        // Set up email data with unicode symbols

        const logoPath = path.join(__dirname, '../assets/logo.png');

        const mailOptions = {
            from: 'moiz.don.a@gmail.com', // Replace with your email address
            to: to,
            subject: subject,
            html: text,
            attachments: [{
                filename: 'logo.png',
                path: logoPath,
                cid: 'unique@nodemailer.com' //same cid value as in the html img src
            }]
        };

        // Send email with defined transport object
        const info = await transporter.sendMail(mailOptions);

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
