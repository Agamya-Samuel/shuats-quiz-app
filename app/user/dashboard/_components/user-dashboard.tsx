'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, Controller } from 'react-hook-form';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { toast } from '@/hooks/use-toast';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUser, updateUser } from '@/actions/user';
import QuizLoading from '@/app/user/quiz/_components/quiz-loading';
import { useCookies } from '@/contexts/cookie-context';
import { redirect } from 'next/navigation';
import { LoadingSpinner } from '@/components/loading-spinner';
import {
	ComboboxField,
	type ComboboxOption,
} from '@/app/(auth)/register/forms/ComboboxField';
import { Country, State, City } from 'country-state-city';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	User,
	Building,
	MapPin,
	School,
	BookOpen,
	Phone,
	Mail,
	Edit,
	Save,
	X,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Form schema matching our database schema
const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	mobile: z.string().regex(/^[0-9]{10}$/, {
		message: 'Please enter a valid 10-digit mobile number.',
	}),
	school: z.string().min(2, {
		message: 'School name must be at least 2 characters.',
	}),
	rollno: z.string().min(1, {
		message: 'Roll number is required.',
	}),
	branch: z.string().min(2, {
		message: 'Branch must be at least 2 characters.',
	}),
	address1: z.string().min(5, {
		message: 'Address must be at least 5 characters.',
	}),
	address2: z.string().optional(),
	city: z.string().min(2, {
		message: 'City is required',
	}),
	state: z.string().min(2, {
		message: 'State is required',
	}),
	country: z.string().min(2, {
		message: 'Country is required',
	}),
	pincode: z.string().min(5, {
		message: 'Pincode is required',
	}),
	area: z.string().min(2, {
		message: 'Area is required',
	}),
});

// Interface for user data that matches our database schema
interface IUser {
	id: number;
	name: string;
	email: string;
	mobile: string;
	school: string;
	rollno: string;
	branch: string;
	address: {
		id: number;
		country: string | null;
		address1: string | null;
		address2: string | null;
		area: string | null;
		city: string | null;
		pincode: string | null;
		state: string | null;
	} | null;
}

export function UserDashboard() {
	const [isEditing, setIsEditing] = useState(false);
	const [user, setUser] = useState<IUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const defaultTab = 'personal';
	const searchParams = useSearchParams();
	const router = useRouter();
	const { user: currentUser } = useCookies();

	// Get active tab directly from URL params or use default
	const activeTab = searchParams.get('tab') || defaultTab;

	// Update URL when tab changes
	const handleTabChange = (tab: string) => {
		// Update URL without refreshing the page
		router.push(`/user/dashboard?tab=${tab}`, { scroll: false });
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			mobile: '',
			school: '',
			rollno: '',
			branch: '',
			address1: '',
			address2: '',
			city: '',
			state: '',
			country: '',
			pincode: '',
			area: '',
		},
	});

	// Inside UserDashboard, get the country list once (memoized)
	const countryList = useMemo(() => Country.getAllCountries(), []);

	// Watch selected country and state for the dropdown dependencies
	const selectedCountry = useWatch({
		control: form.control,
		name: 'country',
	});

	const selectedState = useWatch({
		control: form.control,
		name: 'state',
	});

	// Prepare options for ComboboxField
	const countryOptions: ComboboxOption[] = useMemo(
		() => countryList.map((c) => ({ value: c.isoCode, label: c.name })),
		[countryList]
	);

	// State options based on selected country
	const stateOptions: ComboboxOption[] = useMemo(() => {
		const countryObj = countryList.find(
			(c) => c.isoCode === selectedCountry
		);
		if (!countryObj) return [];
		return State.getStatesOfCountry(countryObj.isoCode).map((s) => ({
			value: s.isoCode,
			label: s.name,
		}));
	}, [selectedCountry, countryList]);

	// City options based on selected country and state
	const cityOptions: ComboboxOption[] = useMemo(() => {
		const countryObj = countryList.find(
			(c) => c.isoCode === selectedCountry
		);
		if (!countryObj || !selectedState) return [];
		return City.getCitiesOfState(countryObj.isoCode, selectedState).map(
			(c) => ({
				value: c.name,
				label: c.name,
			})
		);
	}, [selectedCountry, selectedState, countryList]);

	// Track previous country and state to avoid unnecessary resets
	const prevCountry = useRef(selectedCountry);
	const prevState = useRef(selectedState);

	// Reset state and city when country changes
	useEffect(() => {
		if (isEditing && prevCountry.current !== selectedCountry) {
			form.setValue('state', '');
			form.setValue('city', '');
			prevCountry.current = selectedCountry;
		}
	}, [selectedCountry, form, isEditing]);

	// Reset city when state changes
	useEffect(() => {
		if (isEditing && prevState.current !== selectedState) {
			form.setValue('city', '');
			prevState.current = selectedState;
		}
	}, [selectedState, form, isEditing]);

	// Redirect if not a user
	useEffect(() => {
		if (currentUser?.role !== 'user') {
			toast({
				title: 'You are not authorized to access this page',
				description: 'Please log in as a user',
				variant: 'destructive',
			});
			redirect('/login');
		}
	}, [currentUser]);

	// Fetch user data from the server
	useEffect(() => {
		const fetchUserData = async () => {
			if (currentUser?.userId) {
				try {
					// Parse userId as a number to fix type mismatch
					const response = await getUser(Number(currentUser.userId));

					if (response.success && response.user) {
						setUser(response.user as IUser);

						// Reset form with user data
						form.reset({
							name: response.user.name || '',
							email: response.user.email || '',
							mobile: response.user.mobile || '',
							school: response.user.school || '',
							rollno: response.user.rollno || '',
							branch: response.user.branch || '',
							address1: response.user.address?.address1 || '',
							address2: response.user.address?.address2 || '',
							city: response.user.address?.city || '',
							state: response.user.address?.state || '',
							country: response.user.address?.country || '',
							pincode: response.user.address?.pincode || '',
							area: response.user.address?.area || '',
						});
					} else {
						toast({
							title: 'Error',
							description:
								response.message || 'Failed to fetch user data',
							variant: 'destructive',
						});
					}
				} catch (error) {
					console.error('Error fetching user data:', error);
					toast({
						title: 'Error',
						description: 'Failed to fetch user data',
						variant: 'destructive',
					});
				}
			}
			setIsLoading(false);
		};

		fetchUserData();
	}, [currentUser, form]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSaving(true);
		try {
			if (!user) throw new Error('User data not available');

			const response = await updateUser(user.id, {
				id: user.id,
				name: values.name,
				email: values.email,
				mobile: values.mobile,
				school: values.school,
				rollno: values.rollno,
				branch: values.branch,
				address: {
					country: values.country,
					address1: values.address1,
					address2: values.address2 || '',
					area: values.area,
					city: values.city,
					pincode: values.pincode,
					state: values.state,
				},
			});

			if (response.success) {
				// Update local user state
				setUser(response.user as IUser);

				toast({
					title: 'Profile updated',
					description: 'Your profile has been successfully updated.',
				});

				// Refresh the page to update the token and user context
				router.refresh();
				setIsEditing(false);
			} else {
				throw new Error(response.message || 'Failed to update profile');
			}
		} catch (err) {
			console.error('Failed to update profile:', err);
			toast({
				title: 'Error',
				description:
					err instanceof Error
						? err.message
						: 'Failed to update profile. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSaving(false);
		}
	}

	if (isLoading) {
		return (
			<div
				className="container mx-auto py-8 px-4 max-w-5xl"
				style={{ minHeight: 'calc(100vh - 150px)' }}
			>
				<QuizLoading message="Loading your profile..." />
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 px-4 max-w-5xl">
			<div className="mb-8">
				<div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
					<Avatar className="w-24 h-24 border-4 border-background shadow-lg">
						<AvatarImage
							src="/placeholder.svg?height=96&width=96"
							alt={user?.name}
						/>
						<AvatarFallback className="text-xl bg-gradient-to-br from-teal-400 to-emerald-600 text-white">
							{user?.name
								? user.name
										.split(' ')
										.map((n) => n[0])
										.join('')
								: '?'}
						</AvatarFallback>
					</Avatar>

					<div className="text-center md:text-left">
						<h1 className="text-2xl md:text-3xl font-bold">
							{user?.name}
						</h1>
						<div className="flex flex-col md:flex-row items-center gap-2 mt-2">
							<Badge
								variant="outline"
								className="flex items-center gap-1"
							>
								<Mail className="h-3 w-3" />
								{user?.email}
							</Badge>
							<Badge
								variant="outline"
								className="flex items-center gap-1"
							>
								<Phone className="h-3 w-3" />
								{user?.mobile}
							</Badge>
						</div>
						<div className="mt-4">
							{!isEditing ? (
								<Button
									onClick={() => setIsEditing(true)}
									className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
								>
									<Edit className="mr-2 h-4 w-4" />
									Edit Profile
								</Button>
							) : (
								<div className="flex gap-2">
									<Button
										type="submit"
										form="profileForm"
										disabled={isSaving}
										className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
									>
										{isSaving ? (
											<>
												<LoadingSpinner />
												<span className="ml-2">
													Saving
												</span>
											</>
										) : (
											<>
												<Save className="mr-2 h-4 w-4" />
												Save
											</>
										)}
									</Button>
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setIsEditing(false);
											form.reset(); // Reset form to original values
										}}
										disabled={isSaving}
									>
										<X className="mr-2 h-4 w-4" />
										Cancel
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>

				<Separator className="my-6" />
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
					id="profileForm"
				>
					<Tabs
						defaultValue={defaultTab}
						value={activeTab}
						onValueChange={handleTabChange}
						className="w-full"
					>
						<TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
							<TabsTrigger
								value="personal"
								className="flex items-center gap-2"
							>
								<User className="h-4 w-4" />
								<span className="hidden sm:inline">
									Personal Information
								</span>
								<span className="sm:hidden">Personal</span>
							</TabsTrigger>
							<TabsTrigger
								value="address"
								className="flex items-center gap-2"
							>
								<MapPin className="h-4 w-4" />
								<span className="hidden sm:inline">
									Address Information
								</span>
								<span className="sm:hidden">Address</span>
							</TabsTrigger>
						</TabsList>

						<TabsContent value="personal">
							<Card className="border-none shadow-md">
								<CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-t-lg">
									<div className="flex items-center gap-2">
										<User className="h-5 w-5 text-teal-600" />
										<CardTitle>
											Personal Information
										</CardTitle>
									</div>
									<CardDescription>
										Your basic profile details
									</CardDescription>
								</CardHeader>

								<CardContent className="pt-6 pb-2">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center gap-2">
														<User className="h-4 w-4 text-muted-foreground" />
														Full Name
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															disabled={
																!isEditing
															}
															className="transition-all focus-within:border-teal-500"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center gap-2">
														<Mail className="h-4 w-4 text-muted-foreground" />
														Email
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															disabled={
																!isEditing
															}
															className="transition-all focus-within:border-teal-500"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="mobile"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center gap-2">
														<Phone className="h-4 w-4 text-muted-foreground" />
														Mobile
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															disabled={
																!isEditing
															}
															className="transition-all focus-within:border-teal-500"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="school"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center gap-2">
														<School className="h-4 w-4 text-muted-foreground" />
														School
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															disabled={
																!isEditing
															}
															className="transition-all focus-within:border-teal-500"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="rollno"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center gap-2">
														<BookOpen className="h-4 w-4 text-muted-foreground" />
														Roll Number
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															disabled={
																!isEditing
															}
															className="transition-all focus-within:border-teal-500"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="branch"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center gap-2">
														<BookOpen className="h-4 w-4 text-muted-foreground" />
														Branch
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															disabled={
																!isEditing
															}
															className="transition-all focus-within:border-teal-500"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="address">
							<Card className="border-none shadow-md">
								<CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-t-lg">
									<div className="flex items-center gap-2">
										<MapPin className="h-5 w-5 text-teal-600" />
										<CardTitle>
											Address Information
										</CardTitle>
									</div>
									<CardDescription>
										Your residential details
									</CardDescription>
								</CardHeader>

								<CardContent className="pt-6 pb-2">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={form.control}
											name="address1"
											render={({ field }) => (
												<FormItem className="md:col-span-2">
													<FormLabel className="flex items-center gap-2">
														<Building className="h-4 w-4 text-muted-foreground" />
														Address Line 1
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															disabled={
																!isEditing
															}
															className="transition-all focus-within:border-teal-500"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="address2"
											render={({ field }) => (
												<FormItem className="md:col-span-2">
													<FormLabel className="flex items-center gap-2">
														<Building className="h-4 w-4 text-muted-foreground" />
														Address Line 2
														(Optional)
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															disabled={
																!isEditing
															}
															className="transition-all focus-within:border-teal-500"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="area"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center gap-2">
														<MapPin className="h-4 w-4 text-muted-foreground" />
														Area
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															disabled={
																!isEditing
															}
															className="transition-all focus-within:border-teal-500"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="pincode"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center gap-2">
														<MapPin className="h-4 w-4 text-muted-foreground" />
														Pincode
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															disabled={
																!isEditing
															}
															className="transition-all focus-within:border-teal-500"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Country Combobox */}
										<Controller
											control={form.control}
											name="country"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center gap-2">
														<MapPin className="h-4 w-4 text-muted-foreground" />
														Country
													</FormLabel>
													<FormControl>
														<ComboboxField
															label=""
															placeholder="Select country"
															options={
																countryOptions
															}
															value={field.value}
															onChange={
																field.onChange
															}
															disabled={
																!isEditing
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* State Combobox */}
										<Controller
											control={form.control}
											name="state"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center gap-2">
														<MapPin className="h-4 w-4 text-muted-foreground" />
														State
													</FormLabel>
													<FormControl>
														<ComboboxField
															label=""
															placeholder="Select state"
															options={
																stateOptions
															}
															value={field.value}
															onChange={
																field.onChange
															}
															disabled={
																!isEditing ||
																!selectedCountry
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* City Combobox */}
										<Controller
											control={form.control}
											name="city"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center gap-2">
														<MapPin className="h-4 w-4 text-muted-foreground" />
														City
													</FormLabel>
													<FormControl>
														<ComboboxField
															label=""
															placeholder="Select city"
															options={
																cityOptions
															}
															value={field.value}
															onChange={
																field.onChange
															}
															disabled={
																!isEditing ||
																!selectedState
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>

					{isEditing && (
						<div className="flex justify-center mt-8">
							<div className="flex gap-4 w-full max-w-md">
								<Button
									type="submit"
									disabled={isSaving}
									className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
								>
									{isSaving ? (
										<>
											<LoadingSpinner />
											<span className="ml-2">
												Saving Changes
											</span>
										</>
									) : (
										<>
											<Save className="mr-2 h-4 w-4" />
											<span>Save Changes</span>
										</>
									)}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setIsEditing(false);
										form.reset(); // Reset form to original values
									}}
									disabled={isSaving}
									className="flex-1"
								>
									<X className="mr-2 h-4 w-4" />
									<span>Cancel</span>
								</Button>
							</div>
						</div>
					)}
				</form>
			</Form>
		</div>
	);
}
