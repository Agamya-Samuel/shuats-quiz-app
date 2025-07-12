'use server';

import nodemailer from 'nodemailer';

import { loadEmailTemplate } from '@/lib/email-template-loader';

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
    const htmlContent = await loadEmailTemplate('registration', {
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

    const htmlContent = await loadEmailTemplate('reset-password', {
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

// Function to send account termination email
export async function sendAccountTerminationEmail(
  email: string,
  name: string,
  reason: string,
): Promise<boolean> {
  try {
    const htmlContent = await loadEmailTemplate('rejection', {
      name,
      reason,
      year: new Date().getFullYear(),
    });

    await transporter.sendMail({
      from: `"SHUATS (DCS & IT)" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Important: SHUATS Quiz Account Termination Notice',
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('Error sending account termination email:', error);
    return false;
  }
}

// Function to send custom email
export async function sendCustomEmail(
  email: string,
  subject: string,
  emailTemplate: string,
): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"SHUATS (DCS & IT)" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: emailTemplate,
    });
    console.log(`Custom email sent to ${email}`);
  } catch (error) {
    console.error('Error sending custom email:', error);
  }
}