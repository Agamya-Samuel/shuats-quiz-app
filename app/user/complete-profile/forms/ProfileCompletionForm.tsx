'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { City, Country, State } from 'country-state-city';
import { Home, Info, Mail, MapPin, Phone, School, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { completeUserProfile } from '@/actions/user';
// Assuming ComboboxField is in a shared location or adjust path
import {
  ComboboxField,
  ComboboxOption,
} from '@/app/(auth)/register/forms/ComboboxField';
// We will create this action next
import { LoadingSpinner } from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { AddressData } from '@/types/user';

// Schema for profile completion (subset of registrationSchema)
const profileCompletionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(), // Email will be pre-filled and read-only
  mobile: z
    .string()
    .min(10, 'Mobile number must be at least 10 digits')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid mobile number'),
  rollno: z.string().min(1, 'Roll number is required'),
  school: z.string().min(1, 'School name is required'),
  branch: z.string().min(1, 'Preferred branch is required'),
  country: z.string().min(1, 'Country is required'),
  address1: z.string().min(1, 'Address Line 1 is required'),
  address2: z.string().optional(),
  area: z.string().min(1, 'Area/Locality is required'),
  city: z.string().min(1, 'City is required'),
  pincode: z.string().min(1, 'Postal code is required'),
  state: z.string().min(1, 'State is required'),
});

interface CompleteProfileResponse {
  success: boolean;
  message: string;
  error?: string;
}

export function ProfileCompletionForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { user: contextUser } = useCookies();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof profileCompletionSchema>>({
    resolver: zodResolver(profileCompletionSchema),
    defaultValues: {
      name: contextUser?.name || '',
      email: contextUser?.email || '',
      mobile: '',
      rollno: '',
      school: '',
      branch: '',
      country: 'IN',
      address1: '',
      address2: '',
      area: '',
      city: '',
      pincode: '',
      state: 'UP',
    },
  });

  useEffect(() => {
    if (contextUser) {
      form.setValue('name', contextUser.name || '');
      form.setValue('email', contextUser.email || '');
    }
  }, [contextUser, form]);

  const countryList = useMemo(() => Country.getAllCountries(), []);
  const selectedCountry = form.watch('country');
  const selectedState = form.watch('state');

  const countryOptions: ComboboxOption[] = useMemo(
    () => countryList.map((c) => ({ value: c.isoCode, label: c.name })),
    [countryList],
  );

  const stateOptions: ComboboxOption[] = useMemo(() => {
    const countryObj = countryList.find((c) => c.isoCode === selectedCountry);
    if (!countryObj) return [];
    return State.getStatesOfCountry(countryObj.isoCode).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }));
  }, [selectedCountry, countryList]);

  const cityOptions: ComboboxOption[] = useMemo(() => {
    const countryObj = countryList.find((c) => c.isoCode === selectedCountry);
    if (!countryObj || !selectedState) return [];
    return City.getCitiesOfState(countryObj.isoCode, selectedState).map(
      (c) => ({
        value: c.name,
        label: c.name,
      }),
    );
  }, [selectedCountry, selectedState, countryList]);

  const prevCountry = useRef(selectedCountry);
  const prevState = useRef(selectedState);

  useEffect(() => {
    if (prevCountry.current !== selectedCountry) {
      form.setValue('state', '');
      form.setValue('city', '');
      prevCountry.current = selectedCountry;
    }
  }, [selectedCountry, form]);

  useEffect(() => {
    if (prevState.current !== selectedState) {
      form.setValue('city', '');
      prevState.current = selectedState;
    }
  }, [selectedState, form]);

  async function onSubmit(values: z.infer<typeof profileCompletionSchema>) {
    setIsLoading(true);

    const address: AddressData = {
      country: values.country,
      address1: values.address1,
      address2: values.address2,
      area: values.area,
      city: values.city,
      pincode: values.pincode,
      state: values.state,
    };

    try {
      const response: CompleteProfileResponse = await completeUserProfile({
        // userId will be taken from session/cookie in the server action
        mobile: values.mobile,
        rollno: values.rollno,
        school: values.school,
        branch: values.branch,
        address: address,
      });

      if (response.success) {
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated.',
          variant: 'success',
        });
        router.push('/user/quiz'); // Or dashboard
      } else {
        toast({
          title: 'Update Failed',
          description:
            response.message || response.error || 'Could not update profile.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Update Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const renderField = (
    name: keyof z.infer<typeof profileCompletionSchema>,
    label: string,
    placeholder: string,
    icon: React.ReactNode,
    type = 'text',
    autoComplete = '',
    readOnly = false,
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
                className="pl-10"
                type={type}
                autoComplete={autoComplete}
                readOnly={readOnly}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Card className="shadow-xl border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-700">
          Personal and Address Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField(
                'name',
                'Full Name',
                'Your full name',
                <User className="h-4 w-4" />,
                'text',
                'name',
                true, // Name read-only
              )}
              {renderField(
                'email',
                'Email Address',
                'Your email address',
                <Mail className="h-4 w-4" />,
                'email',
                'email',
                true, // Email read-only
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField(
                'mobile',
                'Mobile Number',
                'Enter your mobile number',
                <Phone className="h-4 w-4" />,
                'tel',
                'tel',
              )}
              {renderField(
                'rollno',
                'Class 12th Boards Roll Number',
                'Enter your Class 12th Boards roll number',
                <Info className="h-4 w-4" />,
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField(
                'school',
                'School Name',
                'Enter your school name',
                <School className="h-4 w-4" />,
              )}
              <Controller
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <ComboboxField
                    label="Preferred Branch"
                    placeholder="Select your preferred branch"
                    options={[
                      {
                        value: 'B.Tech Computer Science',
                        label: 'B.Tech Computer Science',
                      },
                      { value: 'BCA', label: 'BCA' },
                      {
                        value: 'B.Sc Computer Science',
                        label: 'B.Sc Computer Science',
                      },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <h3 className="text-lg font-medium text-gray-700 border-b pb-2 pt-4">
              Address Details
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {renderField(
                'address1',
                'Address Line 1',
                'Enter your street address',
                <Home className="h-4 w-4" />,
                'text',
                'address-line1',
              )}
              {renderField(
                'address2',
                'Address Line 2 (Optional)',
                'Apartment, suite, unit, etc.',
                <Home className="h-4 w-4" />,
                'text',
                'address-line2',
              )}
              {renderField(
                'area',
                'Area/Locality',
                'E.g., Naini, Gangotri Nagar',
                <MapPin className="h-4 w-4" />,
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                control={form.control}
                name="country"
                render={({ field }) => (
                  <ComboboxField
                    label="Country"
                    placeholder="Select country..."
                    options={countryOptions}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={countryOptions.length === 0}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="state"
                render={({ field }) => (
                  <ComboboxField
                    label="State"
                    placeholder="Select state..."
                    options={stateOptions}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={stateOptions.length === 0}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="city"
                render={({ field }) => (
                  <ComboboxField
                    label="City"
                    placeholder="Select city..."
                    options={cityOptions}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={cityOptions.length === 0}
                  />
                )}
              />
              {renderField(
                'pincode',
                'Postal Code',
                'Enter your postal code',
                <MapPin className="h-4 w-4" />,
                'text',
                'postal-code',
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-8"
              disabled={isLoading}>
              {isLoading ? (
                <>
                  <span>Saving Profile</span>
                  <LoadingSpinner />
                </>
              ) : (
                'Save and Continue'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </Card>
  );
}
