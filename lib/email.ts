import nodemailer from 'nodemailer';

import { loadEmailTemplate } from '@/email-templates/utils';

// Create a transporter using SMTP for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use app password for Gmail
  },
});

// Function to send registration confirmation email
export async function sendRegistrationEmail(
  email: string,
  name: string,
): Promise<boolean> {
  try {
    const htmlContent = loadEmailTemplate('registration', {
      name,
      year: new Date().getFullYear(),
    });

    await transporter.sendMail({
      from: `"SHUATS (DCS & IT)" <${process.env.EMAIL_USER}>`,
      to: email,
      subject:
        'Welcome to SHUATS National Talent Search Quiz - Thank you for registering',
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('Error sending registration email:', error);
    return false;
  }
}

// Function to send password reset email
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
): Promise<boolean> {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    const htmlContent = loadEmailTemplate('reset-password', {
      resetUrl,
      year: new Date().getFullYear(),
    });

    await transporter.sendMail({
      from: `"SHUATS (DCS & IT)" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password - SHUATS National Talent Search Quiz',
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}
