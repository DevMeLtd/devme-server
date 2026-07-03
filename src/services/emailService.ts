import nodemailer from 'nodemailer';
import env from "dotenv";

interface EmailOptions {
  email: string;
  parentName: string;
  appointmentDate: Date;
  childName: string;
}

interface ApplicationConfirmationOptions {
  email: string;
  parentName: string;
  childName: string;
  applicationTrack: string;
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
        <p>If you need to reschedule or have any questions, please contact us at support@thedevme.com</p>
        <br/>
        <p>Best regards,</p>
        <p>The DevMe Wellness Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendApplicationConfirmation = async (options: ApplicationConfirmationOptions) => {
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
  
  await transporter.sendMail(mailOptions);
};