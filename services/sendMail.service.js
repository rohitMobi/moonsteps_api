const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "rohit.pandit@indicchain.com",
        pass: "wvvszhdtlwpsmihv"
    }
});

const sendmail = (email, subject, text) => {
    const mailOptions = {
        from: "rohit.pandit@indicchain.com",
        to: email,
        subject: subject,
        html: text
    };

    transport.sendMail(mailOptions).then(() => {
        return { success: "success", message: "Mail Send Sussfully" };
    }).catch((err) => {
        return { success: "error", message: err };
    })
};

module.exports = sendmail;

