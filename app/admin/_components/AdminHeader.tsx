'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	LayoutDashboard,
	Menu,
	Bell,
	Settings,
	LogOut,
	FileQuestion,
	CheckSquare,
} from 'lucide-react';
import { useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AdminSidebar } from './AdminSidebar';
import { useToast } from '@/hooks/use-toast';
import { logout } from '@/actions/logout';

export function AdminHeader() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	const handleLogout = async () => {
		try {
			await logout();
			toast({
				title: 'Logged out successfully',
				description: 'You have been logged out.',
				variant: 'success',
			});
			router.push('/admin/login');
			router.refresh();
		} catch (err) {
			console.error('Logout error:', err);
			toast({
				title: 'Error',
				description: 'Failed to logout. Please try again.',
				variant: 'destructive',
			});
		}
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="mr-4 hidden md:flex">
					<Link
						href="/admin"
						className="mr-6 flex items-center space-x-2"
					>
						<LayoutDashboard className="h-6 w-6 text-primary" />
						<span className="font-bold">SHUATS Admin</span>
					</Link>
					<nav className="flex items-center space-x-6 text-sm font-medium">
						<Link
							href="/admin?section=dashboard"
							className="transition-colors hover:text-foreground/80 text-foreground"
						>
							Dashboard
						</Link>
						<Link
							href="/admin?section=manage-quiz"
							className="transition-colors hover:text-foreground/80 text-foreground/60"
						>
							Manage Quiz
						</Link>
						<Link
							href="/admin?section=verification"
							className="transition-colors hover:text-foreground/80 text-foreground/60"
						>
							Verification
						</Link>
					</nav>
				</div>
				<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="mr-2 md:hidden"
						>
							<Menu className="h-5 w-5" />
							<span className="sr-only">Toggle Menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="pr-0">
						<div className="flex flex-col h-full">
							<div className="flex items-center h-14 px-4 border-b">
								<Link
									href="/admin"
									className="flex items-center gap-2 font-semibold"
								>
									<LayoutDashboard className="h-6 w-6 text-primary" />
									<span>SHUATS Admin</span>
								</Link>
							</div>
							<div className="flex-1 overflow-auto py-2">
								<AdminSidebar />
							</div>
						</div>
					</SheetContent>
				</Sheet>
				<div className="flex items-center justify-end flex-1 space-x-2">
					<nav className="flex items-center">
						<Button variant="ghost" size="icon">
							<Bell className="h-5 w-5" />
							<span className="sr-only">Notifications</span>
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full"
								>
									<div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
										A
									</div>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>
									Admin Account
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Settings className="mr-2 h-4 w-4" />
									<span>Settings</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout}>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>
				</div>
			</div>
		</header>
	);
}
