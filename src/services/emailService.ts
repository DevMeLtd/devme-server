import nodemailer from 'nodemailer';
import env from "dotenv";

interface EmailOptions {
  email: string;
  parentName: string;
  appointmentDate: Date;
  childName: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendConfirmationEmail = async (options: EmailOptions) => {
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

  await transporter.sendMail(mailOptions);
};