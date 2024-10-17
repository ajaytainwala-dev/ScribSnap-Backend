// node mailer allows you to send email
const nodemailer = require('nodemailer');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({

        host: "smtp.gmail.email",
        service: "gmail",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASSWORD,
        },
    })

    const mailOptions = {
        from: {
            name: "ScribSnap",
            address:  process.env.EMAIL_FROM
        },
        to: options.to,
        subject: options.subject,
        html: options.text,
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log(info)
        }
    })
}

module.exports = sendEmail