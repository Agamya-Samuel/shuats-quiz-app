'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<nav className="fixed w-full z-50 top-0 bg-neutral-900/90 backdrop-blur-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						<span className="text-2xl font-bold text-white">
							SHUATS
						</span>
					</div>

					<div className="hidden md:block">
						<div className="ml-10 flex items-baseline space-x-4">
							{[
								'Home',
								'Facilities',
								'Academics',
								'Campus Life',
								'Infrastructure',
								'Gallery',
								'Testimonials',
								'Contact',
							].map((item) => (
								<Link
									key={item}
									href={`#${item
										.toLowerCase()
										.replace(' ', '')}`}
									className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
								>
									{item}
								</Link>
							))}
						</div>
					</div>

					<div className="md:hidden">
						<Button
							variant="ghost"
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-neutral-800 focus:outline-none"
							onClick={() =>
								setIsMobileMenuOpen(!isMobileMenuOpen)
							}
						>
							<span className="sr-only">Open main menu</span>
							{isMobileMenuOpen ? (
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							) : (
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							)}
						</Button>
					</div>
				</div>
			</div>

			{isMobileMenuOpen && (
				<div className="md:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						{[
							'Home',
							'Facilities',
							'Academics',
							'Campus Life',
							'Infrastructure',
							'Gallery',
							'Testimonials',
							'Contact',
						].map((item) => (
							<Link
								key={item}
								href={`#${item.toLowerCase().replace(' ', '')}`}
								className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
							>
								{item}
							</Link>
						))}
					</div>
				</div>
			)}
		</nav>
	);
}
