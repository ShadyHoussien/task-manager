const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendTextEmail = (to, subject, body) => {
    sgMail.send({
        to,
        from: 'shadyhoussien@gmail.com',
        subject,
        text : body,
    });
}

const sendTemplateEmail = (to, subject, body) => {
    sgMail.send({
        to,
        from: 'shadyhoussien@gmail.com',
        subject,
        html : body,
    });
}

module.exports = {sendTextEmail , sendTemplateEmail};