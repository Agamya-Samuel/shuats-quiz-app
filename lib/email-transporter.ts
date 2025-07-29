import nodemailer from 'nodemailer';

// Create a transporter using SMTP for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use app password for Gmail
  },
});


export default transporter;