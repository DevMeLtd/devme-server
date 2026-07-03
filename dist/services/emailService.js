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
exports.sendApplicationConfirmation = exports.sendConfirmationEmail = void 0;
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
        <p>If you need to reschedule or have any questions, please contact us at support@thedevme.com</p>
        <br/>
        <p>Best regards,</p>
        <p>The DevMe Wellness Team</p>
      </div>
    `
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendConfirmationEmail = sendConfirmationEmail;
const sendApplicationConfirmation = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.email,
        subject: 'FutureProof 2025 - Application Received',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a2e;">FutureProof</h1>
          <p style="color: #666;">7-Day Residential Bootcamp</p>
        </div>
        
        <div style="background: #f0f0f0; padding: 20px; border-radius: 10px;">
          <h2 style="color: #16213e;">Application Received!</h2>
          <p>Dear ${options.parentName},</p>
          <p>Thank you for submitting an application for <strong>${options.childName}</strong> to the FutureProof bootcamp.</p>
          <p><strong>Application Track:</strong> ${options.applicationTrack}</p>
          <p>We have successfully received your application. Our team will review it and get back to you within 5-7 business days.</p>
          
          <div style="background: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #e94560;">What's Next?</h3>
            <ol>
              <li>Review of application by our selection committee</li>
              <li>Shortlisted candidates will be contacted for a brief follow-up conversation</li>
              <li>Selected candidates will receive an acceptance letter with bootcamp details</li>
            </ol>
          </div>
          
          <p><strong>Important Note:</strong> If selected, the bootcamp fee is ₦100,000 per student. Excellent submissions may be considered for scholarships.</p>
          
          <p>For any questions, please contact us at hello@futureproof.ng</p>
          
          <p>Best regards,<br>
          <strong>The FutureProof Team</strong></p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999;">
          <p>FutureProof Bootcamp | Akure, Nigeria</p>
        </div>
      </div>
    `
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendApplicationConfirmation = sendApplicationConfirmation;
