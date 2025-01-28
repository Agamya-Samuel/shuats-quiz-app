'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';

interface NavItem {
	title: string;
	href: string;
	icon?: React.ReactNode;
	submenu?: NavItem[];
}

const navItems: NavItem[] = [
	{
		title: 'Dashboard',
		href: '/dashboard',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="w-4 h-4 mr-2"
			>
				<rect x="3" y="3" width="7" height="7"></rect>
				<rect x="14" y="3" width="7" height="7"></rect>
				<rect x="14" y="14" width="7" height="7"></rect>
				<rect x="3" y="14" width="7" height="7"></rect>
			</svg>
		),
	},
	{
		title: 'Courses',
		href: '/courses',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="w-4 h-4 mr-2"
			>
				<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
				<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
			</svg>
		),
		submenu: [
			{ title: 'All Courses', href: '/courses' },
			{ title: 'Add Course', href: '/courses/add' },
		],
	},
	{
		title: 'Students',
		href: '/students',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="w-4 h-4 mr-2"
			>
				<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
				<circle cx="9" cy="7" r="4"></circle>
				<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
				<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
			</svg>
		),
	},
	{
		title: 'Settings',
		href: '/settings',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="w-4 h-4 mr-2"
			>
				<circle cx="12" cy="12" r="3"></circle>
				<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
			</svg>
		),
	},
];

export function Sidebar() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	const NavItems = ({
		items,
		mobile = false,
	}: {
		items: NavItem[];
		mobile?: boolean;
	}) => {
		return (
			<>
				{items.map((item, index) => (
					<div key={index}>
						{item.submenu ? (
							<Collapsible>
								<CollapsibleTrigger asChild>
									<Button
										variant="ghost"
										className={cn(
											'w-full justify-between',
											pathname.startsWith(item.href)
												? 'bg-muted'
												: 'hover:bg-muted'
										)}
									>
										<span className="flex items-center">
											{item.icon}
											{item.title}
										</span>
										<ChevronDown className="h-4 w-4" />
									</Button>
								</CollapsibleTrigger>
								<CollapsibleContent className="pl-4">
									<NavItems items={item.submenu} />
								</CollapsibleContent>
							</Collapsible>
						) : (
							<Button
								asChild
								variant="ghost"
								className={cn(
									'w-full justify-start',
									pathname === item.href
										? 'bg-muted'
										: 'hover:bg-muted'
								)}
							>
								<Link href={item.href}>
									{item.icon}
									{item.title}
								</Link>
							</Button>
						)}
					</div>
				))}
			</>
		);
	};

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="md:hidden">
						<Menu className="h-6 w-6" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-64 p-0">
					<ScrollArea className="h-full py-6">
						<div className="px-4 py-2">
							<h2 className="text-lg font-semibold">
								Navigation
							</h2>
						</div>
						<NavItems items={navItems} mobile />
					</ScrollArea>
				</SheetContent>
			</Sheet>
			<div className="hidden h-screen w-64 flex-col md:flex">
				<ScrollArea className="flex-1 py-6">
					<div className="px-4 py-2">
						<h2 className="text-lg font-semibold">Navigation</h2>
					</div>
					<NavItems items={navItems} />
				</ScrollArea>
			</div>
		</>
	);
}
