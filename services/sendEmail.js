const axios = require('axios');
const { SESClient, ListIdentitiesCommand, SendEmailCommand } = require("@aws-sdk/client-ses");
const AWSWebhookSESLog = require("../model/awsWebhookLog");
const postmark = require("postmark");

const REGION = process.env.AWS_SES_BUCKET_REGION;
const ACCESS_KEY = process.env.AWS_SES_ACCESS_KEY;
const SECRET_KEY = process.env.AWS_SES_SECRET_KEY
const fromMail = process.env.AWS_SES_FROM_MAIL;
const fromName = process.env.AWS_SES_FROM_NAME;

const postMarkToken = process.env.POST_MARK_API_TOKEN;
const postMarkFromMail = process.env.POST_MARK_FROM_MAIL;
const postMarkFromName = process.env.POST_MARK_FROM_NAME;
const postMarkSupportMail = process.env.POST_MARK_SUPPORT_MAIL;
const partnerPostmarkMail = process.env.POST_MARK_PARTNER_MAIL;
const filmMakersPostmarkMail = process.env.POST_MARK_FILMMAKERS_MAIL;

var contactUsMail = async function (email, subject, body) {
    try {

        let client = new postmark.ServerClient(postMarkToken);

        const sendMail = await client.sendEmail({
            "From": process.env.POST_MARK_ADMIN_MAIL,
            "To": postMarkSupportMail,
            "ReplyTo": email,
            "Subject": subject,
            "HtmlBody": body,
            "MessageStream": "outbound"
        });

        console.log("MessageId: ", sendMail?.MessageID);
        console.log("Message: ", sendMail?.Message);

        return sendMail
    } catch (error) {
        console.log('Error', error);
        return error
    }
}

var sendEmail = async function (to, subject, body, MessageStream = 'outbound') {
    try {

        let client = new postmark.ServerClient(postMarkToken);

        const sendMail = await client.sendEmail({
            "From": `${postMarkFromName} <${postMarkFromMail}>`,
            "To": to,
            "Subject": subject,
            "HtmlBody": body,
            "MessageStream": MessageStream
        });

        console.log("MessageId: ", sendMail?.MessageID);
        console.log("Message: ", sendMail?.Message);

        return sendMail
    } catch (error) {
        console.log('Error', error);
        return error
    }
}

module.exports = {
    sendEmail: sendEmail,
    contactUsMail: contactUsMail
}