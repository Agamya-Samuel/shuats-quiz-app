// components/Navbar.tsx

import { Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { useCookies } from '@/contexts/cookie-context';

interface NavbarProps {
	showTime?: boolean;
}

interface IUser {
	name: string;
	school: string;
	email: string;
}

export default function Navbar({ showTime = false }: NavbarProps) {
	const maxTimeInHours = 0.01;
	const [user, setUser] = useState<IUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { user: currentUser } = useCookies();

	// Update user data when currentUser changes
	useEffect(() => {
		if (currentUser) {
			setUser({
				name: (currentUser.role === 'maintainer' ? currentUser.username : currentUser.name) || '',
				school: (currentUser.role === 'maintainer' ? 'ADMIN' : currentUser.school) || '',
				email: (currentUser.role === 'maintainer' ? 'ADMIN' : currentUser.email) || '',
			});
		} else {
			setUser(null);
		}
		setIsLoading(false);
	}, [currentUser]); // Add currentUser to dependency array

	const [timeRemaining, setTimeRemaining] = useState(
		maxTimeInHours * 60 * 60
	); // 30 seconds in seconds

	useEffect(() => {
		if (showTime) {
			const timer = setInterval(() => {
				setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [showTime]);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
			.toString()
			.padStart(2, '0')}`;
	};

	if (isLoading) {
		// create a animated pulsing loading skeleton
		return (
			<div className="bg-white border-b">
				<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
						<div className="flex flex-col gap-1">
							<div className="h-5 w-32 bg-gray-200 rounded-sm animate-pulse"></div>
							<div className="h-5 w-24 bg-gray-200 rounded-sm animate-pulse"></div>
							<div className="h-5 w-24 bg-gray-200 rounded-sm animate-pulse"></div>
						</div>
					</div>
					<div className="h-8 w-24 bg-gray-200 rounded-sm animate-pulse"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white border-b">
			<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<Avatar className="h-12 w-12">
						<AvatarImage
							src="/placeholder.svg?height=48&width=48"
							alt="User"
						/>
						<AvatarFallback>
							{user?.name
								? user.name
										.split(' ')
										.map((n) => n[0])
										.join('')
								: '?'}
						</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="font-semibold">
							{user?.name || 'Guest'}
						</h2>
						<p className="text-sm text-gray-500">
							{user?.school ? (user.school.length > 30 ? user.school.slice(0, 30) + '...' : user.school) : 'No School'}
						</p>
						<p className="text-sm text-gray-500">
							{user?.email || 'No Email'}
						</p>
					</div>
				</div>
				<div className="flex items-center space-x-2 text-lg font-semibold">
					{showTime && (
						<>
							<Clock className="h-5 w-5" />
							<span>{formatTime(timeRemaining)}</span>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
