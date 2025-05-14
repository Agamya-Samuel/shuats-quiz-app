// components/Navbar.tsx

'use client';

import {
	LogOut,
	Trophy,
	BarChart,
	Timer,
	LayoutDashboard,
	Briefcase,
	User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect, useCallback } from 'react';
import { useCookies } from '@/contexts/cookie-context';
import { logout } from '@/actions/logout';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { getUserDocuments } from '@/actions/upload';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { logo } from '@/public/images';
import Image from 'next/image';

interface IUser {
	name: string;
	school: string;
	email: string;
}

// Define props interface for Navbar component
interface NavbarProps {
	showTime?: boolean; // Optional prop with default value
}

export default function Navbar({ showTime = true }: NavbarProps) {
	const [user, setUser] = useState<IUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
	const { user: currentUser } = useCookies();
	const router = useRouter();
	const { toast } = useToast();

	// Create a fetchProfilePhoto function that can be reused
	const fetchProfilePhoto = useCallback(async () => {
		if (currentUser?.userId && currentUser.role === 'user') {
			try {
				const response = await getUserDocuments();

				if (response.success && response.documents) {
					// Find profile photo document
					const profileDoc = response.documents.find(
						(doc) => doc.documentType === 'profile_pic'
					);

					if (profileDoc?.fileUrl) {
						// Add a timestamp to prevent browser caching
						setProfilePhotoUrl(
							`${profileDoc.fileUrl}?t=${new Date().getTime()}`
						);
					} else {
						setProfilePhotoUrl(null);
					}
				}
			} catch (error) {
				console.error('Error fetching profile photo:', error);
			}
		}
	}, [currentUser?.userId, currentUser?.role]);

	// Update user data when currentUser changes
	useEffect(() => {
		if (currentUser) {
			setUser({
				name:
					(currentUser.role === 'maintainer'
						? currentUser.username
						: currentUser.name) || '',
				school:
					(currentUser.role === 'maintainer'
						? 'ADMIN'
						: currentUser.school) || '',
				email:
					(currentUser.role === 'maintainer'
						? 'ADMIN'
						: currentUser.email) || '',
			});
		} else {
			setUser(null);
		}
		setIsLoading(false);
	}, [currentUser]);

	// Initial profile photo fetch
	useEffect(() => {
		fetchProfilePhoto();
	}, [fetchProfilePhoto]);

	// Listen for profile photo update events
	useEffect(() => {
		// Create event handler to refresh profile photo
		const handleProfilePhotoUpdate = () => {
			fetchProfilePhoto();
		};

		// Add event listener
		window.addEventListener(
			'profile-photo-updated',
			handleProfilePhotoUpdate
		);

		// Clean up
		return () => {
			window.removeEventListener(
				'profile-photo-updated',
				handleProfilePhotoUpdate
			);
		};
	}, [fetchProfilePhoto]);

	const handleLogout = async () => {
		try {
			await logout();
			toast({
				title: 'Logged out successfully',
				description: 'You have been logged out.',
				variant: 'success',
			});
			router.push('/login');
			router.refresh(); // Refresh to update cookie context
		} catch (err) {
			console.error('Logout error:', err);
			toast({
				title: 'Error',
				description: 'Failed to logout. Please try again.',
				variant: 'destructive',
			});
		}
	};

	if (isLoading) {
		// create a animated pulsing loading skeleton
		return (
			<div className="bg-white border-b">
				<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
					<div className="h-20 w-20 bg-gray-200 rounded-full animate-pulse"></div>
					<div className="flex items-center space-x-4">
						<div className="flex flex-col gap-1">
							<div className="h-5 w-40 bg-gray-200 rounded-sm animate-pulse"></div>
							<div className="h-5 w-52 bg-gray-200 rounded-sm animate-pulse"></div>
							<div className="h-5 w-52 bg-gray-200 rounded-sm animate-pulse"></div>
						</div>
						<div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white border-b">
			<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
				<div>
					<Image
						src={logo}
						alt="SHIATS Logo"
						width={75}
						height={75}
						priority
						quality={60}
						style={{
							width: '75px',
							height: 'auto',
						}}
					/>
				</div>
				<div className="flex items-center space-x-4">
					<div>
						<h2 className="font-semibold">
							{user?.name || 'Guest'}
						</h2>
						<p className="text-sm text-gray-500">
							{user?.school
								? user.school.length > 30
									? user.school.slice(0, 30) + '...'
									: user.school
								: 'No School'}
						</p>
						<p className="text-sm text-gray-500">
							{user?.email || 'No Email'}
						</p>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<div className="flex items-center space-x-2 cursor-pointer">
								<Avatar className="h-12 w-12">
									<AvatarImage
										src={profilePhotoUrl || undefined}
										alt={user?.name || 'User'}
									/>
									<AvatarFallback className="bg-amber-100 text-amber-800">
										{user?.name
											? user.name
													.split(' ')
													.map((n) => n[0])
													.join('')
											: 'U'}
									</AvatarFallback>
								</Avatar>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-48">
							<DropdownMenuItem asChild>
								<Link
									href="/user/quiz"
									className="w-full cursor-pointer"
								>
									{showTime ? (
										<Timer className="h-5 w-5 text-green-600" />
									) : (
										<LayoutDashboard className="h-5 w-5 text-green-600" />
									)}
									Quiz
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link
									href="/user/profile"
									className="w-full cursor-pointer"
								>
									<User className="h-5 w-5 text-amber-500" />
									My Profile
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									href="/user/result"
									className="w-full cursor-pointer"
								>
									<BarChart className="h-5 w-5 text-amber-500" />
									Results
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									href="/user/leaderboard"
									className="w-full cursor-pointer"
								>
									<Trophy className="h-5 w-5 text-amber-500" />
									Leaderboard
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									href="/user/career-guidance"
									className="w-full cursor-pointer"
								>
									<Briefcase className="h-5 w-5 text-amber-500" />
									Career Guidance
								</Link>
							</DropdownMenuItem>
							{user && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="text-red-600 cursor-pointer"
										onClick={handleLogout}
									>
										<LogOut className="h-4 w-4 mr-2" />
										Logout
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}
