import { ENV } from "../lib/env.js";
import { sender } from "../lib/resend.js";
import { welcomeEmailTemplate } from "./emailTemplates.js";


export const sendWelcomeEmail = async (email,name,clientURL) => {
    const data = {
        from: sender,
        to: email,
        subject: "Welcome to Chatify!",
        html: welcomeEmailTemplate(name, clientURL)  
    }

}

