import nodemailer from 'nodemailer';

// Create a transporter using SMTP for Gmail
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD, // Use app password for Gmail
	},
});

// Function to send password reset email
export async function sendPasswordResetEmail(
	email: string,
	resetToken: string
): Promise<boolean> {
	try {
		const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

		await transporter.sendMail({
			from: `"SHUATS Quiz App" <${process.env.EMAIL_USER}>`,
			to: email,
			subject: 'Reset Your Password',
			html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset for your SHUATS Quiz App account.</p>
          <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p>${resetUrl}</p>
        </div>
      `,
		});

		return true;
	} catch (error) {
		console.error('Error sending password reset email:', error);
		return false;
	}
}
