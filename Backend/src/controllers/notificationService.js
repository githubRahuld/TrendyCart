import nodemailer from "nodemailer";
import twilio from "twilio";

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const formatPhoneNumber = (phoneNumber) => {
    // Ensure the phone number starts with a '+' and contains only digits
    if (!phoneNumber.startsWith("+")) {
        return `+91${phoneNumber.replace(/\D/g, "")}`;
    }
    return phoneNumber.replace(/\D/g, ""); // Remove non-digit characters if already in E.164 format
};

export const sendSMS = async (to, message) => {
    const formattedTo = formatPhoneNumber(to);
    return await twilioClient.messages.create({
        body: message,
        to: formattedTo,
        from: process.env.TWILIO_PHONE_NUMBER,
    });
};

export const sendEmail = async (to, message, subj = "Your OTP Code") => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    return await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: subj,
        html: message,
    });
};
