// components/navbar.tsx

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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { logo } from '@/public/images';
import Image from 'next/image';
import { getUserProfilePicture } from '@/actions/user';

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
	const [hasLoadedProfilePhoto, setHasLoadedProfilePhoto] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { user: currentUser } = useCookies();
	const router = useRouter();
	const { toast } = useToast();

	// Fetch profile picture from documents
	const fetchProfilePhoto = useCallback(async () => {
		if (!currentUser?.userId || hasLoadedProfilePhoto) return;

		try {
			setHasLoadedProfilePhoto(true);

			const response = await getUserProfilePicture(
				Number(currentUser.userId)
			);

			if (response.success && response.profilePicture) {
				// Find profile photo document
				const profileDoc = response.profilePicture;

				if (profileDoc?.fileUrl) {
					// Add a timestamp to prevent browser caching
					setProfilePhotoUrl(
						`${profileDoc.fileUrl}?t=${new Date().getTime()}`
					);
				}
			}
		} catch (error) {
			console.error('Error fetching profile photo:', error);
		}
	}, [currentUser?.userId, hasLoadedProfilePhoto]);

	// Update user data when currentUser changes
	useEffect(() => {
		if (currentUser) {
			setUser({
				name:
					(currentUser.role === 'admin'
						? currentUser.username
						: currentUser.name) || '',
				school:
					(currentUser.role === 'admin'
						? 'ADMIN'
						: currentUser.school) || '',
				email:
					(currentUser.role === 'admin'
						? 'ADMIN'
						: currentUser.email) || '',
			});
		} else {
			setUser(null);
			setProfilePhotoUrl(null);
		}
		setIsLoading(false);
	}, [currentUser]);

	// Load profile photo on initial render - avoid circular dependencies
	useEffect(() => {
		if (currentUser?.userId && !hasLoadedProfilePhoto) {
			fetchProfilePhoto();
		}
	}, [currentUser?.userId, hasLoadedProfilePhoto, fetchProfilePhoto]);

	// Listen for profile photo update events
	useEffect(() => {
		// Create event handler to refresh profile photo
		const handleProfilePhotoUpdate = () => {
			setHasLoadedProfilePhoto(false); // Reset so we can fetch again
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
	}, []);

	// Handle dropdown opening
	const handleDropdownOpenChange = (open: boolean) => {
		setIsDropdownOpen(open);
		if (open && !hasLoadedProfilePhoto) {
			fetchProfilePhoto();
		}
	};

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
					<DropdownMenu
						open={isDropdownOpen}
						onOpenChange={handleDropdownOpenChange}
					>
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
									href="/user/document-upload"
									className="w-full cursor-pointer"
								>
									<Briefcase className="h-5 w-5 text-amber-500" />
									Documents
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
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleLogout}>
								<LogOut className="h-5 w-5 text-red-500" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}
