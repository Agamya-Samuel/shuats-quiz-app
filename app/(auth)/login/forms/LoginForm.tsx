// app/(auth)/login/forms/LoginForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { loginUser } from '@/actions/user';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCookies } from '@/contexts/cookie-context';
import { useToast } from '@/hooks/use-toast';
import { loginSchema } from '@/schemas/forms/login-schema';
import { AddressData } from '@/types/user';

// Define response type for better type safety
interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    name: string;
    email: string;
    mobile: string;
    school: string;
    rollno: string;
    branch: string;
    address: AddressData;
  };
}

export function LoginForm({ redirect }: { redirect?: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const { updateUser } = useCookies();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);

    // Login user
    loginUser({
      email: values.email,
      password: values.password,
    })
      .then((response: LoginResponse) => {
        setIsLoading(false);
        if (response.success) {
          toast({
            title: 'Login Successful',
            description: 'You have successfully logged in.',
            variant: 'success',
          });
          router.push(redirect || '/user/quiz'); // Redirect to quiz page after successful login
        } else {
          toast({
            title: 'Login Failed',
            description: response.message || 'Invalid email or password.',
            variant: 'destructive',
          });
        }
      })
      .catch((error: Error) => {
        setIsLoading(false);
        toast({
          title: 'Login Error',
          description: `An error occurred while logging in: ${error.message}. Please try again.`,
          variant: 'destructive',
        });
      });
  }

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Google Sign-In Successful',
          description: data.profileComplete
            ? 'Welcome back!'
            : 'Please complete your profile.',
          variant: 'success',
        });
        // Update user context before redirecting
        if (data.user) {
          updateUser({
            userId: data.user.id, // Assuming API returns user.id
            name: data.user.name,
            email: data.user.email,
            picture: data.user.picture,
            role: 'user', // Or derive from API response if available
            // Add other fields if returned and needed in context immediately
          });
        }

        if (data.profileComplete) {
          router.push(redirect || '/user/quiz');
        } else {
          router.push('/user/complete-profile');
        }
      } else {
        toast({
          title: 'Google Sign-In Failed',
          description: data.message || 'Could not sign in with Google.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      toast({
        title: 'Google Sign-In Error',
        description: 'An unexpected error occurred during Google Sign-In.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In Error');
    toast({
      title: 'Google Sign-In Failed',
      description:
        'There was an error signing in with Google. Please try again.',
      variant: 'destructive',
    });
    setIsLoading(false);
  };

  // Helper function to render form field with icon
  const renderField = (
    name: keyof z.infer<typeof loginSchema>,
    label: string,
    placeholder: string,
    icon: React.ReactNode,
    type = 'text',
    autoComplete = '',
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <div className="absolute left-3 top-3 text-muted-foreground">
                {icon}
              </div>
              <Input
                placeholder={placeholder}
                className={`pl-10 ${name === 'password' ? 'pr-10' : ''}`}
                type={
                  name === 'password'
                    ? showPassword
                      ? 'text'
                      : 'password'
                    : type
                }
                autoComplete={autoComplete}
                {...field}
              />
              {name === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                  tabIndex={-1}>
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </FormControl>
          <FormMessage />
          {name === 'password' && (
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </Link>
            </div>
          )}
        </FormItem>
      )}
    />
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue or use Google.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              shape="rectangular"
              logo_alignment="center"
              width="300px"
            />
          </div>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              method="post">
              {renderField(
                'email',
                'Email',
                'Enter your email',
                <Mail className="h-4 w-4" />,
                'email',
                'email',
              )}

              {renderField(
                'password',
                'Password',
                'Enter your password',
                <Lock className="h-4 w-4" />,
                'password',
                'current-password',
              )}

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span>Logging in</span>
                    <LoadingSpinner />
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center pt-2 pb-6">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-700 underline">
              Register
            </Link>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            By logging in, you agree to our{' '}
            <Link
              href="/terms"
              className="underline hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline hover:text-primary">
              Privacy Policy
            </Link>
          </p>
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
