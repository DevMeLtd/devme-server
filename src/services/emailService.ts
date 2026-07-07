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

interface StatusUpdateEmailOptions {
  email: string;
  parentName: string;
  childName: string;
  status: string;
  applicationTrack: string;
  adminNotes?: string;
}

interface AdminNotificationOptions {
  adminEmail: string;
  childName: string;
  parentName: string;
  applicationTrack: string;
  applicationId: string;
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
    subject: 'FutureProof 2026 - Application Received',
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
          
          <p><strong>Important Note:</strong> If selected, the bootcamp fee is ₦50,000 per student. Excellent submissions may be considered for scholarships.</p>
          
          <p>For any questions, please contact us at devmeltd@gmail.com</p>
          
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

// New: Send status update email to parent/guardian
export const sendStatusUpdateEmail = async (options: StatusUpdateEmailOptions) => {
  const statusMessages: Record<string, { subject: string; title: string; color: string; message: string }> = {
    shortlisted: {
      subject: 'FutureProof 2026 - Congratulations! You\'ve Been Shortlisted',
      title: '🎉 Congratulations! You\'ve Been Shortlisted!',
      color: '#2563eb',
      message: `
        <p>We are excited to inform you that <strong>${options.childName}</strong> has been <strong>shortlisted</strong> for the next stage of the FutureProof 2026 bootcamp selection process.</p>
        <p>This means that your application stood out among many others, and we would like to learn more about you.</p>
        
        <div style="background: #fff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <h3 style="color: #2563eb;">Next Steps:</h3>
          <ol>
            <li>Our team will contact you within the next 48 hours for a brief follow-up conversation</li>
            <li>Please prepare to speak about your submission and why you want to attend FutureProof</li>
            <li>Keep an eye on your email and phone for our call</li>
          </ol>
        </div>
        
        ${options.adminNotes ? `
          <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #2563eb; font-weight: 600;">Notes from our team:</p>
            <p>${options.adminNotes}</p>
          </div>
        ` : ''}
        
        <p><strong>Application Track:</strong> ${options.applicationTrack}</p>
        <p>If you have any questions, please contact us at devmeltd@gmail.com</p>
      `
    },
    accepted: {
      subject: 'FutureProof 2026 - 🎉 Congratulations! You\'ve Been Accepted!',
      title: '🎊 Congratulations! Welcome to FutureProof 2026!',
      color: '#16a34a',
      message: `
        <p>We are absolutely thrilled to inform you that <strong>${options.childName}</strong> has been <strong>selected</strong> to join the FutureProof 2026 bootcamp!</p>
        <p>Your application impressed our selection committee, and we believe you have what it takes to thrive in this transformative program.</p>
        
        <div style="background: #f0fdf4; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <h3 style="color: #16a34a;">What's Next?</h3>
          <ol>
            <li><strong>Program Fee:</strong> The bootcamp fee is ₦50,000 per student</li>
            <li><strong>Payment Deadline:</strong> Payment must be made within 7 days of this notification</li>
            <li><strong>Bootcamp Dates:</strong> Details will be sent to you in the welcome package</li>
            <li><strong>What to Bring:</strong> A list of items to bring will be provided</li>
          </ol>
        </div>
        
        ${options.adminNotes ? `
          <div style="background: #f0fdf4; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #16a34a; font-weight: 600;">Notes from our team:</p>
            <p>${options.adminNotes}</p>
          </div>
        ` : ''}
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="color: #d97706; font-weight: 600;">💡 Important Information:</p>
          <p><strong>Application Track:</strong> ${options.applicationTrack}</p>
          <p><strong>Scholarship Opportunity:</strong> Excellent submissions may be considered for scholarships.</p>
          <p>For any questions, please contact us at devmeltd@gmail.com</p>
        </div>
        
        <p>We can't wait to see you at the bootcamp!</p>
      `
    }
  };

  const statusInfo = statusMessages[options.status];
  if (!statusInfo) return; // Only send for shortlisted or accepted

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: statusInfo.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a2e;">FutureProof</h1>
          <p style="color: #666;">7-Day Residential Bootcamp</p>
        </div>
        
        <div style="background: #f0f0f0; padding: 20px; border-radius: 10px;">
          <h2 style="color: ${statusInfo.color};">${statusInfo.title}</h2>
          <p>Dear ${options.parentName},</p>
          ${statusInfo.message}
          <br/>
          <p>Best regards,<br>
          <strong>The FutureProof Team</strong></p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999;">
          <p>FutureProof Bootcamp | Akure, Nigeria</p>
          <p>📧 devmeltd@gmail.com</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// New: Send admin notification when new application is submitted
export const sendAdminNotification = async (options: AdminNotificationOptions) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: '🔔 New FutureProof Application Submitted!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a2e;">FutureProof</h1>
          <p style="color: #666;">New Application Alert</p>
        </div>
        
        <div style="background: #f0f0f0; padding: 20px; border-radius: 10px;">
          <h2 style="color: #0A2463;">📋 New Application Received!</h2>
          <p>A new application has been submitted for the FutureProof 2026 bootcamp.</p>
          
          <div style="background: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #0A2463;">Application Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #475569;">Applicant:</td>
                <td style="padding: 8px 0; color: #1e293b;">${options.childName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #475569;">Parent/Guardian:</td>
                <td style="padding: 8px 0; color: #1e293b;">${options.parentName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #475569;">Application Track:</td>
                <td style="padding: 8px 0; color: #1e293b;">${options.applicationTrack}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #475569;">Application ID:</td>
                <td style="padding: 8px 0; color: #1e293b;">${options.applicationId}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <p style="margin: 0;">
              <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://admin.thedevme.com'}" 
                 style="display: inline-block; padding: 12px 24px; background: #0A2463; color: white; text-decoration: none; border-radius: 5px; font-weight: 600;">
                View Application in Dashboard
              </a>
            </p>
          </div>
          
          <p style="color: #64748B; font-size: 14px;">Please review this application and update its status accordingly.</p>
          
          <p>Best regards,<br>
          <strong>FutureProof System</strong></p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};