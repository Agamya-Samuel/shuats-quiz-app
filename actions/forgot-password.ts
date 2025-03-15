'use server';

import { connectToDB } from '@/db';
import User from '@/db/models/user';
import { generateToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';
import { z } from 'zod';

// Schema for forgot password
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function forgotPassword(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    
    // Validate email
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    
    // Connect to database
    await connectToDB();
    
    // Find user by email
    const user = await User.findOne({ email }).lean();
    
    // If user not found, still return success to prevent email enumeration
    if (!user) {
      return { success: true };
    }
    
    // Create reset token payload
    const resetTokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      purpose: 'password-reset',
      role: 'user' as const,
    };
    
    // Generate reset token (valid for 1 hour)
    const resetToken = await generateToken(resetTokenPayload);
    
    // Send password reset email
    const emailSent = await sendPasswordResetEmail(user.email, resetToken);
    
    if (!emailSent) {
      return { success: false, error: 'Failed to send reset email. Please try again.' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { 
      success: false, 
      error: 'An error occurred. Please try again later.' 
    };
  }
} 