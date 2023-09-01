import { responseMessages } from "../helpers/proyect.helpers.js";
import { transporter } from "../utils/utils.js";

export const sendEmail = async(email) => {
    await transporter.sendMail({
        from: responseMessages.from_mail,
        to: email.to,
        subject: email.subject,
        html: email.html
    });
};