import messageBroker from "@kibos/messaging";
import nodemailer from "nodemailer";
import CustomError from "./customError.js";
import { FRONTEND_URL, GOOGLE_APP_PASSWORD, GOOGLE_GMAIL_ID } from "../config/index.js";
import generateEmailTemplate from "./emailTemplate.js";

function startSendMailConsumer() {
    try {
        messageBroker?.consume("auth.password_reset_requested", async (msg) => {
            // send the email to the user with reset link
            if(!msg) {
                throw new CustomError(500, "Failed to retrieve the payload in the consumer mail service.");
            }

            const { payload } = msg;

            if(!payload || !payload.email || !payload.resetToken) {
                throw new CustomError(500, "Invalid message received from the producer auth service.");
            }
            
            const resetLink = `${FRONTEND_URL}/reset/${payload.resetToken}`;

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: GOOGLE_GMAIL_ID,
                    pass: GOOGLE_APP_PASSWORD
                }
            });

            const sentMail = await transporter.sendMail({
                from: "Kibos <no-reply@kibos.com>",
                to: payload.email,
                subject: "Reset Your Kibos Account Password",
                html: generateEmailTemplate(resetLink)
            });

            console.log("Mail sent ", sentMail.messageId);
        });
    }
    catch(error) {
        console.log(error);
        throw new CustomError(500, "Failed to consume password reset request.");
    }
}

export default startSendMailConsumer;