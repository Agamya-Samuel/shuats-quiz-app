'use client';

import type React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { registerUser } from '@/actions/user';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import type * as z from 'zod';
import { registrationSchema } from '@/schemas/forms/registration-schema';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/loading-spinner';
import Link from 'next/link';
import type { AddressData } from '@/types/user';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Info,
	Mail,
	Phone,
	School,
	User,
	MapPin,
	Home,
	Lock,
	AlertCircle,
	Eye,
	EyeOff,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ComboboxField, ComboboxOption } from './ComboboxField';
import { Controller } from 'react-hook-form';
import { Country, State, City } from 'country-state-city';

// Define the types for the response and error
interface RegisterResponse {
	success: boolean;
	message: string;
	error?: string;
	userId?: number;
	user?: {
		id: number;
		name: string;
		email: string;
		mobile: string;
		school: string;
		rollno: string;
		branch: string;
		address: {
			id: number;
			country: string;
			address1: string;
			address2: string | null;
			area: string;
			city: string;
			pincode: string;
			state: string;
		};
	};
	autoLogin?: boolean;
}

// Password strength calculation
const calculatePasswordStrength = (
	password: string
): {
	score: number;
	criteria: {
		length: boolean;
		uppercase: boolean;
		lowercase: boolean;
		numbers: boolean;
		special: boolean;
	};
	isValid: boolean;
} => {
	if (!password)
		return {
			score: 0,
			criteria: {
				length: false,
				uppercase: false,
				lowercase: false,
				numbers: false,
				special: false,
			},
			isValid: false,
		};

	let strength = 0;
	const criteria = {
		length: password.length >= 8,
		uppercase: /[A-Z]/.test(password),
		lowercase: /[a-z]/.test(password),
		numbers: /[0-9]/.test(password),
		special: /[^A-Za-z0-9]/.test(password),
	};

	// Add points for each criterion
	if (criteria.length) strength += 20;
	if (criteria.uppercase) strength += 20;
	if (criteria.lowercase) strength += 20;
	if (criteria.numbers) strength += 20;
	if (criteria.special) strength += 20;

	return {
		score: strength,
		criteria,
		isValid: Object.values(criteria).every(Boolean),
	};
};

// Get color based on password strength
const getStrengthColor = (strength: number): string => {
	if (strength < 40) return 'bg-red-500';
	if (strength < 80) return 'bg-yellow-500';
	return 'bg-green-500';
};

// Get strength label
const getStrengthLabel = (strength: number): string => {
	if (strength < 40) return 'Weak';
	if (strength < 80) return 'Moderate';
	return 'Strong';
};

export function RegistrationForm() {
	const { toast } = useToast();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] =
		useState<boolean>(false);
	const [passwordStrength, setPasswordStrength] = useState<{
		score: number;
		criteria: {
			length: boolean;
			uppercase: boolean;
			lowercase: boolean;
			numbers: boolean;
			special: boolean;
		};
		isValid: boolean;
	}>({
		score: 0,
		criteria: {
			length: false,
			uppercase: false,
			lowercase: false,
			numbers: false,
			special: false,
		},
		isValid: false,
	});
	const [activeTab, setActiveTab] = useState<string>('personal');

	const form = useForm<z.infer<typeof registrationSchema>>({
		resolver: zodResolver(registrationSchema),
		mode: 'onChange', // Enable real-time validation
		defaultValues: {
			email: '',
			name: '',
			mobile: '',
			rollno: '',
			school: '',
			branch: '',
			country: 'IN', // India's ISO code
			address1: '',
			address2: '',
			area: '',
			city: '',
			pincode: '',
			state: 'UP', // Uttar Pradesh's code
			password: '',
			confirmPassword: '',
		},
	});

	// Watch the password field directly
	const password = useWatch({
		control: form.control,
		name: 'password',
		defaultValue: '',
	});

	// Update password strength when password changes
	useEffect(() => {
		setPasswordStrength(calculatePasswordStrength(password));
	}, [password]);

	// Manual tab change handler
	const handleManualTabChange = (value: string) => {
		setActiveTab(value);
	};

	// Inside RegistrationForm, get the country list once (memoized)
	const countryList = useMemo(() => Country.getAllCountries(), []);

	// 2. In RegistrationForm, watch selected country and state
	const selectedCountry = form.watch('country');
	const selectedState = form.watch('state');

	// Prepare options for ComboboxField
	const countryOptions: ComboboxOption[] = useMemo(
		() => countryList.map((c) => ({ value: c.isoCode, label: c.name })),
		[countryList]
	);

	// Fix: Use isoCode for lookup, since country value is isoCode
	const stateOptions: ComboboxOption[] = useMemo(() => {
		// Find country by isoCode, not name
		const countryObj = countryList.find(
			(c) => c.isoCode === selectedCountry
		);
		if (!countryObj) return [];
		// Use state.isoCode for value, and state.name for label
		return State.getStatesOfCountry(countryObj.isoCode).map((s) => ({
			value: s.isoCode,
			label: s.name,
		}));
	}, [selectedCountry, countryList]);

	const cityOptions: ComboboxOption[] = useMemo(() => {
		// Find country by isoCode, not name
		const countryObj = countryList.find(
			(c) => c.isoCode === selectedCountry
		);
		if (!countryObj || !selectedState) return [];
		// No need to find state object, just use selectedState directly (which is now the isoCode)
		return City.getCitiesOfState(countryObj.isoCode, selectedState).map(
			(c) => ({
				value: c.name,
				label: c.name,
			})
		);
	}, [selectedCountry, selectedState, countryList]);

	// Track previous country and state to only reset when they actually change
	const prevCountry = useRef(selectedCountry);
	const prevState = useRef(selectedState);

	useEffect(() => {
		if (prevCountry.current !== selectedCountry) {
			// Only reset if country actually changed
			form.setValue('state', '');
			form.setValue('city', '');
			prevCountry.current = selectedCountry;
		}
	}, [selectedCountry, form]);

	useEffect(() => {
		if (prevState.current !== selectedState) {
			// Only reset if state actually changed
			form.setValue('city', '');
			prevState.current = selectedState;
		}
	}, [selectedState, form]);

	function onSubmit(values: z.infer<typeof registrationSchema>) {
		setIsLoading(true);

		// Create address object from form values
		const address: AddressData = {
			country: values.country,
			address1: values.address1,
			address2: values.address2,
			area: values.area,
			city: values.city,
			pincode: values.pincode,
			state: values.state,
		};

		// Save user data to database
		registerUser({
			email: values.email,
			name: values.name,
			mobile: values.mobile,
			rollno: values.rollno,
			school: values.school,
			branch: values.branch,
			password: values.password,
			address: address,
		})
			.then((response: RegisterResponse) => {
				setIsLoading(false); // Stop loading
				if (response.success) {
					toast({
						title: 'Registration Successful',
						description: 'You have been automatically logged in.',
						variant: 'success',
					});
					setTimeout(() => {
						// Redirect to document-upload page after successful registration and auto-login
						router.push('/user/document-upload');
					}, 1000);
				} else {
					toast({
						title: 'Registration Failed',
						description: response.message || response.error,
						variant: 'destructive',
					});
				}
			})
			.catch((error: Error) => {
				setIsLoading(false); // Stop loading on error
				toast({
					title: 'Registration Error',
					description: `An unexpected error occurred: ${error.message}. Please try again later.`,
					variant: 'destructive',
				});
			});
	}

	// Helper function to render form field with icon
	const renderField = (
		name: keyof z.infer<typeof registrationSchema>,
		label: string,
		placeholder: string,
		icon: React.ReactNode,
		type = 'text',
		autoComplete = ''
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
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-4xl mx-auto shadow-lg">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">
						Create Your Account
					</CardTitle>
					<CardDescription>
						Fill in your details to register for a new account
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
						>
							<Tabs
								value={activeTab}
								onValueChange={handleManualTabChange}
								className="w-full"
							>
								<TabsList className="grid w-full grid-cols-3">
									<TabsTrigger
										value="personal"
										className="relative"
									>
										Personal Info
									</TabsTrigger>
									<TabsTrigger
										value="address"
										className="relative"
									>
										Address
									</TabsTrigger>
									<TabsTrigger
										value="password"
										className="relative"
									>
										Password
									</TabsTrigger>
								</TabsList>

								{/* Personal Information Tab */}
								<TabsContent value="personal" className="mt-6">
									<div className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{renderField(
												'name',
												'Full Name',
												'Enter your full name',
												<User className="h-4 w-4" />,
												'text',
												'name'
											)}

											{renderField(
												'email',
												'Email Address',
												'Enter your email address',
												<Mail className="h-4 w-4" />,
												'email',
												'email'
											)}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{renderField(
												'mobile',
												'Mobile Number',
												'Enter your mobile number',
												<Phone className="h-4 w-4" />,
												'tel',
												'tel'
											)}

											{renderField(
												'rollno',
												'Roll Number',
												'Enter your roll number',
												<Info className="h-4 w-4" />
											)}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{renderField(
												'school',
												'School Name',
												'Enter your school name',
												<School className="h-4 w-4" />
											)}

											{renderField(
												'branch',
												'Preferred Branch',
												'Enter your preferred branch',
												<Info className="h-4 w-4" />
											)}
										</div>

										<div className="flex justify-end mt-4">
											<Button
												type="button"
												onClick={() =>
													handleManualTabChange(
														'address'
													)
												}
											>
												Next: Address
											</Button>
										</div>
									</div>
								</TabsContent>

								{/* Address Information Tab */}
								<TabsContent value="address" className="mt-6">
									<div className="space-y-4">
										<div className="grid grid-cols-1 gap-4">
											{renderField(
												'address1',
												'Address Line 1',
												'Enter your street address',
												<Home className="h-4 w-4" />,
												'text',
												'address-line1'
											)}

											{renderField(
												'address2',
												'Address Line 2 (Optional)',
												'Apartment, suite, unit, building, floor, etc.',
												<Home className="h-4 w-4" />,
												'text',
												'address-line2'
											)}

											{renderField(
												'area',
												'Area/Locality',
												// 'Enter your area or locality',
												'Eg. Naini, Gangotri Nagar',
												<MapPin className="h-4 w-4" />
											)}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{/* Country Combobox - should appear first */}
											<Controller
												control={form.control}
												name="country"
												render={({ field }) => (
													<ComboboxField
														label="Country"
														placeholder="Select country..."
														options={countryOptions}
														value={field.value}
														onChange={
															field.onChange
														}
														disabled={
															countryOptions.length ===
															0
														}
													/>
												)}
											/>
											{/* State Combobox */}
											<Controller
												control={form.control}
												name="state"
												render={({ field }) => (
													<ComboboxField
														label="State"
														placeholder="Select state..."
														options={stateOptions}
														value={field.value}
														onChange={
															field.onChange
														}
														disabled={
															stateOptions.length ===
															0
														}
													/>
												)}
											/>
											{/* City Combobox */}
											<Controller
												control={form.control}
												name="city"
												render={({ field }) => (
													<ComboboxField
														label="City"
														placeholder="Select city..."
														options={cityOptions}
														value={field.value}
														onChange={
															field.onChange
														}
														disabled={
															cityOptions.length ===
															0
														}
													/>
												)}
											/>
											{/* Pincode field - moved to come after City */}
											{renderField(
												'pincode',
												'Pincode',
												'Enter your pincode',
												<MapPin className="h-4 w-4" />,
												'text',
												'postal-code'
											)}
										</div>

										<div className="flex justify-between mt-4">
											<Button
												type="button"
												variant="outline"
												onClick={() =>
													handleManualTabChange(
														'personal'
													)
												}
											>
												Back
											</Button>
											<Button
												type="button"
												onClick={() =>
													handleManualTabChange(
														'password'
													)
												}
											>
												Next: Password
											</Button>
										</div>
									</div>
								</TabsContent>

								{/* Password Tab */}
								<TabsContent value="password" className="mt-6">
									<div className="space-y-4">
										<Alert>
											<AlertCircle className="h-4 w-4" />
											<AlertTitle>
												Password Requirements
											</AlertTitle>
											<AlertDescription>
												<ul className="list-disc pl-5 text-sm mt-2">
													<li
														className={
															passwordStrength
																.criteria.length
																? 'text-green-600'
																: 'text-red-600'
														}
													>
														At least 8 characters
														long
													</li>
													<li
														className={
															passwordStrength
																.criteria
																.uppercase
																? 'text-green-600'
																: 'text-red-600'
														}
													>
														Include at least one
														uppercase letter
													</li>
													<li
														className={
															passwordStrength
																.criteria
																.lowercase
																? 'text-green-600'
																: 'text-red-600'
														}
													>
														Include at least one
														lowercase letter
													</li>
													<li
														className={
															passwordStrength
																.criteria
																.numbers
																? 'text-green-600'
																: 'text-red-600'
														}
													>
														Include at least one
														number
													</li>
													<li
														className={
															passwordStrength
																.criteria
																.special
																? 'text-green-600'
																: 'text-red-600'
														}
													>
														Include at least one
														special character
													</li>
												</ul>
											</AlertDescription>
										</Alert>

										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Password
													</FormLabel>
													<FormControl>
														<div className="relative">
															<div className="absolute left-3 top-3 text-muted-foreground">
																<Lock className="h-4 w-4" />
															</div>
															<Input
																type={
																	showPassword
																		? 'text'
																		: 'password'
																}
																placeholder="Create a secure password"
																className="pl-10 pr-10"
																autoComplete="new-password"
																{...field}
															/>
															<button
																type="button"
																onClick={() =>
																	setShowPassword(
																		!showPassword
																	)
																}
																className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
																tabIndex={-1}
															>
																{showPassword ? (
																	<EyeOff className="h-4 w-4" />
																) : (
																	<Eye className="h-4 w-4" />
																)}
															</button>
														</div>
													</FormControl>
													{/* Password strength meter */}
													<div className="mt-2 text-[0.8rem] text-muted-foreground">
														<div className="flex items-center justify-between mb-1">
															<span className="text-sm">
																Password
																Strength:
															</span>
															<span className="text-sm font-medium">
																{getStrengthLabel(
																	passwordStrength.score
																)}
															</span>
														</div>
														<div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
															<div
																className={`h-full absolute left-0 top-0 transition-all ${getStrengthColor(
																	passwordStrength.score
																)}`}
																style={{
																	width: `${passwordStrength.score}%`,
																}}
															/>
														</div>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="confirmPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Confirm Password
													</FormLabel>
													<FormControl>
														<div className="relative">
															<div className="absolute left-3 top-3 text-muted-foreground">
																<Lock className="h-4 w-4" />
															</div>
															<Input
																type={
																	showConfirmPassword
																		? 'text'
																		: 'password'
																}
																placeholder="Confirm your password"
																className="pl-10 pr-10"
																autoComplete="new-password"
																{...field}
															/>
															<button
																type="button"
																onClick={() =>
																	setShowConfirmPassword(
																		!showConfirmPassword
																	)
																}
																className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
																tabIndex={-1}
															>
																{showConfirmPassword ? (
																	<EyeOff className="h-4 w-4" />
																) : (
																	<Eye className="h-4 w-4" />
																)}
															</button>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="flex justify-between mt-4">
											<Button
												type="button"
												variant="outline"
												onClick={() =>
													handleManualTabChange(
														'address'
													)
												}
											>
												Back
											</Button>
											<Button
												type="submit"
												disabled={
													isLoading ||
													!passwordStrength.isValid
												}
												className="min-w-[120px]"
											>
												{isLoading ? (
													<>
														<span>Registering</span>
														<LoadingSpinner />
													</>
												) : (
													'Complete Registration'
												)}
											</Button>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</form>
					</Form>
				</CardContent>

				<CardFooter className="flex flex-col items-center justify-center pt-2 pb-6">
					<p className="text-sm text-muted-foreground">
						Already have an account?{' '}
						<Link
							href="/login"
							className="font-medium text-indigo-600 hover:text-indigo-700 underline"
						>
							Login
						</Link>
					</p>
					<p className="text-xs text-muted-foreground mt-2">
						By registering, you agree to our{' '}
						<Link
							href="/terms"
							className="underline hover:text-primary"
						>
							Terms of Service
						</Link>{' '}
						and{' '}
						<Link
							href="/privacy"
							className="underline hover:text-primary"
						>
							Privacy Policy
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
