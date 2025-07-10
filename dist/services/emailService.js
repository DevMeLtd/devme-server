"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConfirmationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const sendConfirmationEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.email,
        subject: 'DevMe Wellness Support - Appointment Confirmation',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #982293;">Appointment Confirmation</h2>
        <p>Dear ${options.parentName},</p>
        <p>Your appointment for <strong>${options.childName}</strong> has been successfully booked.</p>
        <p><strong>Appointment Date:</strong> ${options.appointmentDate.toLocaleString()}</p>
        <p>Our team will reach out to you shortly with more details about the session.</p>
        <p>If you need to reschedule or have any questions, please contact us at support@thesdevme.com</p>
        <br/>
        <p>Best regards,</p>
        <p>The DevMe Wellness Team</p>
      </div>
    `
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendConfirmationEmail = sendConfirmationEmail;
